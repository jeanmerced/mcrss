import React, { Component } from 'react'
import { StyleSheet,ActivityIndicator, Text, View,Dimensions, ImageBackground } from 'react-native'
import { Image} from 'react-native-elements'
import axios from 'axios';

const imageUrl = 'https://white-smile-272204.ue.r.appspot.com/multimedia/image'

let {width,height} = Dimensions.get('window');

height=height/4;
width=width/2.3;


class Multimedios extends Component {
    state = { isLoading: false, pics: [], size: { width, height },};
  
    componentDidMount() {
      this.setState({ isLoading: true });
      // Fetch sport events
      axios
        .get(imageUrl)
        .then(res => {
          this.setState({ isLoading: false });
          //'data' field in the response has the events[]
          this.setState({pics:res.data.Multimedias.slice(-20)})
          
        })
        .catch(err => console.log(err));
    }
  
    render() {
      let images = this.state.pics.map(a => a.content);
      let title = this.state.pics.map(a => a.title);
      
      return (
        <View>
          {this.state.isLoading ? (
            <ActivityIndicator size="large" />
          ) : ( 

              <View  style={styles.container}>
                {images.map((img)=><Image 
                containerStyle={{margin:10}}
                source={{ uri: img }}
                style={this.state.size}
                PlaceholderContent={<ActivityIndicator />}/>)}
              </View>

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

