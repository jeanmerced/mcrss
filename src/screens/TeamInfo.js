import React, { useEffect, useState, useLayoutEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Share,
} from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import TeamPage from '_components/TeamPage';
import AthletePage from '_components/AthletePage';
import { Entypo } from '@expo/vector-icons';
import { Colors } from '_styles';

const shareUrl = 'https://huella-deportiva-web.ue.r.appspot.com/deportes';

const TeamInfo = ({ route, navigation }) => {
  const { sportId, branch, title } = route.params;

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'team', title: route.params.title + ' ' + route.params.branch },
    { key: 'athletes', title: 'Atletas' },
  ]);

  const onShare = async (branch, id) => {
    let sport = branch;
    if (sport == 'exhibición') {
      sport = 'exhibicin';
    }

    try {
      const result = await Share.share({
        message: `${shareUrl}-${sport}/equipo/${id}`,
        /*
        URL sharing not supported for Android
        You will need to eject the app from expo and use react-native-share
        For the moment we place the url link in the message but to enable it for ios
        discomment line below and remove `\n${shareUrl}/${id}` from message
        */
        // url: `${shareUrl}/${id}`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Entypo
          name="share-alternative"
          size={24}
          color="white"
          style={{ padding: 10 }}
          onPress={() => onShare(branch.toLowerCase(), sportId)}
        />
      ),
    });
  }, [navigation]);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'team':
        return <TeamPage sport={title} branch={branch} sportId={sportId} />;
      case 'athletes':
        return <AthletePage sport={title} branch={branch} sportId={sportId} />;
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
