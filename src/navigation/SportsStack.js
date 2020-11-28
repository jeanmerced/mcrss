import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SportsScreen from '_screens/SportsScreen';
import TeamInfo from '_screens/TeamInfo';
import { Colors } from '_styles/';

const Stack = createStackNavigator();

const SportsStack = () => {
  return (
    <Stack.Navigator initialRouteName="Sports" screenOptions={screenOptions}>
      <Stack.Screen
        name="Sports"
        component={SportsScreen}
        options={{ title: 'Deportes' }}
      />
      <Stack.Screen
        name="Sports Info"
        component={TeamInfo}
        options={{ title: 'Equipo' }}
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

export default SportsStack;
