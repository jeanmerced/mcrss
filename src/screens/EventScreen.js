import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import { useGameActions, useTeamRosters, useGameStatus } from '_hooks';
import GameActions from '_components/GameActions';
import TeamStats from '_components/TeamStats';
import AthleteStats from '_components/AthleteStats';
import { Colors } from '_styles';

const EventScreen = ({ route }) => {
  const { eventId, sport, uprmName, oppName } = route.params;
  const gameStatus = useGameStatus(eventId);
  const gameActions = useGameActions(eventId, gameStatus);
  const teamRosters = useTeamRosters(eventId, gameStatus);

  /* 
  TabView behaves like a navigator, for this reason we create
  some routes. DO NOT! mistake routes with route. Route comes
  from react-navigation while routes is define in this component
  and comes from react-native-tab-view.
  */
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'teams', title: 'Resultados' },
    { key: 'pbp', title: 'Jugadas' },
    { key: 'athletes', title: 'Estadísticas' },
  ]);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'teams':
        return (
          <TeamStats
            sport={sport}
            gameActions={gameActions}
            uprmName={uprmName}
            opponentName={oppName}
          />
        );
      case 'pbp':
        return (
          <GameActions
            key={'game-actions'}
            sport={sport}
            gameActions={gameActions}
            teamRosters={teamRosters}
          />
        );
      case 'athletes':
        return <Text>tabla atletas</Text>;
      default:
        return null;
    }
  };

  const renderTabBar = props => (
    <TabBar {...props} indicatorStyle={{ backgroundColor: '#1B7744' }} />
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'light-content'} />
      <View>
        <Text>{gameStatus ? 'acabado' : 'live'}</Text>
      </View>
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

export default EventScreen;
