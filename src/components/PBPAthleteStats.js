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

// sport: which sport for the stats
// gameActions: all game actions from firebase
// team: either uprm or opponent
// roster: team roster from firebase
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
      teamRoster[key] = { ...value, ...sportsStats[sport] };
    });
    // Put in a single object for easier look up
    // All stats has 3 levels Rosters - Athletes - Stats
    for (const action of gameActions) {
      if (action.team == team) {
        if (sportsStats[sport].hasOwnProperty(action.action_type)) {
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

  // this function renders a single stats colum for all players
  // item is the key of the statistic for the column
  const formatColumn = ({ item }) => {
    // value is the athlete with the stats
    // in the map key is athlete id and  and value athlete info and stats
    const col = Object.entries(stats).map(([key, value]) => {
      let statsVal = 0;
      // For the sport of basketball when Miss stats come up we take that slot
      // to show percentage
      switch (item) {
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
          statsVal = value[item];
          break;
      }
      return (
        <View key={`${item}-${key}`} style={styles.cell}>
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
        {statsAbbreviation[sport].map(abbr => (
          <View key={`header-${abbr}`} style={[styles.cell, { height: 30 }]}>
            <Text style={[styles.cellText, styles.headerText]}>{abbr}</Text>
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
        data={Object.keys(sportsStats[sport])}
        keyExtractor={item => `${team}-${item}`}
        renderItem={formatColumn}
        stickyHeaderIndices={[0]}
        onScroll={scrollEvent}
      />
    </View>
  );

  return (
    <FlatList
      style={Elevations.depth1}
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
    fontSize: 13,
  },
});

// Sports statistics need to be define in the same order as their abbreviation
const sportsStats = {
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
    '2PointsMiss': 0, //
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

const statsAbbreviation = {
  Voleibol: [
    'K', // KillPoints
    'E', // AttackErrors
    'ACE', // Ace
    'SE', // Service Errors
    'AST', // Assists
    'DIG', // Digs
    'RE', // Reception Errors
    'BS', // Blocks
    'BP', // Block Points
    'BE', // Bloking Error
  ],
  Futbol: [
    'G', // Goals
    'SH', // GoalAttempt
    'AST', // Assits
    'S', // Tackle
    'F', // Foul
    'YC', // YellowCard
    'RC', // RecCard
  ],
  Baloncesto: [
    'PTS', // Points
    'FGM', // 2Points
    'FGA', // 2Points Attempt
    'FG%', // Field Percentage (will take the place of 2PointsMiss)
    '3PM', // 3Points
    '3PA', // 3Points Attempt
    '3P%', // 3Points Percentage (will take the place of 3PointsMiss)
    'FTM', // Freethrow
    'FTA', // Freethrow Attemp
    'FT%', // Freethrow Percentage (will take the place of FreethrowMiss)
    'AST', // Assist
    'REB', // Rebound
    'STL', // Steals
    'BLK', // Blocks
    'TOV', // Turnover
    'PF', // Foul
  ],
  Beisbol: [
    'AB', // At Bat
    'R', // Run
    'H', // Hit
    'HR', // Homerun
    'RBI', // RunsBattedIn
    'BB', // BaseOnBall
    'SO', // StrikeOut
    'LOB', // LeftOnBase
  ],
  Softbol: [
    'AB', // At Bat
    'R', // Run
    'H', // Hit
    'HR', // Homerun
    'RBI', // RunsBattedIn
    'BB', // BaseOnBall
    'SO', // StrikeOut
    'LOB', // LeftOnBase
  ],
};

const statsDescriptions = {
  Voleibol: {
    KillPoint: 'Puntos de Ataque',
    AttackError: 'Errores de Ataque',
    Assist: 'Asistencias',
    Ace: 'Servicios Directos',
    ServiceError: 'Errores de Servicio',
    Dig: 'Recepciones',
    Block: 'Bloqueos',
    BlockPoint: 'Puntos de Bloqueo',
    BlockingError: 'Errores de Bloqueo',
    ReceptionError: 'Errores de Recepción',
  },
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
