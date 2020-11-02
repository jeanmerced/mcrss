import React, { Component } from 'react';
import axios from 'axios';
import {
  StyleSheet,
  ActivityIndicator,
  Text,
  SafeAreaView,
  View,
  FlatList,
} from 'react-native';

const eventsUrl = 'https://white-smile-272204.ue.r.appspot.com/events/';

const DATA = [
  {
    id: 1,
    sport: 'basketball',
  },
  {
    id: 2,
    sport: 'baseball',
  },
];

class SportEventList extends Component {
  state = { isLoading: false, sportEvents: [] };

  componentDidMount() {
    this.setState({ isLoading: true });
    // Fetch sport events
    axios
      .get(eventsUrl)
      .then(res => {
        this.setState({ isLoading: false });
        //'data' field in the response has the events[]
        let sportEvents = [];
        // Map response data to Event model
        sportEvents = res.data.Events.map(e => {
          // Modeling Sport Event structure
          return {
            id: e.id,
            isLocal: e.is_local,
            sport: e.sport_name,
            branch: e.branch,
            date: e.event_date,
            uprmScore: e.local_score,
            opponentScore: e.opponent_score,
            location: e.venue,
          };
        });
        this.setState({ sportEvents: sportEvents });
        console.log(this.state.sportEvents);
      })
      .catch(err => console.log(err));
  }

  render() {
    return (
      <SafeAreaView>
        {this.state.isLoading ? (
          <ActivityIndicator size="large" />
        ) : (
          <Text>Events were fetched</Text>
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: 'red',
  },
});

export default SportEventList;
