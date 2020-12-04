import React, { useEffect, useState, useLayoutEffect } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
  ActivityIndicator,
  View,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Share,
  Image,
  ImageBackground,
} from 'react-native';
import {Avatar, Text, Divider } from 'react-native-elements';
import axios from 'axios';
import { TabView, TabBar } from 'react-native-tab-view';
import AtheleteStatsTable from '_components/AthleteStatsTable';
import { Entypo } from '@expo/vector-icons';
import { Colors } from '_styles';
import { useNavigation } from '@react-navigation/native';
import AthleteStatsTable from '_components/AthleteStatsTable';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/Feather';
import StatsLegend from '_components/StatsLegend';

const buildYearList = () => {
  let yearFirst = 2019;
  const currentYear = new Date(Date.now()).getFullYear();
  const yearList = [];
  while (yearFirst <= currentYear) {
    yearList.push({ season_year: yearFirst });
    yearFirst++;
  }

  return yearList;
};

const shareUrl = 'https://huella-deportiva-web.ue.r.appspot.com/atletas';

const AthleteScreen = ({ route, navigation }) => {
  const { id, sportname } = route.params;

  let yearList = buildYearList();

  const [Year, setYear] = useState(() => {
    let currentYear = new Date(Date.now()).getFullYear();
    return currentYear.toString();
  });

  const [athlete, setAthlete] = useState([]);
  const [athleteSeason, setAthleteSeason] = useState([]);
  const [eventStatistics, setEventStatistics] = useState([]);

  const [athleteAggregateSeason, setAthleteAggregateSeason] = useState([]);
  const [eventAggregateStatistics, setEventAggregateStatistics] = useState([]);

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'AthleteInfo', title: 'Información' },
    { key: 'statistics', title: 'Estadisticas Del Jugador' },
  ]);

  const onShare = async id => {
    try {
      const result = await Share.share({
        message: `${shareUrl}/${id}`,
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
          onPress={() => onShare(id)}
        />
      ),
    });
  }, [navigation]);

  const athleteInfo = () => {
    let athleteUrl =
      'https://white-smile-272204.ue.r.appspot.com/athletes/' + id + '/public/';

    axios
      .get(athleteUrl)
      .then(res => {
        //'data' field in the response has the events[]
        //   console.log(res.data.Team);
        {
          setAthlete(res.data.Athlete);
        }
      })
      .catch(err => console.log(err));
  };

  const athleteSeasonInfo = () => {
    //'data' field in the response has the events[]
    let sportParam;
    let eventStats;
    let teamStats;
    switch (sportname) {
      case 'Voleibol':
        sportParam = 'volleyball';
        eventStats = 'Volleyball_Event_Season_Athlete_Statistics';
        teamStats = 'volleyball_statistics';
        break;
      case 'Baloncesto':
        sportParam = 'basketball';
        eventStats = 'Basketball_Event_Season_Athlete_Statistics';
        teamStats = 'basketball_statistics';
        break;
      case 'Futbol':
        sportParam = 'soccer';
        eventStats = 'Soccer_Event_Season_Athlete_Statistics';
        teamStats = 'soccer_statistics';
        break;
      case 'Beisbol':
        sportParam = 'baseball';
        eventStats = 'Baseball_Event_Season_Athlete_Statistics';
        break;
      case 'Softbol':
        sportParam = 'softball';
        eventStats = 'Softball_Event_Season_Athlete_Statistics';
        break;
      case 'Atletismo':
      case 'Campo Traviesa':
      case 'Halterofilia':
      case 'Judo':
      case 'Lucha Olímpica':
      case 'Natación':
      case 'Taekwondo':
      case 'Baile':
      case 'Porrismo':
        sportParam = 'medalbased';
        eventStats = 'Medal_Based_Event_Season_Athlete_Statistics';
        break;
      case 'Tenis de Campo':
      case 'Tenis de Mesa':
        sportParam = 'matchbased';
        eventStats = 'Match_Based_Event_Season_Athlete_Statistics';
        break;
      default:
        break;
    }

    let athleteSeasonUrl =
      'https://white-smile-272204.ue.r.appspot.com/results/' +
      sportParam +
      '/season/athlete_aggregate/?athlete_id=' +
      id +
      '&season_year=' +
      Year;

    axios
      .get(athleteSeasonUrl)
      .then(res => {
        if (sportParam=='medalbased') {
          {
            setAthleteSeason([]);
          }
          {
            setEventStatistics([]);
          }
          
        }
        else{
        {
          setAthleteSeason(res.data[eventStats].Athlete);
        }
        {
          setEventStatistics(res.data[eventStats].Event_Statistics);
        }
      }
      })
      .catch(err => {
        {
          setAthleteSeason([]);
        }
        {
          setEventStatistics([]);
        }
      });
  };

  const athleteAggregateInfo = () => {
    //'data' field in the response has the events[]
    let sportParam;
    let eventStats;
    let teamStats;
    switch (sportname) {
      case 'Voleibol':
        sportParam = 'volleyball';
        eventStats = 'Volleyball_Event_Season_Athlete_Statistics';
        teamStats = 'volleyball_statistics';
        break;
      case 'Baloncesto':
        sportParam = 'basketball';
        eventStats = 'Basketball_Event_Season_Athlete_Statistics';
        teamStats = 'basketball_statistics';
        break;
      case 'Futbol':
        sportParam = 'soccer';
        eventStats = 'Soccer_Event_Season_Athlete_Statistics';
        teamStats = 'soccer_statistics';
        break;
      case 'Beisbol':
        sportParam = 'baseball';
        eventStats = 'Baseball_Event_Season_Athlete_Statistics';
        break;
      case 'Softbol':
        sportParam = 'softball';
        eventStats = 'Softball_Event_Season_Athlete_Statistics';
        break;
      case 'Atletismo':
      case 'Campo Traviesa':
      case 'Halterofilia':
      case 'Judo':
      case 'Lucha Olímpica':
      case 'Natación':
      case 'Taekwondo':
      case 'Baile':
      case 'Porrismo':
        sportParam = 'medalbased';
        eventStats = 'Medal_Based_Event_Season_Athlete_Statistics';
        break;
      case 'Tenis de Campo':
      case 'Tenis de Mesa':
        sportParam = 'matchbased';
        eventStats = 'Match_Based_Event_Season_Athlete_Statistics';
        break;
      default:
        break;
    }

    let athleteSeasonUrl =
      'https://white-smile-272204.ue.r.appspot.com/results/' +
      sportParam +
      '/season/athlete_aggregate/?athlete_id=' +
      id +
      '&season_start=2019';
    axios
      .get(athleteSeasonUrl)
      .then(res => {
        {
          setAthleteAggregateSeason(res.data[eventStats].Athlete);
        }
        {
          setEventAggregateStatistics(res.data[eventStats].Event_Statistics);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  useEffect(() => {
    athleteInfo();
    athleteSeasonInfo();
    athleteAggregateInfo();
  }, [Year]);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'AthleteInfo':
        return (
          <View >
            {athlete.length == 0 ? (
              <ActivityIndicator size="large" />
            ) : (
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  alignItems: 'flex-start',
                }}
              >
                <View alignItems="center" style={{marginBottom:150}}>
                  {athlete.profilePicLink == '' ? (
                    <Avatar
                      containerStyle={{ marginTop: 5 }}
                      size="xlarge"
                      icon={{ name: 'picture-o', type: 'font-awesome' }}
                      overlayContainerStyle={{ backgroundColor: 'grey' }}
                    />
                  ) : (
                    <View>
                    <Image
                      style={{width: 150, height: 150}}
                      source={{ uri:athlete.profilePicLink }}
                    />
                    </View>
                  )}
                </View>

                <View style={{ padding: 20 }}>
                  <Text h4>
                    {athlete.fName} {athlete.lName} #{athlete.number}{' '}
                  </Text>
                </View>
                <View style={{ marginHorizontal: 15 }}>
                  <Text>
                    {' '}
                    <Text style={{ fontWeight: 'bold' }}>
                      Años de Participación:
                    </Text>{' '}
                    {athlete.yearsOfParticipation}{' '}
                    <Text style={{ fontWeight: 'bold' }}> | Deporte: </Text>
                    {athlete.sportName}
                  </Text>
                </View>
                <View style={{ margin: 15 }}>
                  <Text>
                    {' '}
                    <Text style={{ fontWeight: 'bold' }}>
                      Fecha de Nacimiento:
                    </Text>
                    {athlete.dBirth.slice(4, 16)}
                    <Text style={{ fontWeight: 'bold' }}> | Estatura: </Text>
                    {athlete.height}"
                  </Text>
                </View>
                <View style={{ marginHorizontal: 15 }}>
                  <Text>
                    {' '}
                    <Text style={{ fontWeight: 'bold' }}>
                      Programa de Estudio:
                    </Text>{' '}
                    {athlete.sProgram}{' '}
                    <Text style={{ fontWeight: 'bold' }}>
                      {' '}
                      | Año de Estudio:{' '}
                    </Text>
                    {athlete.yearOfStudy}
                  </Text>
                </View>
                <View style={{ margin: 15 }}>
                  <Text>
                    {' '}
                    <Text style={{ fontWeight: 'bold' }}>
                      Escuela de Precedencia:
                    </Text>{' '}
                    {athlete.school}{' '}
                  </Text>
                </View>
                <View style={{ marginHorizontal: 15 }}>
                  <Text>
                    {' '}
                    <Text style={{ fontWeight: 'bold' }}>Biografía:</Text>{' '}
                    {athlete.bio}{' '}
                  </Text>
                </View>
              </View>
            )}
          </View>
        );
      case 'statistics':
        return (
          <View >
            <View style={{ flex: 0, flexDirection: 'row', padding: 10 }}>
              <Text h4 style={{ width: '50%', textAlign: 'center' }}>
                Temporada
              </Text>
              <DropDownPicker
                items={yearList.map(year => ({
                  label: year.season_year.toString(),
                  value: year.season_year.toString(),
                  icon: () => <Icon name="calendar" size={25} />,
                }))}
                defaultValue={Year}
                containerStyle={{ height: 40, width: '40%' }}
                itemStyle={{
                  justifyContent: 'flex-start',
                }}
                dropDownStyle={{ backgroundColor: '#fafafa' }}
                onChangeItem={item => setYear(item.value)}
              />
            </View>
            {athleteSeason.length == 0 ||
            athleteAggregateSeason.length == 0 ||
            eventAggregateStatistics.length == 0 ||
            eventStatistics.length == 0 ||
            athlete.length == 0 ? (
              <View >
                <Text
                  style={{
                    textAlign: 'left',
                    marginHorizontal: 10,
                    marginVertical: 20,
                    fontWeight: 'bold',
                    fontSize: 20,
                  }}
                >
                  No hay estadísticas para la temporada: {Year}
                </Text>

                {athlete.length == 0 ||
                eventAggregateStatistics.length == 0 ||
                athleteAggregateSeason.length == 0 ? (
                  <Text
                    style={{
                      textAlign: 'left',
                      marginHorizontal: 10,
                      marginVertical: 20,
                      fontWeight: 'bold',
                      fontSize: 20,
                    }}
                  >
                    No hay estadísticas de Carrera
                  </Text>
                ) : (
                  <View >
                    <View style={{ zIndex: -1, marginVertical: 20}}>
                      <Text
                        style={{
                          textAlign: 'left',
                          marginHorizontal: 10,
                          fontWeight: 'bold',
                          fontSize: 20,
                        }}
                      >
                        Estadísticas de Carrera:
                      </Text>
                    </View>
                    <View >
                      <AthleteStatsTable
                        
                        sport={athlete.sportName}
                        athleteStatistics={[
                          {
                            athlete_info: athleteAggregateSeason,
                            statistics: eventAggregateStatistics,
                          },
                        ]}
                      />
                    </View>
                  </View>
                )}
              </View>
            ) : (
              <View >
                <View style={{ zIndex: -1, marginVertical: 20 }}>
                  <Text
                    style={{
                      textAlign: 'left',
                      marginHorizontal: 10,
                      fontWeight: 'bold',
                      fontSize: 20,
                    }}
                  >
                    Estadísticas de la Temporada {Year}:
                  </Text>
                </View>

                <View style={{ zIndex: -1 }}>
                  <AthleteStatsTable
                    sport={athlete.sportName}
                    athleteStatistics={[
                      {
                        athlete_info: athleteSeason,
                        statistics: eventStatistics,
                      },
                    ]}
                  />
                </View>

                <View style={{ zIndex: -1, marginVertical: 20 }}>
                  <Text
                    style={{
                      textAlign: 'left',
                      marginHorizontal: 10,
                      fontWeight: 'bold',
                      fontSize: 20,
                    }}
                  >
                    Estadísticas de Carrera:
                  </Text>
                </View>
                <View >
                  <AthleteStatsTable
                    sport={athlete.sportName}
                    athleteStatistics={[
                      {
                        athlete_info: athleteAggregateSeason,
                        statistics: eventAggregateStatistics,
                      },
                    ]}
                  />
                </View>
              </View>
            )}
            <View>
            <StatsLegend sport={sportname} />
            </View>
          </View>
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

export default AthleteScreen;
