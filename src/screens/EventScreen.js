import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, Dimensions, StyleSheet } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import axios from 'axios';
import { Colors, Elevations } from '_styles';

const url = 'https://white-smile-272204.ue.r.appspot.com/results/';

const EventScreen = ({ route }) => {
  const { sport, eventId } = route.params;
  const [results, setResults] = useState({
    athlete_statistic: [],
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
      switch (sport) {
        case 'Voleibol':
          sportParam = 'volleyball';
          eventStats = 'Volleyball_Event_Statistics';
          break;

        default:
          break;
      }
      axios
        .get(`${url}/${sportParam}/public?event_id=${eventId}`)
        .then(res => setResults({ ...res.data[eventStats] }))
        .catch(err => console.log(err));
    };
    getResults(sport, eventId);
  }, []);
  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'athletes':
        return (
          <Table sport={sport} athleteStatistics={results.athlete_statistic} />
        );
      case 'team':
        return <Text>Equipo</Text>;
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

const sportDictionary = {
  Voleibol: 'Volleyball',
};
const sportStats = {};

export default EventScreen;
