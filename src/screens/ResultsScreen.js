import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { locale_es } from '_locale';
import axios from 'axios';
import {
  StyleSheet,
  SafeAreaView,
  StatusBar,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';
import ResultCard from '_components/ResultCard';

import { Colors } from '_styles';

const eventsUrl = 'https://white-smile-272204.ue.r.appspot.com/events/';

const ResultsScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  // Date selected by the calendar
  const [selectedDate, setSelectedDate] = useState();
  // Array of all sport events when they are fetch
  const [sportEvents, setSportEvents] = useState([]);
  // Filtered events when a date has been selected in the calendar
  const [filterEvents, setFilterEvents] = useState([]);
  // Array of event dates to mark the calendar
  const [eventDates, setEventDates] = useState([]);

  // Fetch events when Result Screen is mounted
  useEffect(() => {
    // Begin fetch, set loading
    setLoading(true);
    axios
      .get(eventsUrl)
      .then(res => {
        // Response has a field 'data' that holds the Events[]
        const allEvents = res.data.Events;
        const markingDates = [];
        /* 
        To mark dates in the strip calendar, it takes an array of the
        dates as parameter. The array holds objects in the way
        markDate returns them.
        */
        const markDate = date => ({ date, dots: [{ color: '#1B7744' }] });
        allEvents.forEach(sportEvent => {
          /* 
          Do some formating: add the hasPBP to every event since
          not every event has it by default. In case that is undefined
          add false, otherwise add its value.
          */
          sportEvent['hasPBP'] = sportEvent.hasPBP ? true : false;
          // Add the event date to the calendar
          markingDates.push(markDate(sportEvent.event_date));
        });
        // Fetch and processing has ended, set loading to false.
        setLoading(false);
        setSportEvents(allEvents);
        setEventDates(markingDates);
      })
      .catch(err => console.log(err));
  }, []);

  // When Calendar changes date we need to filter the events to be displayed
  useEffect(() => {
    /* 
    We want to compare year, month and date; not time. Format both
    the selectedDate and event_date to 'yyyy-mm-dd' so that they
    can be comapred properly.
    */
    const formatSelected = moment(selectedDate).format('YYYY-MM-DD');
    const filteringEvents = sportEvents.filter(sportEvent => {
      const formatEventDate = moment(sportEvent.event_date).format(
        'YYYY-MM-DD'
      );
      return moment(formatEventDate).isSame(formatSelected);
    });
    setFilterEvents(filteringEvents);
    // Run this effect every time the selected date on calendar changes
  }, [selectedDate]);

  const renderEvent = ({ item }) => {
    const oppName = item.opponent_name;
    const uprmName = item.branch == 'Masculino' ? 'Tarzanes' : 'Juanas';
    const eventTitle = item.is_local
      ? `${uprmName} vs ${oppName}`
      : `${oppName} vs ${uprmName}`;

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => {
          navigation.navigate('Event', { title: eventTitle });
        }}
      >
        <ResultCard
          sportName={item.sport_name}
          uprmName={uprmName}
          opponentName={oppName}
          location={item.venue}
        />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <CalendarStrip
        scrollable
        locale={locale_es}
        markedDates={eventDates}
        style={{ height: 85, paddingTop: 10, paddingBottom: 10 }}
        calendarColor={'white'}
        calendarHeaderStyle={{ color: 'black', fontSize: 12, marginBottom: 10 }}
        dateNumberStyle={{ color: 'gray', fontSize: 15 }}
        dateNameStyle={{ color: 'gray' }}
        selectedDate={moment()}
        leftSelector={[]}
        rightSelector={[]}
        onDateSelected={date => setSelectedDate(date)}
      />
      <View style={styles.list}>
        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <FlatList
            data={filterEvents}
            keyExtractor={item => item.id.toString()}
            renderItem={renderEvent}
            ItemSeparatorComponent={() => <View style={styles.divider} />}
            ListEmptyComponent={() => (
              <Text>No hay eventos para esta fecha</Text>
            )}
          />
        )}
      </View>
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
  list: {
    justifyContent: 'center',
    alignItems: 'stretch',
    flexGrow: 1,
  },
});

export default ResultsScreen;
