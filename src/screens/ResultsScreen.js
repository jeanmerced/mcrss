import React, { useState, useEffect, useRef } from 'react';
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
  TouchableOpacity,
} from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';
import ResultCard from '_components/ResultCard';

import { Colors } from '_styles';

const eventsUrl = 'https://white-smile-272204.ue.r.appspot.com/events/';

const ResultsScreen = ({ navigation }) => {
  // Display loading when fetching data. This variable is
  // also use when refreshing the Flatlist to show pull refresh
  const [loading, setLoading] = useState(true);
  // Array of all sport events when they are fetch
  const [sportEvents, setSportEvents] = useState([]);
  // Filtered events when a date has been selected in the calendar
  const [filteredEvents, setFilteredEvents] = useState([]);
  // Array of event dates to mark the calendar
  const [eventDates, setEventDates] = useState([]);
  // Reference to calendar strip to get the selected date on refresh
  const calendarRef = useRef(null);

  /*
  getEvent will fetch all events. If date is pass it
  will call filterByDate. Since first fetch we filter
  to only show events for today
  */
  const getEvents = date => {
    // Begin fetch, set loading
    setLoading(true);
    axios
      .get(eventsUrl)
      .then(res => {
        // Response has a field 'data' that holds the Events[]
        const allEvents = res.data.Events;
        // Array of marked dates (dates with event)
        const markingDates = [];
        /* 
        To mark dates in the strip calendar, you have to provide
        an array of objects like the object markDate returns. More
        on react-native-calendar-strip
        */
        const markDate = date => ({ date, dots: [{ color: '#1B7744' }] });
        allEvents.forEach(sportEvent => {
          /* 
          Do some formating: add the hasPBP to every event since
          not every event has it by default. In case that is undefined
          add false, otherwise add its value.
          */
          sportEvent['hasPBP'] = sportEvent.hasPBP ?? false;
          // Add the event date to the calendar
          markingDates.push(markDate(sportEvent.event_date));
        });
        // Fetch and processing has ended, set loading to false.
        setLoading(false);
        setSportEvents(allEvents);
        setEventDates(markingDates);
        if (date) filterByDate(allEvents, date);
      })
      .catch(err => console.log(err));
  };

  // When Calendar changes date we need to filter the events to be displayed
  // Function is trigger by the calendar strip onDateSelected
  const filterByDate = (eventsArr, date) => {
    /* 
    We want to compare year, month and date; not time. Format both
    the selectedDate and event_date to 'yyyy-mm-dd' so that they
    can be comapred properly.
    */
    const formatSelected = moment(date).format('YYYY-MM-DD');
    const filterEvents = eventsArr.filter(sportEvent => {
      const formatEventDate = moment(sportEvent.event_date).format(
        'YYYY-MM-DD'
      );
      return moment(formatEventDate).isSame(formatSelected);
    });
    setFilteredEvents(filterEvents);
  };
  const handleRefresh = () => {
    getEvents(calendarRef.current.getSelectedDate());
  };

  // Fetch events when Result Screen is mounted
  useEffect(() => {
    // When component mounts set calendar date to today's date,
    // fetch events and filter the event list for today events
    const today = moment();
    getEvents(today);
    calendarRef.current.setSelectedDate(today);
  }, []);

  const EmptyList = () => (
    <View>{loading ? null : <Text>No hay eventos para esta fecha</Text>}</View>
  );
  const renderEvent = ({ item }) => {
    const oppName = item.opponent_name;
    const uprmName = item.branch == 'Masculino' ? 'Tarzanes' : 'Juanas';
    const eventTitle = item.is_local
      ? `${uprmName} vs ${oppName}`
      : `${oppName} vs ${uprmName}`;

    // When a card is touch navigate to the event screen
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => {
          navigation.navigate('Event', {
            title: eventTitle,
            eventId: item.id,
            sport: item.sport_name,
            uprmName,
            oppName,
          });
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
        ref={calendarRef}
        locale={locale_es}
        markedDates={eventDates}
        style={{ height: 85, paddingTop: 10, paddingBottom: 10 }}
        calendarColor={'white'}
        calendarHeaderStyle={{ color: 'black', fontSize: 12, marginBottom: 10 }}
        dateNumberStyle={{ color: 'gray', fontSize: 15 }}
        dateNameStyle={{ color: 'gray' }}
        onDateSelected={date => filterByDate(sportEvents, date)}
        leftSelector={[]}
        rightSelector={[]}
      />

      <FlatList
        data={filteredEvents}
        keyExtractor={item => item.id.toString()}
        renderItem={renderEvent}
        ListEmptyComponent={EmptyList}
        refreshing={loading}
        onRefresh={handleRefresh}
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

export default ResultsScreen;
