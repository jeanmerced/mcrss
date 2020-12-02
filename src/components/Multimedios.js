import React, { Component } from 'react'
import { StyleSheet,ActivityIndicator, Text, View,Dimensions,ScrollView, ImageBackground } from 'react-native'
import { Image} from 'react-native-elements'
import axios from 'axios'
import YoutubePlayer from '_components/YoutubePlayer'

const imageUrl = 'https://white-smile-272204.ue.r.appspot.com/multimedia/video'

let {width,height} = Dimensions.get('window');

height=height;
width=width;


class Multimedios extends Component {
    state = { isLoading: false, vid: [], size: { width, height },};
  
    componentDidMount() {
      this.setState({ isLoading: true });
      // Fetch sport events
      axios
        .get(imageUrl)
        .then(res => {
          this.setState({ isLoading: false });
          //'data' field in the response has the events[]
          this.setState({vid:res.data.Multimedias.slice(-20)})
          
        })
        .catch(err => console.log(err));
    }
  
    render() {
      let videos = this.state.vid.map(a => a.content);
      
      return (
        <View>
          {this.state.isLoading ? (
            <ActivityIndicator size="large" />
          ) : ( 

              <ScrollView >
                {videos.map((vids)=><View style={{padding:10}} ><YoutubePlayer
                key={vids}
                videoLink={ vids }
                /></View>)}
              </ScrollView>

          )}
        </View>
      );
    }
  }

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start' ,// if you want to fill rows left to right

      },
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 9,
        },
        shadowOpacity: 0.50,
        shadowRadius: 12.35,

        elevation: 19,
      },
 
});


export default Multimedios

