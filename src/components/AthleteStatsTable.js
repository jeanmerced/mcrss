import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Animated,
  FlatList,
  ScrollView,
  StyleSheet,
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
const AthleteStatsTable = ({ sport, athleteStatistics }) => {
  const selectedSport = getSportType(sport);
  let HEADER_HEIGHT = 30;
  let COL_WIDTH = 40;

  if (selectedSport == 'MedalBased') {
    HEADER_HEIGHT = 50;
    COL_WIDTH = 100;
  } else if (selectedSport == 'MatchBased') {
    HEADER_HEIGHT = 50;
    COL_WIDTH = 80;
  }
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

  // this function renders a single stats colum for all players
  // item is the key of the statistic for the column
  const formatColumn = ({ item }) => {
    // value is the athlete with the stats
    // in the map key is athlete id and  and value athlete info and stats
    const col = athleteStatistics.map(athlete => {
      const athleteInfo = athlete.athlete_info;
      const athleteStats = athlete.statistics;

      return (
        <View
          key={`${athleteInfo.athlete_id}-${item.stat}`}
          style={[styles.cell, { width: COL_WIDTH }]}
        >
          <Text style={styles.cellText}>{athleteStats[item.stat]}</Text>
        </View>
      );
    });
    return <View>{col}</View>;
  };

  const Header = () => (
    <View style={styles.header}>
      {/* First cell top left corner */}
      <View style={[styles.firstCol, { height: HEADER_HEIGHT }]}>
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
        {sportStats[selectedSport].map(stat => (
          <View
            key={`header-${stat.header}`}
            style={[styles.cell, { height: HEADER_HEIGHT, width: COL_WIDTH }]}
          >
            <Text style={[styles.cellText, styles.headerText]}>
              {stat.header}
            </Text>
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
        data={sportStats[selectedSport]}
        keyExtractor={item => item.stat.toString()}
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellText: {
    fontSize: 13,
  },
});

// Sports statistics need to be define in the same order as their abbreviation
const sportStats = {
  Voleibol: [
    { stat: 'kill_points', header: 'K' }, // KillPoints
    { stat: 'attack_errors', header: 'E' }, // AttackErrors
    { stat: 'aces', header: 'ACE' }, // Ace
    { stat: 'service_errors', header: 'SE' }, // Service Errors
    { stat: 'assists', header: 'AST' }, // Assists
    { stat: 'digs', header: 'DIG' }, // Digs
    { stat: 'reception_errors', header: 'RE' }, // Reception Errors
    { stat: 'blocks', header: 'BS' }, // Blocks
    { stat: 'blocking_points', header: 'BP' }, // Block Points
    { stat: 'blocking_errors', header: 'BE' }, // Bloking Error
  ],
  Futbol: [
    { stat: 'successful_goals', header: 'G' }, // Goals
    { stat: 'goal_attempts', header: 'SH' }, // GoalAttempt
    { stat: 'assists', header: 'AST' }, // Assits
    { stat: 'tackles', header: 'S' }, // Tackle
    { stat: 'fouls', header: 'F' }, // Foul
    { stat: 'cards', header: 'C' }, // Cards
  ],
  Baloncesto: [
    { stat: 'points', header: 'PTS' }, // Points
    { stat: 'successful_field_goal', header: 'FGM' }, // 2Points
    { stat: 'field_goal_attempt', header: 'FGA' }, // 2Points Attempt
    { stat: 'field_goal_percentage', header: 'FG%' }, // Field Percentage (will take the place of 2PointsMiss)
    { stat: 'successful_three_point', header: '3PM' }, // 3Points
    { stat: 'three_point_attempt', header: '3PA' }, // 3Points Attempt
    { stat: 'three_point_percentage', header: '3P%' }, // 3Points Percentage (will take the place of 3PointsMiss)
    { stat: 'successful_free_throw', header: 'FTM' }, // Freethrow
    { stat: 'free_throw_attempt', header: 'FTA' }, // Freethrow Attemp
    { stat: 'free_throw_percentage', header: 'FT%' }, // Freethrow Percentage (will take the place of FreethrowMiss)
    { stat: 'assists', header: 'AST' }, // Assist
    { stat: 'rebounds', header: 'REB' }, // Rebound
    { stat: 'steals', header: 'STL' }, // Steals
    { stat: 'blocks', header: 'BLK' }, // Blocks
    { stat: 'turnovers', header: 'TOV' }, // Turnover
  ],
  Beisbol: [
    { stat: 'at_bats', header: 'AB' }, // At Bat
    { stat: 'runs', header: 'R' }, // Run
    { stat: 'hits', header: 'H' }, // Hit
    { stat: 'runs_batted_in', header: 'RBI' }, // RunsBattedIn
    { stat: 'base_on_balls', header: 'BB' }, // BaseOnBall
    { stat: 'strikeouts', header: 'SO' }, // StrikeOut
    { stat: 'left_on_base', header: 'LOB' }, // LeftOnBase
  ],
  Softbol: [
    { stat: 'at_bats', header: 'AB' }, // At Bat
    { stat: 'runs', header: 'R' }, // Run
    { stat: 'hits', header: 'H' }, // Hit
    { stat: 'runs_batted_in', header: 'RBI' }, // RunsBattedIn
    { stat: 'base_on_balls', header: 'BB' }, // BaseOnBall
    { stat: 'strikeouts', header: 'SO' }, // StrikeOut
    { stat: 'left_on_base', header: 'LOB' }, // LeftOnBase
  ],

  MedalBased: [
    { stat: 'category_name', header: 'Categoría' },
    { stat: 'medal_earned', header: 'Tipo de Medalla' },
  ],
  MatchBased: [
    { stat: 'category_name', header: 'Categoría' },
    { stat: 'matches_played', header: 'Partidas Jugadas' },
    { stat: 'matches_won', header: 'Partidas Ganadas' },
  ],
};

export default AthleteStatsTable;
