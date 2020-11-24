import { duration } from 'moment';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Animated,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import { Colors } from '_styles/';

const getPercentage = (numerator, denominator) => {
  const result = ((numerator / denominator) * 100).toFixed(1);
  return !isNaN(result) ? result : 0;
};

const AthleteTable = ({
  sport,
  gameActions,
  teamRosters,
  uprmName,
  opponentName,
}) => {
  const [stats, setStats] = useState({ uprm: {}, opponent: {} });

  // Sync header scroll with list scroll
  const headerScrollView1 = useRef(null);
  const headerScrollView2 = useRef(null);
  const scrollPosition = useRef(new Animated.Value(0));
  const scrollEvent = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollPosition.current } } }],
    { useNativeDriver: false }
  );

  // Configuring tab views
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'uprm', title: uprmName },
    { key: 'opponent', title: opponentName },
  ]);

  useEffect(() => {
    // Attach listener to scroll position
    scrollPosition.current.addListener(position => {
      headerScrollView1.current.scrollTo({
        x: position.value,
        animated: false,
      });
      headerScrollView2.current.scrollTo({
        x: position.value,
        animated: false,
      });
    });
  }, []);

  useEffect(() => {
    /* 
    Get Rosters. A roster is an object where keys have other
    objects as values. The main key is athlete id and the value
    is athlete info.
    */
    const uprmAthletes = { ...teamRosters.uprm };
    const oppAthletes = { ...teamRosters.opponent };
    // Add Stats to every athlete
    Object.entries(uprmAthletes).forEach(([key, value]) => {
      // Merge athlete info with sport stats
      uprmAthletes[key] = { ...value, ...sportsStats[sport] };
    });
    Object.entries(oppAthletes).forEach(([key, value]) => {
      oppAthletes[key] = { ...value, ...sportsStats[sport] };
    });
    // Put in a single object for easier look up
    // All stats has 3 levels Rosters - Athletes - Stats
    const allStats = {
      uprm: { ...uprmAthletes },
      opponent: { ...oppAthletes },
    };
    for (const action of gameActions) {
      if (sportsStats[sport].hasOwnProperty(action.action_type)) {
        const team = action.team;
        const athleteId = `athlete-${action.athlete_id}`;
        const actionType = action.action_type;
        // Check if athlete is in Roster
        if (allStats[team].hasOwnProperty(athleteId)) {
          allStats[team][athleteId][actionType]++;
          switch (actionType) {
            case 'BlockPoint':
              allStats[team][athleteId]['Block']++;
              break;
            case 'Goal':
              allStats[team][athleteId]['GoalAttempt']++;
              break;
            case '2Points':
              allStats[team][athleteId]['Points'] += 2;
              allStats[team][athleteId]['2PointsAttempts']++;
              break;
            case '2PointsMiss':
              allStats[team][athleteId]['2PointsAttempts']++;
              break;
            case '3Points':
              allStats[team][athleteId]['Points'] += 3;
              allStats[team][athleteId]['3PointsAttempts']++;
              break;
            case '3PointsMiss':
              allStats[team][athleteId]['3PointsAttempts']++;
              break;
            case 'Freethrow':
              allStats[team][athleteId]['Points']++;
              allStats[team][athleteId]['FreethrowAttempts']++;
            case 'FreethrowMiss':
              allStats[team][athleteId]['FreethrowAttempts']++;

              break;

            default:
              break;
          }
        }
      }
    }
    setStats({ ...allStats });
  }, [gameActions, teamRosters]);

  // this function renders a single stats colum for all players
  // item is the key for the colum
  const formatColumn = (stat, team) => {
    // value is the athlete with the stats
    const col = Object.entries(stats[team]).map(([key, value]) => {
      let statsVal = 0;
      // for basketball we dont show miss values but we show percentage
      switch (stat) {
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
          statsVal = value[stat];
          break;
      }
      return (
        <View key={`${stat}-${key}`} style={styles.cell}>
          <Text style={styles.cellText}>{statsVal}</Text>
        </View>
      );
    });
    return <View>{col}</View>;
  };

  // Get the athlete name
  const Athlete = (key, value, team) => {
    const name =
      team == 'uprm'
        ? [value.first_name, value.middle_name, value.last_names]
            .filter(Boolean)
            .join(' ')
        : value.name;
    return (
      <View key={`uprm-${key}`} style={styles.firstCol}>
        <Text style={styles.cellText}>
          #{value.number} <Text style={{ fontWeight: 'bold' }}>{name}</Text>
        </Text>
      </View>
    );
  };

  // the first colum is sticky and is to get players
  const firstColumn = team => (
    <View style={styles.identity}>
      {Object.entries(stats[team]).map(([key, value]) =>
        Athlete(key, value, team)
      )}
    </View>
  );

  const Header = ref => (
    <View style={styles.header}>
      {/* First cell top left corner */}
      <View style={[styles.firstCol, { height: 30 }]}>
        <Text style={[styles.cellText, styles.headerText]}>ATLETA</Text>
      </View>
      {/* Column Headers. The header is sync with the content*/}
      <ScrollView
        horizontal
        ref={ref}
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

  const Table = team => (
    <View style={{ backgroundColor: 'white' }}>
      {firstColumn(team)}
      <FlatList
        horizontal
        style={{ marginLeft: FIRST_COL_WIDTH }}
        data={Object.keys(sportsStats[sport])}
        keyExtractor={item => item}
        renderItem={({ item }) => formatColumn(item, team)}
        stickyHeaderIndices={[0]}
        onScroll={scrollEvent}
      />
    </View>
  );

  const renderTabBar = props => (
    <TabBar
      {...props}
      style={styles.tabBar}
      inactiveColor={'black'}
      activeColor={'white'}
      indicatorStyle={styles.tabIndicator}
      labelStyle={{ fontSize: 13, fontWeight: 'bold' }}
      contentContainerStyle={{ height: 40, alignItems: 'center' }}
    />
  );

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'uprm':
        return (
          <FlatList
            data={[{ key: 'table', render: Table('uprm') }]}
            renderItem={({ item }) => item.render}
            ListHeaderComponent={Header(headerScrollView1)}
            stickyHeaderIndices={[0]}
          />
        );
      case 'opponent':
        return (
          <FlatList
            data={[{ key: 'table', render: Table('opponent') }]}
            renderItem={({ item }) => item.render}
            ListHeaderComponent={Header(headerScrollView2)}
            stickyHeaderIndices={[0]}
          />
        );
      default:
        return null;
    }
  };

  return (
    <TabView
      navigationState={{ index, routes }}
      swipeEnabled={false}
      renderTabBar={renderTabBar}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: Dimensions.get('window').width }}
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
  tabBar: {
    backgroundColor: 'white',
    marginBottom: 8,
    width: '80%',
    marginLeft: '10%',
    borderRadius: 10,
  },
  tabIndicator: {
    backgroundColor: '#1B7744',
    height: 34,
    marginBottom: 3,
    borderRadius: 10,
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
    'FG%', // Field Percentage
    '3PM', // 3Points
    '3PA', // 3Points Attempt
    '3P%', // 3Points Percentage
    'FTM', // Freethrow
    'FTA', // Freethrow Attemp
    'FT%', // Freethrow Percentage
    'AST', // Assist
    'REB', // Rebound
    'STL', // Steals
    'BLK', // Blocks
    'TOV', // Turnover
    'PF', // Foul
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

export default AthleteTable;
