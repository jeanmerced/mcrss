
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import TeamPage from '_components/TeamPage';
import AthletePage from '_components/AthletePage';
import { Colors } from '_styles';


const TeamInfo = ({ route }) => {
    const { sportId, branch, title } = route.params;
    
    
    const [index, setIndex] = useState(0);
    const [routes] = useState([
      { key: 'team', title:route.params.title+' '+route.params.branch },
      { key: 'athletes', title: 'Atletas' },
    ]);

const renderScene = ({ route }) => {
    switch (route.key) {
        case 'team':
          return (

            <TeamPage 
            sport={title}
            branch={branch}
            sportId={sportId}
           
          />
            
          );
        case 'athletes':
          return (
            <AthletePage 
            sport={title}
            branch={branch}
            sportId={sportId}
           />
          );
        default:
          return null;
    }
  };

  const renderTabBar = props => (
    <TabBar
      {...props}
      style={{ backgroundColor: 'white', marginBottom: 8 }}
      indicatorStyle={{ backgroundColor: '#1B7744', height: 4 }}
      labelStyle={{ fontSize: 13, fontWeight: 'bold', color: 'black' }}
    />
  );
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'light-content'} />
      <TabView
        renderTabBar={renderTabBar}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: Dimensions.get('window').width }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.screenBackground,
    },
    text: {
      color: 'darkslateblue',
      fontSize: 30,
      textAlign: 'center',
    },
  });

export default TeamInfo;
