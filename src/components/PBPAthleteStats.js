import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useRef } from 'react';
import {
  Animated,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Colors, Elevations } from '_styles';

const getPercentage = (numerator, denominator) => {
  const result = ((numerator / denominator) * 100).toFixed(1);
  return !isNaN(result) ? result : 0;
};

const getAthleteName = (athleteId, team) => {
  const name =
    team == 'uprm'
      ? [athleteId.first_name, athleteId.middle_name, athleteId.last_names]
          .filter(Boolean)
          .join(' ')
      : athleteId.name;
  return name;
};

// sport: Give sport name to know which table to render
// gameActions: all game actions from firebase to calculate statistics
// team: either 'uprm' or 'opponent'
// roster: roster corresponding to the team
const PBPAthleteStats = ({ sport, gameActions, team, roster }) => {
  const [stats, setStats] = useState({});

  // Sync header scroll with list scroll
  const headerScrollView = useRef(null);
  const scrollPosition = useRef(new Animated.Value(0));
  const scrollEvent = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollPosition.current } } }],
    { useNativeDriver: false }
  );

  useEffect(() => {
    // Attach listener to scroll position
    scrollPosition.current.addListener(position => {
      headerScrollView.current.scrollTo({
        x: position.value,
        animated: false,
      });
    });
  }, []);

  useEffect(() => {
    /* 
    Initialized roster. A roster is an object where keys have other
    objects as values. The main key is athlete id and the value
    is athlete info.
    */
    const teamRoster = {};
    // Add Stats to every athlete
    Object.entries(roster ?? {}).forEach(([key, value]) => {
      // Merge athlete info with sport stats
      teamRoster[key] = { ...value, ...athleteStats[sport] };
    });
    for (const action of gameActions) {
      // If action does not correspond to team than skip
      if (action.team == team) {
        // The statistics must be valid according to the dictionary
        if (athleteStats[sport].hasOwnProperty(action.action_type)) {
          const athleteId = `athlete-${action.athlete_id}`;
          const actionType = action.action_type;
          // Check if athlete is in roster
          if (teamRoster.hasOwnProperty(athleteId)) {
            teamRoster[athleteId][actionType]++;
            switch (actionType) {
              case 'BlockPoint':
                teamRoster[athleteId]['Block']++;
                break;
              case 'Goal':
                teamRoster[athleteId]['GoalAttempt']++;
                break;
              case '2Points':
                teamRoster[athleteId]['Points'] += 2;
                teamRoster[athleteId]['2PointsAttempts']++;
                break;
              case '2PointsMiss':
                teamRoster[athleteId]['2PointsAttempts']++;
                break;
              case '3Points':
                teamRoster[athleteId]['Points'] += 3;
                teamRoster[athleteId]['3PointsAttempts']++;
                break;
              case '3PointsMiss':
                teamRoster[athleteId]['3PointsAttempts']++;
                break;
              case 'Freethrow':
                teamRoster[athleteId]['Points']++;
                teamRoster[athleteId]['FreethrowAttempts']++;
                break;
              case 'FreethrowMiss':
                teamRoster[athleteId]['FreethrowAttempts']++;
                break;

              default:
                break;
            }
          }
        }
      }
    }

    setStats({ ...teamRoster });
  }, [gameActions, roster]);

  /*
  this function renders a single stats colum for all players
  item is the key of the statistic for the column
  lets say item = 'KillPoint', formatColum well git KillPoint
  for all players and render that column
  */
  const formatColumn = ({ item }) => {
    // value is the athlete with the stats
    // in the map key is athlete id and value athlete info and stats
    const col = Object.entries(stats).map(([key, value]) => {
      let statsVal = 0;
      // For the sport of basketball when Miss stats come up we take that slot
      // to show percentage
      switch (item.stat) {
        case '2PointsMiss':
          statsVal = getPercentage(value['2Points'], value['2PointsAttempts']);
          break;

        case '3PointsMiss':
          statsVal = getPercentage(value['3Points'], value['3PointsAttempts']);
          break;

        case 'FreethrowMiss':
          statsVal = getPercentage(
            value['Freethrow'],
            value['FreethrowAttempts']
          );
          break;

        default:
          statsVal = value[item.stat];
          break;
      }
      return (
        <View key={`${item.stat}-${key}`} style={styles.cell}>
          <Text style={styles.cellText}>{statsVal}</Text>
        </View>
      );
    });
    return <View>{col}</View>;
  };

  // the first colum is sticky and is to for players
  const firstColumn = (
    <View style={styles.identity}>
      {Object.entries(stats).map(([key, value]) => {
        const name = getAthleteName(value, team);
        return (
          <View key={`uprm-${key}`} style={styles.firstCol}>
            <Text style={styles.cellText}>
              #{value.number}
              <Text style={{ fontWeight: 'bold' }}> {name}</Text>
            </Text>
          </View>
        );
      })}
    </View>
  );

  const Header = () => (
    <View style={styles.header}>
      {/* First cell top left corner */}
      <View style={[styles.firstCol, { height: 30 }]}>
        <Text style={[styles.cellText, styles.headerText]}>ATLETA</Text>
      </View>
      {/* Column Headers. The header is sync with the content*/}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        ref={headerScrollView}
        scrollEnabled={false}
        scrollEventThrottle={16}
      >
        {/* Abbreviations for stats*/}
        {sportStats[sport].map(sport => (
          <View
            key={`header-${sport.header}`}
            style={[styles.cell, { height: 30 }]}
          >
            <Text style={[styles.cellText, styles.headerText]}>
              {sport.header}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  const table = (
    <View style={{ backgroundColor: 'white' }}>
      {firstColumn}
      <FlatList
        horizontal
        style={{ marginLeft: FIRST_COL_WIDTH }}
        data={sportStats[sport]}
        keyExtractor={item => `${team}-${item.stat}`}
        renderItem={formatColumn}
        stickyHeaderIndices={[0]}
        scrollEventThrottle={16}
        onScroll={scrollEvent}
      />
    </View>
  );

  return (
    <FlatList
      style={[Elevations.depth1]}
      data={[{ key: 'table', render: table }]}
      renderItem={({ item }) => item.render}
      ListHeaderComponent={Header}
      stickyHeaderIndices={[0]}
    />
  );
};

const ROW_HEIGHT = 50;
const COL_WIDTH = 40;
const FIRST_COL_WIDTH = 150;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    backgroundColor: Colors.headerBackground,
  },
  headerText: {
    fontWeight: 'bold',
    color: 'white',
  },
  identity: {
    position: 'absolute',
    width: FIRST_COL_WIDTH,
  },
  firstCol: {
    height: ROW_HEIGHT,
    width: FIRST_COL_WIDTH,
    alignItems: 'flex-start',
    paddingLeft: 10,
    paddingRight: 5,
    justifyContent: 'center',
    borderRightWidth: 0.5,
    borderColor: 'gray',
  },
  cell: {
    height: ROW_HEIGHT,
    width: COL_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellText: {
    fontSize: 14,
  },
});

// Sports statistics need to be define in the same order as their abbreviation
const athleteStats = {
  Voleibol: {
    KillPoint: 0,
    AttackError: 0,
    Ace: 0,
    ServiceError: 0,
    Assist: 0,
    Dig: 0,
    ReceptionError: 0,
    Block: 0,
    BlockPoint: 0,
    BlockingError: 0,
  },
  Futbol: {
    Goal: 0,
    GoalAttempt: 0,
    Assist: 0,
    Tackle: 0,
    Foul: 0,
    YellowCard: 0,
    RedCard: 0,
  },
  Baloncesto: {
    Points: 0,
    '2Points': 0,
    '2PointsAttempts': 0,
    '2PointsMiss': 0,
    '3Points': 0,
    '3PointsAttempts': 0,
    '3PointsMiss': 0,
    Freethrow: 0,
    FreethrowAttempts: 0,
    FreethrowMiss: 0,
    Assist: 0,
    Rebound: 0,
    Steals: 0,
    Blocks: 0,
    Turnover: 0,
    Foul: 0,
  },
  Beisbol: {
    AtBat: 0,
    Run: 0,
    Hit: 0,
    Homerun: 0,
    RunBattedIn: 0,
    BaseOnBall: 0,
    StrikeOut: 0,
    LeftOnBase: 0,
  },
  Softbol: {
    AtBat: 0,
    Run: 0,
    Hit: 0,
    Homerun: 0,
    RunBattedIn: 0,
    BaseOnBall: 0,
    StrikeOut: 0,
    LeftOnBase: 0,
  },
};

const sportStats = {
  Voleibol: [
    { stat: 'KillPoint', header: 'K' }, // KillPoints
    { stat: 'AttackError', header: 'E' }, // AttackErrors
    { stat: 'Ace', header: 'ACE' }, // Ace
    { stat: 'ServiceError', header: 'SE' }, // Service Errors
    { stat: 'Assist', header: 'AST' }, // Assists
    { stat: 'Dig', header: 'DIG' }, // Digs
    { stat: 'ReceptionError', header: 'RE' }, // Reception Errors
    { stat: 'Block', header: 'BS' }, // Blocks
    { stat: 'BlockPoint', header: 'BP' }, // Block Points
    { stat: 'BlockingError', header: 'BE' }, // Bloking Error
  ],
  Futbol: [
    { stat: 'Goal', header: 'G' }, // Goals
    { stat: 'GoalAttempt', header: 'SH' }, // GoalAttempt
    { stat: 'Assist', header: 'AST' }, // Assits
    { stat: 'Tackle', header: 'S' }, // Tackle
    { stat: 'Foul', header: 'F' }, // Foul
    { stat: 'YellowCard', header: 'YC' }, // Yellow Cards
    { stat: 'RedCard', header: 'RC' }, // Yellow Cards
  ],
  Baloncesto: [
    { stat: 'Points', header: 'PTS' }, // Points
    { stat: '2Points', header: 'FGM' }, // 2Points
    { stat: '2PointsAttempts', header: 'FGA' }, // 2Points Attempt
    { stat: '2PointsMiss', header: 'FG%' }, // Field Percentage (will take the place of 2PointsMiss)
    { stat: '3Points', header: '3PM' }, // 3Points
    { stat: '3PointsAttempts', header: '3PA' }, // 3Points Attempt
    { stat: '3PointsMiss', header: '3P%' }, // 3Points Percentage (will take the place of 3PointsMiss)
    { stat: 'Freethrow', header: 'FTM' }, // Freethrow
    { stat: 'FreethrowAttempts', header: 'FTA' }, // Freethrow Attemp
    { stat: 'FreethrowMiss', header: 'FT%' }, // Freethrow Percentage (will take the place of FreethrowMiss)
    { stat: 'Assist', header: 'AST' }, // Assist
    { stat: 'Rebound', header: 'REB' }, // Rebound
    { stat: 'Steals', header: 'STL' }, // Steals
    { stat: 'Blocks', header: 'BLK' }, // Blocks
    { stat: 'Turnover', header: 'TOV' }, // Turnover
    { stat: 'Foul', header: 'PF' }, // Personal Foul
  ],
  Beisbol: [
    { stat: 'AtBat', header: 'AB' }, // At Bat
    { stat: 'Run', header: 'R' }, // Run
    { stat: 'Hit', header: 'H' }, // Hit
    { stat: 'Homerun', header: 'HR' }, // Homerun
    { stat: 'RunBattedIn', header: 'RBI' }, // RunsBattedIn
    { stat: 'BaseOnBall', header: 'BB' }, // BaseOnBall
    { stat: 'StrikeOut', header: 'SO' }, // StrikeOut
    { stat: 'LeftOnBase', header: 'LOB' }, // LeftOnBase
  ],
  Softbol: [
    { stat: 'AtBat', header: 'AB' }, // At Bat
    { stat: 'Run', header: 'R' }, // Run
    { stat: 'Hit', header: 'H' }, // Hit
    { stat: 'Homerun', header: 'HR' }, // Homerun
    { stat: 'RunBattedIn', header: 'RBI' }, // RunsBattedIn
    { stat: 'BaseOnBall', header: 'BB' }, // BaseOnBall
    { stat: 'StrikeOut', header: 'SO' }, // StrikeOut
    { stat: 'LeftOnBase', header: 'LOB' }, // LeftOnBase
  ],
};

const statsDescriptions = {
  Voleibol: [
    'K - Puntos de Ataque',
    'E - Errores de Ataque',
    'ACE - Servicios Directos',
    'AST - Asistencias',
    'SE - Errores de Servicio',
    'DIG - Recepciones',
    'RE - Errores de Recepción',
    'BS - Bloqueos',
    'BP - Puntos de Bloqueo',
    'BE - Errores de Bloqueo',
  ],

  Futbol: {
    Goal: 'Goles',
    GoalAttempt: 'Tiros a portería',
    Assist: 'Asistencias',
    Tackle: 'Atajadas',
    Foul: 'Faltas',
    YellowCard: 'Tarjetas amarillas',
    RedCard: 'Tarjetas rojas',
  },
};

export default PBPAthleteStats;
