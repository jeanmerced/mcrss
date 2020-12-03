import React, { useState, useEffect, useRef, useMemo } from 'react';
import moment from 'moment';
import 'moment/locale/es';
import { locale_es } from '_locale';
import axios from 'axios';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';
import ResultCard from '_components/ResultCard';
import PBPResultCard from '_components/PBPResultCard';
import { Colors, Elevations } from '_styles';

// When Calendar changes date we need to filter the events to be displayed
const filterByDate = (eventsArr, date) => {
  /* 
    We want to compare year, month and date; not time. Format both
    the selectedDate and event_date to 'yyyy-mm-dd' so that they
    can be comapred properly.
    */
  const formatDate = moment(date).utc(true).format('YYYY-MM-DD');
  const filterEvents = eventsArr.filter(sportEvent => {
    const formatEventDate = moment(sportEvent.event_date)
      .utc(true)
      .format('YYYY-MM-DD');
    return moment(formatEventDate).isSame(formatDate);
  });
  return filterEvents;
};

const markDates = eventsArr => {
  const markingDates = [];
  /* 
  To mark dates in the strip calendar, you have to provide
  an array of objects like the object markDate returns. More
  on react-native-calendar-strip
  */
  const markDate = date => ({ date, dots: [{ color: '#1B7744' }] });
  for (const event of eventsArr) {
    markingDates.push(markDate(event.event_date));
  }
  return markingDates;
};

const eventsUrl = 'https://white-smile-272204.ue.r.appspot.com/events/';

const ResultsScreen = ({ navigation }) => {
  // Display loading when fetching data. This variable is
  // also use when refreshing the Flatlist to show pull refresh
  const [loading, setLoading] = useState(false);
  // Array of all sport events when they are fetch
  const [sportEvents, setSportEvents] = useState([]);
  // Array of event dates to mark the calendar
  const [selectedDate, setSelectedDate] = useState(() => moment().utc(true));
  // Reference to calendar strip to get the selected date on refresh
  const calendarRef = useRef(null);
  // The Results only shows filtered results
  // Events are filter only when selected date or sportEvents changes
  const filteredEvents = useMemo(
    () => filterByDate(sportEvents, selectedDate),
    [sportEvents, selectedDate]
  );

  // When sportEvents changes or are fetch we mark the dates with events in the calendar
  const markedDates = useMemo(() => markDates(sportEvents), [sportEvents]);

  // Fetch all sport events
  const getEvents = () => {
    // Begin fetch, set loading
    setLoading(true);
    axios
      .get(eventsUrl)
      .then(res => {
        // Response has a field 'data' that holds the Events[]
        const allEvents = res.data.Events;
        allEvents.forEach(sportEvent => {
          /* 
          Do some formating: add the hasPBP to every event since
          not every event has it by default. In case that is undefined
          add false, otherwise add its value.
          */
          sportEvent['hasPBP'] = sportEvent.hasPBP ?? false;
        });
        // Fetch and processing has ended, set loading to false.
        setLoading(false);
        setSportEvents(allEvents);
      })
      .catch(err => console.log(err));
  };

  // Fetch events when Result Screen is mounted
  useEffect(() => {
    // When component mounts set calendar date to today's date
    const today = moment();
    calendarRef.current.setSelectedDate(today);
    getEvents();
  }, []);

  const EmptyList = () => (
    <View style={{ alignSelf: 'center', marginTop: '50%' }}>
      {loading ? null : (
        <Text style={{ fontSize: 18 }}>No hay eventos para esta fecha.</Text>
      )}
    </View>
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
        activeOpacity={0.8}
        onPress={() => {
          const destination = item.hasPBP ? 'PBP' : 'Event';
          navigation.navigate(destination, {
            title: eventTitle,
            summary: item.event_summary,
            eventId: item.id,
            sport: item.sport_name,
            isLocal: item.is_local,
            uprmName,
            oppName,
          });
        }}
      >
        {item.hasPBP ? (
          <PBPResultCard
            eventId={item.id}
            sportName={item.sport_name}
            sportImg={item.sport_img_url}
            uprmName={uprmName}
            opponentName={oppName}
            isLocal={item.is_local}
            venue={item.venue}
            eventDate={item.event_date}
          />
        ) : (
          <ResultCard
            sportName={item.sport_name}
            sportImg={item.sport_img_url}
            uprmName={uprmName}
            opponentName={oppName}
            isLocal={item.is_local}
            localScore={item.local_score}
            opponentScore={item.opponent_score}
            venue={item.venue}
            eventDate={item.event_date}
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={Elevations.depth2}>
        <CalendarStrip
          scrollable
          calendarAnimation={{ type: 'sequence', duration: 30 }}
          ref={calendarRef}
          locale={locale_es}
          markedDates={markedDates}
          style={{ height: 85, paddingTop: 10, paddingBottom: 10 }}
          calendarColor={'white'}
          calendarHeaderStyle={{
            color: 'black',
            fontSize: 12,
            marginBottom: 10,
          }}
          dateNumberStyle={{ color: 'gray', fontSize: 14 }}
          dateNameStyle={{ color: 'gray', fontSize: 11 }}
          highlightDateNumberStyle={{ color: 'black' }}
          highlightDateNameStyle={{ color: 'black', fontSize: 13 }}
          onDateSelected={setSelectedDate}
          leftSelector={[]}
          rightSelector={[]}
        />
      </View>

      <FlatList
        data={filteredEvents}
        keyExtractor={item => item.id.toString()}
        renderItem={renderEvent}
        ListEmptyComponent={EmptyList}
        refreshing={loading}
        onRefresh={getEvents}
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

export default ResultsScreen;
