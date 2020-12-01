import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  NavigationContainer,
  getFocusedRouteNameFromRoute,
} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Colors, Elevations } from '_styles/';
import HomeScreen from '_screens/HomeScreen';
import MediaScreen from '_screens/MediaScreen';
import ArticleScreen from '_screens/ArticleScreen';

import SportsStack from '_navigation/SportsStack';
import AboutScreen from '_screens/AboutScreen';
import PBPScreen from '_screens/PBPScreen';
import EventScreen from '_screens/EventScreen';
import ResultsScreen from '_screens/ResultsScreen';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

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
    About: 'Huella Deportiva',
  };

  return screenTitles[routeName];
};

const showHeader = route => {
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Home';
  switch (routeName) {
    case 'Sports':
      return false;
    default:
      return true;
  }
};

const HomeTabs = () => (
  <Tab.Navigator
    initialRouteName="Home"
    tabBarOptions={tabBarOptions}
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        switch (route.name) {
          case 'Home':
            iconName = 'home';
            break;
          case 'Media':
            iconName = 'tv';
            break;
          case 'Results':
            iconName = 'table';
            break;
          case 'Sports':
            iconName = 'basketball-ball';
            break;
          case 'About':
            iconName = 'paw';
            break;
        }
        return <FontAwesome5 name={iconName} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{ title: 'Inicio' }}
    />
    <Tab.Screen
      name="Media"
      component={MediaScreen}
      options={{ title: 'Media' }}
    />
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
      options={{ title: 'Huella' }}
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
          options={({ route }) => ({
            headerTitle: getHeaderTitle(route),
            headerShown: showHeader(route),
          })}
        />
        <Stack.Screen
          name="PBP"
          component={PBPScreen}
          options={({ route }) => ({ headerTitle: route.params.title })}
        />
        <Stack.Screen
          name="Event"
          component={EventScreen}
          options={({ route }) => ({ headerTitle: route.params.title })}
        />
        <Stack.Screen
          name="Article"
          component={ArticleScreen}
          options={{ title: 'Artículo' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  </SafeAreaProvider>
);

const tabBarOptions = {
  activeTintColor: '#1B7744',
  labelStyle: {
    fontSize: 10,
  },
  style: {
    backgroundColor: '#F6F6F6',
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
