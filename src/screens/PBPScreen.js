import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import {
  useGameActions,
  useTeamRosters,
  usePartialScores,
  useGameData,
} from '_hooks';
import GameActions from '_components/GameActions';
import PBPTeamStats from '_components/PBPTeamStats';
import ScoreBox from '_components/ScoreBox';
import Scoreboard from '_components/Scoreboard';
import AthleteStatsTab from '_screens/AthleteStatsTab';
import { Colors, Elevations } from '_styles';

const PBPScreen = ({ route }) => {
  const { eventId, sport, isLocal, uprmName, oppName } = route.params;
  const { gameIsOver, currentSet } = useGameData(eventId);
  const gameActions = useGameActions(eventId, gameIsOver);
  const teamRosters = useTeamRosters(eventId, gameIsOver);
  const partialScores = usePartialScores(eventId);

  /* 
  TabView behaves like a navigator, for this reason we create
  some routes. DO NOT! mistake routes with route. Route comes
  from react-navigation while routes is define in this component
  and comes from react-native-tab-view.
  */
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'teams', title: 'Puntuación' },
    { key: 'athletes', title: 'Estadísticas' },
    { key: 'pbp', title: 'Jugadas' },
  ]);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'teams':
        return (
          <View style={{ flex: 1 }}>
            <ScoreBox
              sport={sport}
              isLocal={isLocal}
              uprmName={uprmName}
              opponentName={oppName}
              partialScores={partialScores}
            />
            <PBPTeamStats
              sport={sport}
              isLocal={isLocal}
              uprmName={uprmName}
              opponentName={oppName}
              gameActions={gameActions}
            />
          </View>
        );
      case 'pbp':
        return (
          <GameActions
            key={'game-actions'}
            sport={sport}
            gameActions={gameActions}
            teamRosters={teamRosters}
            uprmName={uprmName}
            opponentName={oppName}
          />
        );
      case 'athletes':
        return (
          <AthleteStatsTab
            sport={sport}
            gameActions={gameActions}
            teamRosters={teamRosters}
            isLocal={isLocal}
            uprmName={uprmName}
            opponentName={oppName}
          />
        );
      default:
        return null;
    }
  };

  const renderTabBar = props => (
    <TabBar
      {...props}
      style={[{ backgroundColor: 'white', marginBottom: 8 }, Elevations.depth1]}
      indicatorStyle={{ backgroundColor: '#1B7744', height: 4 }}
      labelStyle={{ fontSize: 13, fontWeight: 'bold', color: 'black' }}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'light-content'} />
      <Scoreboard
        sport={sport}
        uprmName={uprmName}
        opponentName={oppName}
        partialScores={partialScores}
        currentSet={currentSet}
        gameIsOver={gameIsOver}
      />
      <TabView
        renderTabBar={renderTabBar}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: Dimensions.get('window').width }}
      />
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

export default PBPScreen;
