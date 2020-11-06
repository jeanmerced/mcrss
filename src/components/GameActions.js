import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useTeamRosters, useGameStatus, useGameActions } from '_hooks';
import { firebase } from '_firebase';

// Action: single action render component
const Action = ({ action }) => (
  <View style={styles.action}>
    <Text>{action}</Text>
  </View>
);

// Game actions: list of actions for an event
const GameActions = ({ gameActions }) => {
  const renderItem = ({ item }) => <Action action={item.action_type} />;
  return (
    <View style={styles.container}>
      <FlatList
        data={gameActions}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.divider} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  divider: {
    borderColor: '#F6F6F6',
    borderWidth: 0.5,
  },
  action: {
    height: 50,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default GameActions;
