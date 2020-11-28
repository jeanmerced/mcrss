import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ProgressBar from 'react-native-progress/Bar';
import { depth1 } from '_styles/elevations';

const Scoreboard = ({
  sport,
  isLocal,
  uprmName,
  opponentName,
  partialScores,
  currentSet,
}) => {
  const homeName = isLocal ? uprmName : opponentName;
  const awayName = !isLocal ? uprmName : opponentName;
  const { homeScore, awayScore } = useMemo(() => {
    let uprmScore = 0;
    let opponentScore = 0;

    if (sport != 'Voleibol') {
      for (const partial of partialScores) {
        uprmScore += partial.uprmScore;
        opponentScore += partial.opponentScore;
      }
    } else {
      if (partialScores.length > 0 && currentSet) {
        const partial = partialScores[currentSet - 1];
        uprmScore += partial.uprmScore;
        opponentScore += partial.opponentScore;
      }
    }

    let homeScore = 0;
    let awayScore = 0;

    if (isLocal) {
      homeScore = uprmScore;
      awayScore = opponentScore;
    } else {
      homeScore = opponentScore;
      awayScore = uprmScore;
    }

    return { homeScore, awayScore };
  }, [partialScores, currentSet]);

  const live = (
    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
      <View
        style={{
          backgroundColor: 'red',
          borderRadius: 100,
          paddingHorizontal: 5,
          marginBottom: 1,
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 9 }}>
          En Vivo
        </Text>
      </View>
      <ProgressBar
        indeterminate={true}
        indeterminateAnimationDuration={2000}
        width={30}
        height={2}
        borderWidth={0}
        color={'red'}
        unfilledColor={'white'}
      />
    </View>
  );
  return (
    <View style={[styles.container]}>
      <View style={styles.row}>
        <View key={'home-score'} style={styles.cell}>
          <Text style={styles.text}>{homeScore}</Text>
          <Text>{homeName}</Text>
        </View>
        <View key={'partial'} style={styles.cell}>
          <Text>{`${partial[sport]} ${currentSet}`}</Text>
          {live}
        </View>
        <View key={'opponent-score'} style={styles.cell}>
          <Text style={styles.text}>{awayScore}</Text>
          <Text>{awayName}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderColor: '#F6F6F6',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
  },
  cell: {
    width: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

const partial = {
  Voleibol: 'Set',
  Baloncesto: 'Cuarto',
  Beisbol: 'Entrada',
  Softbol: 'Entrada',
};
export default Scoreboard;
