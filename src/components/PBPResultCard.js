import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Avatar } from 'react-native-elements';
import { depth1 } from '_styles/elevations';
import { useGameData, usePartialScores } from '_hooks';
import ProgressBar from 'react-native-progress/Bar';

import moment from 'moment';

const PBPResultCard = ({
  eventId,
  sportName,
  sportImg,
  uprmName,
  opponentName,
  isLocal,
  venue,
  eventDate,
}) => {
  // isLocal means if the team is playing home team or away team
  // but local score keeps being uprm score. Here for display purposes I need
  // to make a distinction.
  const { currentSet, gameIsOver } = useGameData(eventId);
  const partialScores = usePartialScores(eventId);
  const homeTeam = isLocal ? uprmName : opponentName;
  const awayTeam = !isLocal ? uprmName : opponentName;

  const { homeScore, awayScore } = useMemo(() => {
    let uprmScore = 0;
    let opponentScore = 0;

    if (sportName != 'Voleibol') {
      // if is not volleyball sum all the partial scores
      // if partial is empty or null for loop wont run
      for (const partial of partialScores) {
        uprmScore += partial.uprmScore;
        opponentScore += partial.opponentScore;
      }
    } else {
      // here we need to check if we have the partials before accessing them
      if (partialScores.length > 0 && currentSet) {
        // Score in Volleybal is calculated depending on who has won sets
        // in first set nobody has won so score is still zero
        if (currentSet > 1) {
          for (let i = 1; i < currentSet; i++) {
            const partial = partialScores[i - 1];
            if (partial.uprmScore > partial.opponentScore) {
              uprmScore += 1;
            } else {
              opponentScore += 1;
            }
          }
        }
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
        <Text
          style={{
            color: 'white',
            fontWeight: 'bold',
            fontSize: 10,
            textAlign: 'center',
          }}
        >
          {partial[sportName][currentSet - 1]}
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
    <View style={[styles.eventCard, depth1]}>
      <View style={styles.cardHeader}>
        <Text style={styles.headerText}>{sportName}</Text>
      </View>
      <View style={styles.cardBody}>
        <Avatar
          rounded
          containerStyle={{ margin: 10 }}
          size={'large'}
          source={{
            uri: sportImg,
          }}
        ></Avatar>
        <View style={{ flex: 1, borderRightWidth: 1 }}>
          <View
            style={{
              height: 60,
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingBottom: 5,
              paddingHorizontal: 5,
            }}
          >
            <View
              style={{
                justifyContent: 'space-between',
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                {homeTeam}
              </Text>
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                {awayTeam}
              </Text>
            </View>
            <View style={{ justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                {homeScore}
              </Text>
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                {awayScore}
              </Text>
            </View>
          </View>
          <View
            style={{ borderTopWidth: 1, paddingHorizontal: 5, paddingTop: 5 }}
          >
            <Text>@{venue}</Text>
          </View>
        </View>
        <View style={{ width: 70, alignItems: 'center', marginHorizontal: 4 }}>
          {gameIsOver ? <Text style={{ fontSize: 16 }}>Final</Text> : live}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  eventCard: {
    height: 140,
    margin: 10,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  cardHeader: {
    backgroundColor: '#1B7744',
    height: 25,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 13,
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

export default PBPResultCard;
