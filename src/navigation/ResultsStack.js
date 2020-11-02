import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ResultsScreen from '_screens/ResultsScreen';
import EventScreen from '_screens/EventScreen';
import { Colors } from '_styles/';

const Stack = createStackNavigator();

const ResultsStack = () => {
  return (
    <Stack.Navigator initialRouteName="Results">
      <Stack.Screen
        name="Results"
        component={ResultsScreen}
        options={screenOptions}
      />
      <Stack.Screen name="Event" component={EventScreen} />
    </Stack.Navigator>
  );
};

const screenOptions = {
  title: 'Resultados',
  headerStyle: {
    backgroundColor: Colors.headerBackground,
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: 'bold',
    fontSize: 23,
  },
};

export default ResultsStack;
