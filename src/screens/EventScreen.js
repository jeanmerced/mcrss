import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const EventScreen = ({ navigation }) => {
  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      navigation.popToTop();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Event View</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'darkslateblue',
    fontSize: 30,
    textAlign: 'center',
  },
});

export default EventScreen;
