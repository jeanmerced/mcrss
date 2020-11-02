import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import StatsTable from '_components/StatsTable';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatsTable></StatsTable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'darkslateblue',
    fontSize: 30,
    textAlign: 'center',
  },
});

export default HomeScreen;
