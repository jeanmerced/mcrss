import React from 'react';
import { StyleSheet, View, Button, SafeAreaView,TouchableOpacity,ScrollView } from 'react-native';
import { Text} from 'react-native-elements';
import { color } from 'react-native-reanimated';
import ImageDisplay from '_components/ImageDisplay';
import EventHome from '_components/EventsHome';
import {Colors} from '_styles'
import Headlines from '_components/Headlines';
import Livestream from '_components/Livestream';
import { WebView} from 'react-native-webview'
import Multimedios from '_components/Multimedios';

const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
      <ImageDisplay ></ImageDisplay>
      <Headlines/>
      <Text h4 style={styles.shadow,{padding:10,backgroundColor:'white'}} >Eventos</Text>
      <EventHome  style={styles.shadow,{padding:10}} />
      <Text h4 style={{padding:10,marginTop:10, backgroundColor:'white'}} >Videos</Text>
      <Multimedios/>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  appButtonContainer: {
    elevation: 8,
    backgroundColor: "#009688",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12
  },
  appButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase"
  },
  container: {
    flex: 1,
    backgroundColor: Colors.screenBackground,
    alignItems: 'center',

  },
  shadow:{
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,

    elevation: 8,
  }
});

export default HomeScreen;
