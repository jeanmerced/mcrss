import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const getHeader = (sport, index) => {
  switch (sport) {
    case 'Voleibol':
      return `S${index + 1}`;
    case 'Beisbol':
      return index + 1;
    case 'Baloncesto': {
      if (index < 4) return `Q${index + 1}`;
      else return `OT${index - 3}`;
    }

    default:
      break;
  }
};

const ScoreBox = ({ sport, uprmName, opponentName, partialScores }) => {
  const header = (
    <View style={styles.row}>
      <View style={{ marginLeft: FIRST_COL_WIDTH }} />
      {partialScores.map((partialScore, index) => (
        <View key={`set-${index + 1}`} style={styles.col}>
          <Text>{getHeader(sport, index)}</Text>
        </View>
      ))}
    </View>
  );

  const uprmScore = (
    <View style={styles.row}>
      <View style={[styles.col, styles.firstCol]}>
        <Text style={{ fontWeight: 'bold' }}>{uprmName}</Text>
      </View>
      {partialScores.map((partialScore, index) => (
        <View key={`set-${index + 1}-uprm`} style={styles.col}>
          <Text>{partialScore.uprmScore}</Text>
        </View>
      ))}
    </View>
  );

  const opponentScore = (
    <View style={styles.row}>
      <View style={[styles.col, styles.firstCol]}>
        <Text style={{ fontWeight: 'bold' }}>{opponentName}</Text>
      </View>
      {partialScores.map((partialScore, index) => (
        <View key={`set-${index + 1}-opp`} style={styles.col}>
          <Text>{partialScore.opponentScore}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <View>
      {partialScores.length !== 0 ? (
        <View style={styles.container}>
          {header}
          {uprmScore}
          {opponentScore}
        </View>
      ) : (
        <View />
      )}
    </View>
  );
};

const FIRST_COL_WIDTH = 70;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.5,
  },
  firstCol: {
    width: FIRST_COL_WIDTH,
    alignItems: 'flex-start',
  },
  col: {
    height: 40,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    borderWidth: 0.5,
  },
});

export default ScoreBox;
