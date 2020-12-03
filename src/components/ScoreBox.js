import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { depth1 } from '_styles/elevations';
const screenWidth = Dimensions.get('screen').width;

const getHeader = (sport, index) => {
  switch (sport) {
    case 'Voleibol':
      return `S${index + 1}`;
    case 'Beisbol':
      return index + 1;
    case 'Softbol':
      return index + 1;
    case 'Baloncesto': {
      if (index < 4) return `Q${index + 1}`;
      else return `OT${index - 3}`;
    }
    default:
      break;
  }
};

const ScoreBox = ({
  sport,
  isLocal,
  uprmName,
  opponentName,
  partialScores,
}) => {
  // The initial columns for baseball are 10, 9 for inning and 1 for runs
  // For Volleyball and Basketball we have 5, 5 set and 4 quaters and total
  // let numColumns = 0;
  // if (sport == 'Beisbol' || sport == 'Softbol') numColumns = 10;
  // else numColumns = 5;
  // let COL_WIDTH = Math.floor(
  //   (screenWidth - FIRST_COL_WIDTH - PADDING) / numColumns - 1
  // );
  const homeName = isLocal ? uprmName : opponentName;
  const awayName = !isLocal ? uprmName : opponentName;

  const { homeTotal, awayTotal } = useMemo(() => {
    let uprmTotal = 0;
    let opponentTotal = 0;

    for (const partial of partialScores) {
      uprmTotal += partial.uprmScore;
      opponentTotal += partial.opponentScore;
    }

    let homeTotal = 0;
    let awayTotal = 0;

    if (isLocal) {
      homeTotal = uprmTotal;
      awayTotal = opponentTotal;
    } else {
      homeTotal = opponentTotal;
      awayTotal = uprmTotal;
    }

    return { homeTotal, awayTotal };
  }, [partialScores]);

  const firstColumn = (
    <View>
      <View style={[styles.cell, styles.firstCol]} />
      <View style={[styles.cell, styles.firstCol]}>
        <Text>{homeName}</Text>
      </View>
      <View style={[styles.cell, styles.firstCol]}>
        <Text>{awayName}</Text>
      </View>
    </View>
  );

  const totalColumn = (
    <View>
      <View style={[styles.cell]}>
        <Text>TOT</Text>
      </View>
      <View style={[styles.cell]}>
        <Text>{homeTotal}</Text>
      </View>
      <View style={[styles.cell]}>
        <Text>{awayTotal}</Text>
      </View>
    </View>
  );
  const formatColumn = (item, index) => {
    let homeScore, awayScore;
    if (isLocal) {
      homeScore = item.uprmScore;
      awayScore = item.opponentScore;
    } else {
      homeScore = item.opponentScore;
      awayScore = item.uprmScore;
    }
    return (
      <View key={`partial-${index}`}>
        <View style={[styles.cell]}>
          <Text>{getHeader(sport, index)}</Text>
        </View>
        <View style={[styles.cell]}>
          <Text>{homeScore}</Text>
        </View>
        <View style={[styles.cell]}>
          <Text>{awayScore}</Text>
        </View>
      </View>
    );
  };

  // <FlatList
  //   horizontal
  //   alwaysBounceHorizontal={false}
  //   data={partialScores}
  //   keyExtractor={(item, index) => `partial-${index}`}
  //   renderItem={formatColumn}
  // />;

  return (
    <View>
      {sport != 'Futbol' ? (
        <View style={[styles.container, depth1]}>
          {firstColumn}
          <View style={styles.row}>
            {partialScores.map((item, index) => formatColumn(item, index))}
            {sport != 'Voleibol' ? totalColumn : null}
          </View>
        </View>
      ) : null}
    </View>
  );
};

const FIRST_COL_WIDTH = 70;
const ROW_HEIGHT = 30;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingVertical: 5,
    paddingHorizontal: 10,
    flexDirection: 'row',
    marginBottom: 8,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  firstCol: {
    width: FIRST_COL_WIDTH,
    alignItems: 'flex-start',
  },
  cell: {
    height: ROW_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    borderWidth: 0.5,
  },
});

export default ScoreBox;
