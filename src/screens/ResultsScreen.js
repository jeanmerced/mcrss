import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  Text,
  Button,
  View,
} from 'react-native';
import SportEventList from '_components/SportEventList';

import { Colors } from '_styles';

const ResultsScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Text>Hello</Text>
      <SportEventList />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.screenBackground,
  },
  text: {
    color: 'darkslateblue',
    fontSize: 30,
    textAlign: 'center',
  },
});

export default ResultsScreen;
