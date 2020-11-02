import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'react-native';
import HomeScreen from '_screens/HomeScreen';
import MediaScreen from '_screens/MediaScreen';
import ResultsStack from '_navigation/ResultsStack';
import SportsScreen from '_screens/SportsScreen';
import AboutScreen from '_screens/AboutScreen';

const AppNav = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" />
      <AppNav.Navigator initialRouteName="Home" tabBarOptions={tabBarOptions}>
        <AppNav.Screen name="Inicio" component={HomeScreen} />
        <AppNav.Screen name="Media" component={MediaScreen} />
        <AppNav.Screen name="Resultados" component={ResultsStack} />
        <AppNav.Screen name="Deportes" component={SportsScreen} />
        <AppNav.Screen name="Huella" component={AboutScreen} />
      </AppNav.Navigator>
    </NavigationContainer>
  );
};

const tabBarOptions = {
  activeTintColor: '#ffffff',
  inactiveTintColor: '#d0ced1',
  labelStyle: {
    fontSize: 12,
  },
  style: {
    backgroundColor: '#1B7744',
  },
};
export default AppNavigator;
