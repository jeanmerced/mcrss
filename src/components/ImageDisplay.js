import React, { Component } from 'react'
import { StyleSheet,ActivityIndicator, Text, View,Image,Dimensions, ImageBackground } from 'react-native'
import axios from 'axios';
import Carousel from 'react-native-looped-carousel';

const imageUrl = 'https://white-smile-272204.ue.r.appspot.com/multimedia/image'

let {width,height} = Dimensions.get('window');

height=height/3;


class ImageDisplay extends Component {
    state = { isLoading: false, pics: [], size: { width, height },};
  
    componentDidMount() {
      this.setState({ isLoading: true });
      // Fetch sport events
      axios
        .get(imageUrl)
        .then(res => {
          this.setState({ isLoading: false });
          //'data' field in the response has the events[]
          this.setState({pics:res.data.Multimedias.slice(-5)})
          
        })
        .catch(err => console.log(err));
    }
  
    render() {
      let images = this.state.pics.slice(-5).map(a => a.content);
      let title = this.state.pics.slice(-5).map(a => a.title);
      
      return (
        <View>
          {this.state.isLoading ? (
            <ActivityIndicator size="large" />
          ) : ( 

              <View style={{marginBottom: 2}}>
                <Carousel
                    delay={5000}
                    style={this.state.size}
                    autoplay
                    currentPage={0}
                    >
                    <Text>
                    <ImageBackground style={this.state.size} key={this.state.pics.slice(-1)} source={{uri:images[0]}}>
                    <Text style={styles.textstyle} key={this.state.pics.slice(-1).mid}>{title[0]}</Text>
                    </ImageBackground>
                    </Text>
                    <Text>
                    <ImageBackground style={this.state.size} key={this.state.pics.slice(-1)} source={{uri:images[1]}}>
                    <Text style={styles.textstyle} key={this.state.pics.slice(-1).mid}>{title[1]}</Text>
                    </ImageBackground>
                    </Text>
                    <Text>
                    <ImageBackground style={this.state.size} key={this.state.pics.slice(-1)} source={{uri:images[2]}}>
                    <Text style={styles.textstyle} key={this.state.pics.slice(-1).mid}>{title[2]}</Text>
                    </ImageBackground>
                    </Text>
                    <Text>
                    <ImageBackground style={this.state.size} key={this.state.pics.slice(-1)} source={{uri:images[3]}}>
                    <Text style={styles.textstyle} key={this.state.pics.slice(-1).mid}>{title[3]}</Text>
                    </ImageBackground>
                    </Text>
                    <Text>
                    <ImageBackground style={this.state.size} key={this.state.pics.slice(-1)} source={{uri:images[4]}}>
                    <Text style={styles.textstyle} key={this.state.pics.slice(-1).mid}>{title[4]}</Text>
                    </ImageBackground>
                    </Text>
                    
                </Carousel>
              </View>

          )}
        </View>
      );
    }
  }

const styles = StyleSheet.create({
  textstyle:{
    position:'absolute' ,color: 'white',top:180,padding:20,fontWeight: 'bold'
  }
 
});


export default ImageDisplay

