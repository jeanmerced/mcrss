import React, { useState, useLayoutEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Share,
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
import { Entypo } from '@expo/vector-icons';
import { Colors, Elevations } from '_styles';

const shareUrl = 'https://huella-deportiva-web.ue.r.appspot.com/eventos';

const PBPScreen = ({ route, navigation }) => {
  const { eventId, sport, summary, isLocal, uprmName, oppName } = route.params;
  const { gameIsOver, currentSet, opponentColor } = useGameData(eventId);
  const gameActions = useGameActions(eventId, gameIsOver);
  const teamRosters = useTeamRosters(eventId, gameIsOver);
  const partialScores = usePartialScores(eventId);

  const onShare = async (msg, id) => {
    try {
      const result = await Share.share({
        message: `${msg}\n${shareUrl}/${id}`,
        type: 'image',
        /*
        URL sharing not supported for Android
        You will need to eject the app from expo and use react-native-share
        For the moment we place the url link in the message but to enable it for ios
        discomment line below and remove `\n${shareUrl}/${id}` from message
        */
        // url: `${shareUrl}/${id}`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Entypo
          name="share-alternative"
          size={24}
          color="white"
          style={{ padding: 10 }}
          onPress={() => onShare(summary, eventId)}
        />
      ),
    });
  }, [navigation]);

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
          <ScrollView>
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
          </ScrollView>
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
            opponentColor={opponentColor}
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
        isLocal={isLocal}
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
