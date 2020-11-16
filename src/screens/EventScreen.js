import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import GameActions from '_components/GameActions';
import TeamStats from '_components/TeamStats';
import AthleteStats from '_components/AthleteStats';
import { useGameActions, useTeamRosters } from '_hooks';
import { Colors } from '_styles';

const EventScreen = ({ navigation }) => {
  const [gameOver, setGameOver] = useState(false);
  const gameActions = useGameActions(116, gameOver);
  const teamRosters = useTeamRosters(116, gameOver);

  return (
    <SafeAreaView style={styles.container}>
      {/* <AthleteStats
        sport={'Voleibol'}
        gameActions={gameActions}
        teamRosters={teamRosters}
      /> */}
      {/* <GameActions
        sport={'Voleibol'}
        gameActions={gameActions}
        teamRosters={teamRosters}
      /> */}
      <Text>Event View</Text>
      {/* <TeamStats sport={'Voleibol'} gameActions={gameActions} /> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.screenBackground,
  },
  text: {
    color: 'darkslateblue',
    fontSize: 30,
    textAlign: 'center',
  },
});

export default EventScreen;
