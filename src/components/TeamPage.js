
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
  ActivityIndicator,
  View,
  FlatList,
  TouchableOpacity
} from 'react-native';
import {
    
    Image,
    Avatar,
    Text,
    Divider
  } from 'react-native-elements';
import axios from 'axios';
import { TabView, TabBar } from 'react-native-tab-view';
import { Colors } from '_styles';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/Feather';




const buildYearList = () => {
    let yearFirst = 2020;
    const currentYear = new Date(Date.now()).getFullYear();
    const yearList = [];
    while(yearFirst <= currentYear)
    {
        yearList.push({'season_year':yearFirst})
        yearFirst++;
    }
    
    return yearList;
 }

const TeamPage = ( props) => {

    
const [index, setIndex] = useState(0);
const [routes] = useState([
    { key: 'description', title:'Descripcion' },
    { key: 'athletes', title: 'Atletas' },
    { key: 'statistics', title: 'Estadisticas' },
]);

let yearList= buildYearList();




const [Year,setYear] = useState(()=> {let currentYear=new Date(Date.now()).getFullYear();
    return currentYear.toString();
});

const [team,setTeam] = useState([]);

const [members,setMembers] = useState([]);


const renderItem = ({ item }) => {
    return (
      
        
        <View style={{ flex: 1,flexDirection: 'row', flexWrap: 'wrap',alignItems: 'flex-start'}}> 
        
        
        { item.profile_image_link=='' ? (
               
               <Avatar
               containerStyle={{marginTop:5}}
               rounded
               size="medium"    
               icon={{name: 'picture-o', type: 'font-awesome'}}
               overlayContainerStyle={{backgroundColor: 'grey'}}
             />
              ) : (     
             <Image 
             containerStyle={{margin:10}}
             source={{ uri: item.profile_image_link}}
              PlaceholderContent={<ActivityIndicator/>}/>)}
        <TouchableOpacity>
        <View>
        <Text h4 style={{padding:10}} >{item.first_name} {item.last_names}  #{item.number}</Text>
        </View>
        </TouchableOpacity>
        

        <View style={{width:'50%',marginLeft:'20%',marginBottom:15}}>
        <Text style={{fontWeight:'bold'}} >Programa de Estudio:</Text><Text>{item.study_program}</Text>
        <Text style={{fontWeight:'bold'}}>Escuela de Precedencia:</Text><Text>{item.school_of_precedence}</Text>
        </View>
        <View style={{width:'30%'}}>
        
        <Text style={{fontWeight:'bold'}}>Año:</Text><Text>{item.years_of_participation}</Text>
        <Text style={{fontWeight:'bold'}}>Estatura:</Text><Text>{item.height_inches}"</Text>
        
        </View>
       
        </View>


        
        
        
        
      
      
    );
  
  };
    
    

const renderScene = ({ route }) => {
    switch (route.key) {
        case 'description':
          return (
            <View>
            { team.length==0 ? (
            <ActivityIndicator size="large" />
            ) : ( 

              <View  style={styles.container}>
                 { team.team_info.team_image_url=='' ? (
               
                  <Avatar
                  rounded
                  size="large"    
                  icon={{name: 'picture-o', type: 'font-awesome'}}
                  overlayContainerStyle={{backgroundColor: 'grey',margin:5}}
                />
                 ) : (     
                <Image 
                containerStyle={{margin:10}}
                source={{ uri: team.team_info.team_image_url}}
                 PlaceholderContent={<ActivityIndicator/>}/>)}
                <Text style={{fontWeight:'bold',marginVertical:5,padding:5}}>Sobre el Equipo:</Text>
                <Text style={{marginVertical:5,padding:5}}>{team.team_info.about_team}</Text>
              </View>

          )}   
            </View>
          );
        case 'athletes':
            return (
                <View>
                { members.length==0 ? (
                <ActivityIndicator size="large" />
                ) : ( 
    
                    <View style={styles.container,{padding:4,marginTop:10,marginBottom:15,backgroundColor:'white'}}>
                    <FlatList
                    data={members.team_members}
                    renderItem={renderItem}
                    keyExtractor={item => item.athlete_id}
                    ItemSeparatorComponent={()=><Divider />}
                    ListEmptyComponent={() => (
                       <Text> No hay Atletas</Text>
                    )}
                    />
                  </View>   
    
              )}   
                </View>
            );
        case 'statistics':
          return (
            <Text>Estadisticas</Text>
          );
        default:
          return null;
    }
  };

  const renderTabBar = props => (
     <TabBar
    {...props}
    style={styles.tabBar}
    inactiveColor={'black'}
    activeColor={'white'}
    indicatorStyle={styles.tabIndicator}
    labelStyle={{ fontSize: 11, fontWeight: 'bold' }}
    contentContainerStyle={{ height: 50, alignItems: 'center' }}
  />
  );

  const teamInfo = (Year) => {
    let teamUrl= 'https://white-smile-272204.ue.r.appspot.com/teams/public/?sport_id='+props.sportId+'&season_year='+Year;
    axios
    .get(teamUrl)
    .then(res => {
      //'data' field in the response has the events[]
    //   console.log(res.data.Team);
     {setTeam(res.data.Team)};

     Members(res.data.Team.team_info.team_id);
     

      
    })
    .catch(err => console.log(err));
    
    

  };

  const Members = (teamid) => {
    
     let memberUrl= 'https://white-smile-272204.ue.r.appspot.com/teams/members/public/?team_id='+teamid;
     axios
    .get(memberUrl)
    .then(res => {
      //'data' field in the response has the events[]
     {setMembers(res.data.Team)};
      
    })
    .catch(err => console.log(err));
    

  };


  useEffect(() => {
      teamInfo(Year)
  }, [Year])

 
 
 
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'light-content'} />
      <View style={{ flex: 0,flexDirection: 'row',padding:10}}>
      <Text h4 style={{width:'50%',textAlign:'center'}}>Temporada</Text>
      <DropDownPicker
            items={yearList.map(year => ({label: year.season_year.toString(), value: Year, icon: () => <Icon name="calendar" size={25}  /> }))
        
            }
            defaultValue={Year}
            containerStyle={{height: 40,width:'40%'}}
            style={{backgroundColor: '#fafafa'}}
            itemStyle={{
                justifyContent: 'flex-start'
            }}
            dropDownStyle={{backgroundColor: '#fafafa'}}
            onChangeItem={ item=> setYear(item.value) }
        />
      </View>
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

    tabBar: {
        backgroundColor: 'white',
        marginBottom: 8,
        width: '90%',
        marginLeft: '5%',
        borderRadius: 10,
      },
      tabIndicator: {
        backgroundColor: '#1B7744',
        height: 40,
        marginBottom: 4,
        borderRadius: 10,
      },
  });

export default TeamPage;
