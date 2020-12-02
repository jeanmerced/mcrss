import React, { Component } from 'react';
import {
  StyleSheet,
  ActivityIndicator,
  View,
  Dimensions,
  ScrollView,
  ImageBackground,
} from 'react-native';
import { Text, Image } from 'react-native-elements';
import axios from 'axios';
import YoutubePlayer from '_components/YoutubePlayer';

const imageUrl = 'https://white-smile-272204.ue.r.appspot.com/multimedia/video';

let { width, height } = Dimensions.get('window');

height = height;
width = width;

class Multimedios extends Component {
  state = { isLoading: false, vid: [], size: { width, height } };

  render() {
    return (
      <View>
        <Text
          h4
          style={{ padding: 10, marginTop: 10, backgroundColor: 'white' }}
        >
          Videos
        </Text>
        {this.props.videos.map(vid => (
          <View key={`video-${vid.mid}`} style={{ padding: 10 }}>
            <YoutubePlayer key={`video-${vid.mid}`} videoLink={vid.content} />
          </View>
        ))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start', // if you want to fill rows left to right
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.5,
    shadowRadius: 12.35,

    elevation: 19,
  },
});

export default Multimedios;
