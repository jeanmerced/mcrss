import React from 'react';
import { Text, View, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';

const width = Dimensions.get('window').width;
const YoutubePlayer = ({ videoLink }) => (
  <WebView
    source={{ uri: videoLink }}
    containerStyle={{ width: '100%', aspectRatio: 1.77 }}
  />
);

export default YoutubePlayer;