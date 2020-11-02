import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const SportsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Sports View</Text>
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
