import React, { useEffect, useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  FlatList,
  StatusBar,
  Dimensions,
} from 'react-native';
import axios from 'axios';
import { TabView, TabBar } from 'react-native-tab-view';
import MultimediaPost from '_components/MultimediaPost';
import { Colors } from '_styles';

const multimediaUrl = `https://white-smile-272204.ue.r.appspot.com/multimedia`;

const MediaScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [textPosts, setTextPosts] = useState([]);
  const [imagePosts, setImagePosts] = useState([]);
  const [videoPosts, setVideoPosts] = useState([]);
  const [livestreamPosts, setLivestreamPosts] = useState([]);

  const getTextPosts = () => {
    setLoading(true);
    axios.get(`${multimediaUrl}/text`).then(res => {
      setLoading(false);
      setTextPosts(res.data['Multimedias'].reverse());
    });
  };
  const getImagePosts = () => {
    setLoading(true);
    axios.get(`${multimediaUrl}/image`).then(res => {
      setLoading(false);
      setImagePosts(res.data['Multimedias'].reverse());
    });
  };
  const getVideoPosts = () => {
    setLoading(true);
    axios.get(`${multimediaUrl}/video`).then(res => {
      setLoading(false);
      setVideoPosts(res.data['Multimedias'].reverse());
    });
  };
  const getLivestreamPosts = () => {
    setLoading(true);
    axios.get(`${multimediaUrl}/livestream`).then(res => {
      setLoading(false);
      setLivestreamPosts(res.data['Multimedias'].reverse());
    });
  };

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'text', title: 'Artículos' },
    { key: 'image', title: 'Imágenes' },
    { key: 'video', title: 'Videos' },
    { key: 'livestream', title: 'Lives' },
  ]);
  const renderPost = ({ item }) => (
    <MultimediaPost
      postId={item.mid}
      title={item.title}
      navigation={navigation}
      publishedDate={item.date_published}
      content={item.content}
      type={item.type}
    />
  );
  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'text':
        return (
          <FlatList
            data={textPosts}
            keyExtractor={item => item.mid.toString()}
            renderItem={renderPost}
            refreshing={loading}
            onRefresh={getTextPosts}
          />
        );
      case 'image':
        return (
          <FlatList
            data={imagePosts}
            keyExtractor={item => item.mid.toString()}
            renderItem={renderPost}
            refreshing={loading}
            onRefresh={getImagePosts}
          />
        );
      case 'video':
        return (
          <FlatList
            data={videoPosts}
            keyExtractor={item => item.mid.toString()}
            renderItem={renderPost}
            refreshing={loading}
            onRefresh={getVideoPosts}
          />
        );
      case 'livestream':
        return (
          <FlatList
            data={livestreamPosts}
            keyExtractor={item => item.mid.toString()}
            renderItem={renderPost}
            refreshing={loading}
            onRefresh={getLivestreamPosts}
          />
        );
      default:
        return null;
    }
  };

  const renderTabBar = props => (
    <TabBar
      {...props}
      style={{ backgroundColor: 'white' }}
      indicatorStyle={{ backgroundColor: '#1B7744', height: 4 }}
      labelStyle={{ fontSize: 11, fontWeight: '600', color: 'black' }}
    />
  );

  useEffect(() => {
    getTextPosts();
    getImagePosts();
    getVideoPosts();
    getLivestreamPosts();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'light-content'} />
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

export default MediaScreen;
