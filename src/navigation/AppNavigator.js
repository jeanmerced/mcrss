import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  NavigationContainer,
  getFocusedRouteNameFromRoute,
} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'react-native';
import { Colors } from '_styles/';
import HomeScreen from '_screens/HomeScreen';
import MediaScreen from '_screens/MediaScreen';
import SportsScreen from '_screens/SportsScreen';
import SportsStack from '_navigation/SportsStack';
import AboutScreen from '_screens/AboutScreen';
import EventScreen from '_screens/EventScreen';
import ResultsScreen from '_screens/ResultsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

/* 
Follow ReactNavigation.org to understand navigation.
Instead of nesting stack navigation on a tab navigator
we are doing the opposite. That way the event screen can
show full screen without the tab navigation.
*/

const getHeaderTitle = route => {
  // If the focused route is not found, we need to assume it's the initial screen
  // This can happen during if there hasn't been any navigation inside the screen
  // In our case, it's "Feed" as that's the first screen inside the navigator
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Home';
  const screenTitles = {
    Home: 'Inicio',
    Media: 'Media',
    Results: 'Resultados',
    Sports: 'Deportes',
    About: 'Huella',
  };

  return screenTitles[routeName];
};

const HomeTabs = () => (
  <Tab.Navigator initialRouteName="Home" tabBarOptions={tabBarOptions}>
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{ title: 'Inicio' }}
    />
    <Tab.Screen name="Media" component={MediaScreen} />
    <Tab.Screen
      name="Results"
      component={ResultsScreen}
      options={{ title: 'Resultados' }}
    />
    <Tab.Screen
      name="Sports"
      component={SportsStack}
      options={{ title: 'Deportes' }}
    />
    <Tab.Screen
      name="About"
      component={AboutScreen}
      options={{ title: 'About' }}
    />
  </Tab.Navigator>
);

const AppNavigator = () => (
  <SafeAreaProvider>
    <NavigationContainer>
      <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen
          name="Home"
          component={HomeTabs}
          options={({ route }) => ({ headerTitle: getHeaderTitle(route) })}
        />
        <Stack.Screen
          name="Event"
          component={EventScreen}
          options={({ route }) => ({ headerTitle: route.params.title })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  </SafeAreaProvider>
);

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
export default AppNavigator;
