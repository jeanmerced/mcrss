import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, Dimensions, StyleSheet } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import axios from 'axios';
import AthleteStatsTable from '_components/AthleteStatsTable';
import TeamStatsTable from '_components/TeamStatsTable';
import { Colors, Elevations } from '_styles';

const url = 'https://white-smile-272204.ue.r.appspot.com/results/';

const EventScreen = ({ route }) => {
  const { sport, eventId } = route.params;
  const [results, setResults] = useState({
    athleteStatistics: [],
    teamStatistics: {},
  });
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'athletes', title: 'Atletas' },
    { key: 'team', title: 'Equipo' },
  ]);

  useEffect(() => {
    const getResults = (sport, eventId) => {
      let sportParam;
      let eventStats;
      let teamStats;
      switch (sport) {
        case 'Voleibol':
          sportParam = 'volleyball';
          eventStats = 'Volleyball_Event_Statistics';
          teamStats = 'volleyball_statistics';
          break;
        case 'Baloncesto':
          sportParam = 'basketball';
          eventStats = 'Basketball_Event_Statistics';
          teamStats = 'basketball_statistics';
          break;
        case 'Futbol':
          sportParam = 'soccer';
          eventStats = 'Soccer_Event_Statistics';
          teamStats = 'soccer_statistics';
          break;
        case 'Beisbol':
          sportParam = 'baseball';
          eventStats = 'Baseball_Event_Statistics';
          break;
        case 'Atletismo':
        case 'Campo Traviesa':
        case 'Halterofilia':
        case 'Judo':
        case 'Lucha Olímpica':
        case 'Natación':
        case 'Taekwondo':
        case 'Baile':
        case 'Porrismo':
          sportParam = 'medalbased';
          eventStats = 'Medal_Based_Event_Statistics';
          teamStats = 'medal_based_statistics';
          break;
        case 'Tenis de Campo':
        case 'Tenis de Mesa':
          sportParam = 'matchbased';
          eventStats = 'Match_Based_Event_Statistics';
          teamStats = 'match_based_statistics';
          break;
        default:
          break;
      }
      axios
        .get(`${url}/${sportParam}/public?event_id=${eventId}`)
        .then(res =>
          setResults({
            athleteStatistics: res.data[eventStats].athlete_statistic,
            teamStatistics: res.data[eventStats].team_statistics[teamStats],
          })
        )
        .catch(err => console.log(err));
    };
    getResults(sport, eventId);
  }, []);
  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'athletes':
        return (
          <AthleteStatsTable
            sport={sport}
            athleteStatistics={results.athleteStatistics}
          />
        );
      case 'team':
        return (
          <TeamStatsTable
            sport={sport}
            teamStatistics={results.teamStatistics}
          />
        );
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
});
const sportStats = {};

export default EventScreen;
