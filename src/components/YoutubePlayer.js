import React from 'react';
import { Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

const YoutubePlayer = ({ videoId }) => (
  <View>
    <WebView source={{ uri: `https://www.youtube.com/embed/${videoId}` }} />
  </View>
);

export default YoutubePlayer;
