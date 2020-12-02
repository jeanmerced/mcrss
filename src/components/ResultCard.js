import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Avatar } from 'react-native-elements';
import { depth1 } from '_styles/elevations';
import moment from 'moment';

const ResultCard = ({
  sportName,
  sportImg,
  uprmName,
  opponentName,
  isLocal,
  localScore,
  opponentScore,
  venue,
  eventDate,
}) => {
  // isLocal means if the team is playing home team or away team
  // but local score keeps being uprm score. Here for display purposes I need
  // to make a distinction.
  const homeTeam = isLocal ? uprmName : opponentName;
  const awayTeam = !isLocal ? uprmName : opponentName;
  const homeScore = isLocal ? localScore : opponentScore;
  const awayScore = !isLocal ? localScore : opponentScore;
  const hasScore = homeScore != null && awayScore != null;

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
            {hasScore ? (
              <View style={{ justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                  {homeScore}
                </Text>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                  {awayScore}
                </Text>
              </View>
            ) : (
              <View />
            )}
          </View>
          <View
            style={{ borderTopWidth: 1, paddingHorizontal: 5, paddingTop: 5 }}
          >
            <Text>@{venue}</Text>
          </View>
        </View>
        <View style={{ width: 70, alignItems: 'center', marginHorizontal: 4 }}>
          <Text style={{ fontSize: 16 }}>
            {hasScore ? 'Final' : moment(eventDate).utc().format('h:mm a')}
          </Text>
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

export default ResultCard;
