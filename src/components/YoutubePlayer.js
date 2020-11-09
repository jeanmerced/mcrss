import React from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';

const YoutubePlayer = ({ videoId }) => (
  <View>
    <WebView source={{ uri: `https://www.youtube.com/embed/${videoId}` }} />
  </View>
);
