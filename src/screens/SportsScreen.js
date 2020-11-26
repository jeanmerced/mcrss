import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import SportsTable from '_components/SportsTable';

const SportsScreen = () => {
  return (
    <View style={styles.container}>
      <SportsTable/>
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

export default SportsScreen;
