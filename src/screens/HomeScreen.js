import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  StatusBar,
  View,
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
  const [firstLoad, setFirstLoad] = useState(true);

  const loadHome = async () => {
    setLoading(true);
    const loadImages = await axios.get(imageUrl);
    const loadNews = await axios.get(textUrl);
    const loadEvents = await axios.get(eventsUrl);
    const loadVideos = await axios.get(videosUrl);
    setLoading(false);
    setImages(loadImages.data.Multimedias.slice(0, 5));
    setNews(loadNews.data.Multimedias.slice(0, 5));
    setEvents(loadEvents.data.Events.slice(0, 4));
    setVideos(loadVideos.data.Multimedias.slice(0, 2));
    setFirstLoad(false);
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
        {firstLoad ? (
          <View />
        ) : (
          <View>
            <ImageDisplay images={images} />
            <Headlines news={news} />
            <EventHome
              style={(styles.shadow, { padding: 10 })}
              events={events}
            />
            <Multimedios videos={videos} />
          </View>
        )}
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
