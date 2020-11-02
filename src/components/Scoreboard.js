import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { firebase } from '_firebase';

const Scoreboard = ({ event }) => {
  // Firebase real time database instance
  const database = firebase.database();
  // path to read current game set for volleyball
  const currentSetRef = database.ref('v1/116/game-metadata/current-set');
  // Path to read game score in volleyball
  const scoreRef = database.ref('v1/116/score');

  // Volleyball game set
  const [currentSet, setCurrentSet] = useState(0);
  // For Volleyball add a listener to the game set
  useEffect(() => {
    // Determine which set is being played
    currentSetRef.on('value', setSnapshot => {
      // set the current set
      setCurrentSet(setSnapshot.val());
    });
    // Component cleanup
    return () => {
      // Stop listening for changes
      currentSetRef.off('value');
    };
  }, []);

  // Game score
  const [score, setScore] = useState({ uprm: 0, opponent: 0 });

  useEffect(() => {
    scoreRef.on('value', scoreSnapshot => {
      setScore({
        uprm: scoreSnapshot.val()[`set${currentSet}-uprm`],
        opponent: scoreSnapshot.val()[`set${currentSet}-opponent`],
      });
    });
    // Clean up when
    return () => {
      scoreRef.off('value');
    };
    // Run everytime game set changes to add
  }, [currentSet]);

  return (
    <View style={styles.container}>
      <Text>
        UPRM: {score.uprm} Set: {currentSet} Opponent: {score.opponent}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Scoreboard;
