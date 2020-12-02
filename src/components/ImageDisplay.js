import React, { Component } from 'react';
import {
  StyleSheet,
  ActivityIndicator,
  Text,
  View,
  Dimensions,
  ImageBackground,
} from 'react-native';
import axios from 'axios';
import Carousel from 'react-native-looped-carousel';

const imageUrl = 'https://white-smile-272204.ue.r.appspot.com/multimedia/image';

let { width, height } = Dimensions.get('window');

height = height / 3;

class ImageDisplay extends Component {
  state = { isLoading: false, pics: [], size: { width, height } };

  render() {
    return (
      <View>
        {this.state.isLoading ? (
          <ActivityIndicator size="large" />
        ) : (
          <View style={{ marginBottom: 2 }}>
            <Carousel
              delay={5000}
              style={this.state.size}
              autoplay
              currentPage={0}
            >
              {this.props.images.map(img => (
                <Text key={`image-${img.mid}`}>
                  <ImageBackground
                    style={this.state.size}
                    source={{ uri: img.content }}
                  >
                    <Text style={styles.textstyle}>{img.title}</Text>
                  </ImageBackground>
                </Text>
              ))}
            </Carousel>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textstyle: {
    position: 'absolute',
    color: 'white',
    top: 180,
    padding: 20,
    fontWeight: 'bold',
  },
});

export default ImageDisplay;
