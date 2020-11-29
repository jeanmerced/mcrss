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

const isMedalBased = sport => {
  switch (sport) {
    case 'Atletismo':
    case 'Campo Traviesa':
    case 'Halterofilia':
    case 'Judo':
    case 'Lucha Olímpica':
    case 'Natación':
    case 'Taekwondo':
    case 'Baile':
    case 'Porrismo':
      return true;
    default:
      return false;
  }
};

const isMatchBased = sport => {
  switch (sport) {
    case 'Tenis de Campo':
    case 'Tenis de Mesa':
      return true;
    default:
      return false;
  }
};

const getSportType = sport => {
  if (isMedalBased(sport)) {
    return 'MedalBased';
  } else if (isMatchBased(sport)) {
    return 'MatchBased';
  } else {
    return sport;
  }
};

// sport: which sport for the stats
// gameActions: all game actions from firebase
// team: either uprm or opponent
// roster: team roster from firebase
const Table = ({ sport, athleteStatistics }) => {
  const selectedSport = getSportType(sport);
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
        {statsAbbreviation[selectedSport].map(abbr => (
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
        data={sportsStats[selectedSport]}
        keyExtractor={item => item.toString()}
        renderItem={formatColumn}
        stickyHeaderIndices={[0]}
        scrollEventThrottle={16}
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
    minWidth: COL_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
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
  Futbol: [
    'successful_goals',
    'goal_attempts',
    'assists',
    'tackles',
    'fouls',
    'cards',
  ],
  Baloncesto: [
    'points',
    'successful_field_goal',
    'field_goal_attempt',
    'field_goal_percentage',
    'successful_three_point',
    'three_point_attempt',
    'three_point_percentage',
    'successful_free_throw',
    'free_throw_attempt',
    'free_throw_percentage',
    'assists',
    'rebounds',
    'steals',
    'blocks',
    'turnovers',
  ],
  Beisbol: [
    'at_bats',
    'runs',
    'hits',
    'runs_batted_in',
    'base_on_balls',
    'strikeouts',
    'left_on_base',
  ],
  Softbol: [
    'at_bats',
    'runs',
    'hits',
    'runs_batted_in',
    'base_on_balls',
    'strikeouts',
    'left_on_base',
  ],
  MedalBased: ['category_name', 'medal_earned'],
  MatchBased: ['category_name', 'matches_played', 'matches_won'],
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
    'C', // Cards
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
  ],
  Beisbol: [
    'AB', // At Bat
    'R', // Run
    'H', // Hit
    'RBI', // RunsBattedIn
    'BB', // BaseOnBall
    'SO', // StrikeOut
    'LOB', // LeftOnBase
  ],
  Softbol: [
    'AB', // At Bat
    'R', // Run
    'H', // Hit
    'RBI', // RunsBattedIn
    'BB', // BaseOnBall
    'SO', // StrikeOut
    'LOB', // LeftOnBase
  ],
  MedalBased: ['Categoría', 'Tipo de Medalla'],
  MatchBased: ['Categoría', 'Partidas Jugadas', 'Partidas Ganadas'],
};

export default Table;
