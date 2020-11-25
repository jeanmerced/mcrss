import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ResultCard = ({ sportName, uprmName, opponentName, location }) => {
  return (
    <View style={styles.eventCard}>
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
    backgroundColor: '#fff',
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
