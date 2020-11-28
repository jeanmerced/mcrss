import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import PBPAthleteStats from '_components/PBPAthleteStats';

const AthleteStatsTab = ({
  sport,
  isLocal,
  gameActions,
  uprmName,
  opponentName,
  teamRosters,
}) => {
  const homeName = isLocal ? uprmName : opponentName;
  const awayName = !isLocal ? uprmName : opponentName;
  const homeTeam = isLocal ? 'uprm' : 'opponent';
  const awayTeam = !isLocal ? 'uprm' : 'opponent';
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'home', title: homeName },
    { key: 'away', title: awayName },
  ]);
  const renderTabBar = props => (
    <TabBar
      {...props}
      style={styles.tabBar}
      inactiveColor={'black'}
      activeColor={'white'}
      indicatorStyle={styles.tabIndicator}
      labelStyle={{ fontSize: 13, fontWeight: 'bold' }}
      contentContainerStyle={{ height: 40, alignItems: 'center' }}
    />
  );

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'home':
        return (
          <PBPAthleteStats
            sport={sport}
            gameActions={gameActions}
            team={homeTeam}
            roster={teamRosters[homeTeam]}
          />
        );
      case 'away':
        return (
          <PBPAthleteStats
            sport={sport}
            gameActions={gameActions}
            team={awayTeam}
            roster={teamRosters[awayTeam]}
          />
        );
      default:
        return null;
    }
  };

  return (
    <TabView
      navigationState={{ index, routes }}
      swipeEnabled={false}
      renderTabBar={renderTabBar}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: Dimensions.get('window').width }}
    />
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'white',
    marginBottom: 8,
    width: '80%',
    marginLeft: '10%',
    borderRadius: 10,
  },
  tabIndicator: {
    backgroundColor: '#1B7744',
    height: 34,
    marginBottom: 3,
    borderRadius: 10,
  },
});

export default AthleteStatsTab;
