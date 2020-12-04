import React, { Component } from 'react';
import {
  StyleSheet,
  ActivityIndicator,
  View,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Card, Text, Image, Button, Icon } from 'react-native-elements';
import axios from 'axios';
import moment from 'moment';

const imageUrl = 'https://white-smile-272204.ue.r.appspot.com/events';

let { width, height } = Dimensions.get('window');

height = height / 2.7;

width = width / 2;

const EventHome = ({ events, navigation }) => {
  const header = (
    <Text h4 style={(styles.shadow, { padding: 10, backgroundColor: 'white' })}>
      Eventos
    </Text>
  );
  const onPress = () => {
    navigation.navigate('Results');
  };
  return (
    <View>
      {header}
      <ScrollView
        horizontal={true}
        alwaysBounceHorizontal
        Style={styles.container}
      >
        {events.map(sportEvent => (
          <Card
            key={`event-${sportEvent.id}`}
            containerStyle={[{ width, height }, { padding: 0 }]}
          >
            <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
              <Card.Image source={{ uri: sportEvent.sport_img_url }} />

              <Text
                style={{ fontWeight: 'bold', textAlign: 'left', margin: 5 }}
              >
                {sportEvent.branch == 'Masculino' ? 'Tarzanes' : 'Juanas'} vs{' '}
                {sportEvent.opponent_name}
              </Text>
              <Text style={{ textAlign: 'left', margin: 5 }}>
                {sportEvent.sport_name} {sportEvent.branch}
              </Text>
              <Text style={{ textAlign: 'left', margin: 5 }}>
                {moment(sportEvent.event_date).utc(true).format('ll')}
              </Text>
            </TouchableOpacity>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    color: 'darkslateblue',
    fontSize: 30,
    textAlign: 'center',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 1,
    shadowRadius: 13.97,

    elevation: 21,
  },
});

export default EventHome;
