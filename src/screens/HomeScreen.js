import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { Text } from 'react-native-elements';
import axios from 'axios';
import ImageDisplay from '_components/ImageDisplay';
import EventHome from '_components/EventsHome';
import { Colors } from '_styles';
import Headlines from '_components/Headlines';
import Multimedios from '_components/Multimedios';

const imageUrl = 'https://white-smile-272204.ue.r.appspot.com/multimedia/image';
const textUrl = 'https://white-smile-272204.ue.r.appspot.com/multimedia/text';
const eventsUrl = 'https://white-smile-272204.ue.r.appspot.com/events';
const videosUrl =
  'https://white-smile-272204.ue.r.appspot.com/multimedia/video';

const HomeScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [news, setNews] = useState([]);
  const [events, setEvents] = useState([]);
  const [videos, setVideos] = useState([]);

  const loadHome = async () => {
    setLoading(true);
    const loadImages = await axios.get(imageUrl);
    const loadNews = await axios.get(textUrl);
    const loadEvents = await axios.get(eventsUrl);
    const loadVideos = await axios.get(videosUrl);
    setLoading(false);
    setImages(loadImages.data.Multimedias.slice(-5));
    setNews(loadNews.data.Multimedias.slice(-5));
    setEvents(loadEvents.data.Events.slice(-4));
    setVideos(loadVideos.data.Multimedias.slice(-2));
  };
  useEffect(() => {
    loadHome();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'light-content'} />

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadHome} />
        }
      >
        <ImageDisplay images={images} />
        <Headlines news={news} />
        <Text
          h4
          style={(styles.shadow, { padding: 10, backgroundColor: 'white' })}
        >
          Eventos
        </Text>
        <EventHome style={(styles.shadow, { padding: 10 })} events={events} />
        <Text
          h4
          style={{ padding: 10, marginTop: 10, backgroundColor: 'white' }}
        >
          Videos
        </Text>
        <Multimedios videos={videos} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  appButtonContainer: {
    elevation: 8,
    backgroundColor: '#009688',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  appButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    alignSelf: 'center',
    textTransform: 'uppercase',
  },
  container: {
    flex: 1,
    backgroundColor: Colors.screenBackground,
    alignItems: 'center',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 8,
  },
});

export default HomeScreen;
