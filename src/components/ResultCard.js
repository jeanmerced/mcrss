import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { depth1 } from '_styles/elevations';

const ResultCard = ({ sportName, uprmName, opponentName, location }) => {
  return (
    <View style={[styles.eventCard, depth1]}>
      <View style={styles.cardHeader}>
        <Text style={styles.headerText}>{sportName}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  eventCard: {
    flex: 1,
    height: 80,
    margin: 10,
    borderRadius: 5,
    backgroundColor: 'white',
    alignItems: 'stretch',
  },
  cardHeader: {
    backgroundColor: '#1B7744',
    height: 25,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 13,
  },
});

export default ResultCard;
