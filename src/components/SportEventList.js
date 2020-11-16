import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import {
  StyleSheet,
  ActivityIndicator,
  Text,
  SafeAreaView,
  View,
  FlatList,
} from 'react-native';
import ResultCard from '_components/ResultCard';

const eventsUrl = 'https://white-smile-272204.ue.r.appspot.com/events/';

const SportEventList = ({ selectedDate, navigation }) => {
  const [loading, setLoading] = useState(true);
  const [sportEvents, setSportEvents] = useState([]);
  const [filterEvents, setFilterEvents] = useState([]);

  useEffect(() => {
    axios
      .get(eventsUrl)
      .then(res => {
        setLoading(false);
        //'data' field in the response has the events[]
        let sportEvents = [];
        // Map response data to Event model
        sportEvents = res.data.Events.map(e => {
          // Modeling Sport Event structure
          return {
            id: e.id,
            isLocal: e.is_local,
            sportName: e.sport_name,
            branch: e.branch,
            eventDate: moment(e.event_date).format('YYYY-MM-DD'),
            uprmScore: e.local_score,
            opponentScore: e.opponent_score,
            opponentName: e.opponent_name,
            location: e.venue,
            hasPBP: e.hasPBP ? true : false,
          };
        });
        setSportEvents(sportEvents);
        console.log(sportEvents);
      })
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    console.log(selectedDate);
    const formatDate = moment(selectedDate).format('YYYY-MM-DD');
    console.log(formatDate);
    const filtEvents = sportEvents.filter(sportEvent => {
      return moment(sportEvent.eventDate).isSame(formatDate);
    });
    console.log(filtEvents);
    setFilterEvents(filtEvents);
  }, [selectedDate]);

  const renderEvent = ({ item }) => (
    <ResultCard
      eventId={item.eventId}
      sportName={item.sportName}
      branch={item.branch}
      opponentName={item.opponentName}
      location={item.location}
    />
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={filterEvents}
          keyExtractor={item => item.id.toString()}
          renderItem={renderEvent}
          contentContainerStyle={{ flexGrow: 1 }}
          ItemSeparatorComponent={() => <View style={styles.divider} />}
          ListEmptyComponent={() => <Text>No hay eventos para esta fecha</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  divider: {
    height: 5,
  },
  eventCard: {
    height: 80,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  cardText: {
    paddingHorizontal: 20,
    textAlign: 'left',
  },
});

export default SportEventList;
