import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Animated,
  FlatList,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Text,
  View,
} from 'react-native';
import { Colors, Elevations } from '_styles';

// sport: which sport for the stats
// gameActions: all game actions from firebase
// team: either uprm or opponent
// roster: team roster from firebase
const Table = ({ sport, athleteStatistics }) => {
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
    console.log(athleteStatistics);
  }, [athleteStatistics]);

  // this function renders a single stats colum for all players
  // item is the key of the statistic for the column
  const formatColumn = ({ item }) => {
    // value is the athlete with the stats
    // in the map key is athlete id and  and value athlete info and stats
    const col = athleteStatistics.map(athlete => {
      const athleteInfo = athlete.athlete_info;
      const athleteStats = athlete.statistics;

      return (
        <View key={`${athleteInfo.athlete_id}-${item}`} style={styles.cell}>
          <Text style={styles.cellText}>{athleteStats[item]}</Text>
        </View>
      );
    });
    return <View>{col}</View>;
  };

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
  const firstColumn = (
    <View style={styles.identity}>
      {athleteStatistics.map(athlete => {
        const athleteInfo = athlete.athlete_info;
        const name = [
          athleteInfo.first_name,
          athleteInfo.middle_name,
          athleteInfo.last_names,
        ]
          .filter(Boolean)
          .join(' ');
        return (
          <View key={`${athleteInfo.athlete_id}`} style={styles.firstCol}>
            <Text style={styles.cellText}>
              #{athleteInfo.number}
              <Text style={{ fontWeight: 'bold' }}> {name}</Text>
            </Text>
          </View>
        );
      })}
    </View>
  );

  const table = (
    <View style={{ backgroundColor: 'white' }}>
      {firstColumn}
      <FlatList
        horizontal
        style={{ marginLeft: FIRST_COL_WIDTH }}
        data={sportsStats[sport]}
        keyExtractor={item => item.toString()}
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
  Voleibol: [
    'kill_points',
    'attack_errors',
    'aces',
    'service_errors',
    'assists',
    'digs',
    'reception_errors',
    'blocks',
    'blocking_points',
    'blocking_errors',
  ],
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

export default Table;
