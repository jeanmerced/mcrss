import React, { Component } from 'react'
import { StyleSheet,ActivityIndicator,FlatList, TouchableOpacity, View,Dimensions} from 'react-native'
import { WebView} from 'react-native-webview'
import { live,Divider } from 'react-native-elements'
import axios from 'axios';

const initialHTMLContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title></title>
  <meta name="author" content="">
  <meta name="description" content="">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script src='https://unpkg.com/rahulrsingh09-stenciltest2@0.0.3/dist/test/test.js'></script>
</head>
<body>
<h1>Hello</h1>
<my-component source-url="/api/video/v1/us-west-2.893648527354.channel.DmumNckWFTqz.m3u8"></my-component>
</body>
</html>`;

const imageUrl = 'https://white-smile-272204.ue.r.appspot.com/multimedia/livestream'

let {width,height} = Dimensions.get('window');

height=height/4;


class Livestream extends Component {
    state = { isLoading: false, live: [], size: { width, height },};
  
    componentDidMount() {
      this.setState({ isLoading: true });
      // Fetch sport live
      axios
        .get(imageUrl)
        .then(res => {
          
          //'data' field in the response has the live[]
          this.setState({live:res.data.Multimedias.slice(-1)});
          this.setState({ isLoading: false });

        })
        .catch(err => console.log(err));
    }
    render() {
      
      return (
        <View>
          {this.state.isLoading ? (
            <ActivityIndicator size="large" />
          ) : ( 
              
              <View style={{
                flex: 1,
              }}>
                <WebView  
                     originWhitelist={['*']}
                     javaScriptEnabled={true}
                     domStorageEnabled={true}
                     source={{
                       html: initialHTMLContent,
                       baseUrl: 'https://fcc3ddae59ed.us-west-2.playback.live-video.net',
                     }}  />
              </View>   
           )}
        </View>
      );
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:'white',
      marginBottom:10
    },

  });
  


export default Livestream
