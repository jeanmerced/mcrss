import React, { useMemo, memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ProgressBar from 'react-native-progress/Bar';

const Scoreboard = ({
  sport,
  isLocal,
  gameIsOver,
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
          marginBottom: 2,
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 12 }}>
          {partial[sport][currentSet - 1]}
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
        {gameIsOver ? (
          <Text>Final</Text>
        ) : (
          <View key={'partial'} style={styles.cell}>
            {live}
          </View>
        )}
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
  Voleibol: ['1er Set', '2do Set', '3er Set', '4to Set', '5to Set'],
  Baloncesto: [
    '1er Cuarto',
    '2do Cuarto',
    '3er Cuarto',
    '4to Cuarto',
    '1er OT',
    '2do OT',
    '3er OT',
    '4to OT',
  ],
  Beisbol: [
    '1ra Entrada',
    '2da Entrada',
    '3ra Entrada',
    '4ta Entrada',
    '5ta Entrada',
    '6ta Entrada',
    '7ma Entrada',
    '8va Entrada',
    '9na Entrada',
    '10ma Entrada',
    '11ma Entrada',
    '12ma Entrada',
    '13ra Entrada',
    '14ta Entrada',
    '15ta Entrada',
    '16ta Entrada',
    '17ma Entrada',
    '18va Entrada',
    '19na Entrada',
  ],
  Softbol: [
    '1ra Entrada',
    '2da Entrada',
    '3ra Entrada',
    '4ta Entrada',
    '5ta Entrada',
    '6ta Entrada',
    '7ma Entrada',
    '8va Entrada',
    '9na Entrada',
    '10ma Entrada',
    '11ma Entrada',
    '12ma Entrada',
    '13ra Entrada',
    '14ta Entrada',
    '15ta Entrada',
    '16ta Entrada',
    '17ma Entrada',
    '18va Entrada',
    '19na Entrada',
  ],
  Futbol: ['1ra Mitad', '2da Mitad', '1er OT', '2do OT', 'Penales'],
};
export default Scoreboard;
