import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ResultsScreen from '_screens/ResultsScreen';
import EventScreen from '_screens/EventScreen';
import { Colors } from '_styles/';

const Stack = createStackNavigator();

const ResultsStack = () => {
  return (
    <Stack.Navigator initialRouteName="Results" screenOptions={screenOptions}>
      <Stack.Screen
        name="Results"
        component={ResultsScreen}
        options={{ title: 'Resultados' }}
      />
      <Stack.Screen
        name="Event"
        component={EventScreen}
        options={({ route }) => ({ title: route.params.title })}
      />
    </Stack.Navigator>
  );
};

const screenOptions = {
  headerStyle: {
    backgroundColor: Colors.headerBackground,
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: 'bold',
  },
  headerBackTitleVisible: false,
};

export default ResultsStack;
