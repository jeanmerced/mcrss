
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
  ActivityIndicator,
  View,
  FlatList,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import {
    
    Image,
    Avatar,
    Text,
    Divider
  } from 'react-native-elements';
import axios from 'axios';
import { Colors } from '_styles';
import { useNavigation } from '@react-navigation/native';






const AthletePage = ({sport,sportId,branch}) => {
const navigation = useNavigation();



const [athlete,setAthlete] = useState([]);

const renderItem = ({ item }) => {
    
    return (
       
        

        <View style={{ flex: 1,flexDirection: 'row', flexWrap: 'wrap',alignItems: 'flex-start'}}> 
        { item.profilePicLink=='' ? (
               
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
             source={{ uri: item.profilePicLink}}
              PlaceholderContent={<ActivityIndicator/>}/>)}
        <TouchableOpacity
        
        onPress={() => {
          navigation.navigate('Athlete Info',{
          id:item.id,sportname:sport,}
          );  
        }}
        >
        <View>
        <Text h4 style={{padding:10}} >{item.fName} {item.lName} #{item.number}</Text>
        </View>
        </TouchableOpacity>
        
        
        
        <View style={{width:'50%',marginLeft:'20%',marginBottom:15}}>
        <Text style={{fontWeight:'bold'}}>Programa de Estudio:</Text><Text>{item.sProgram}</Text>
        <Text style={{fontWeight:'bold'}}>Escuela de Precedencia:</Text><Text>{item.school}</Text>
        </View>

        <View style={{width:'30%'}}>
        <Text style={{fontWeight:'bold'}}>Año:</Text><Text>{item.yearsOfParticipation}</Text>
        <Text style={{fontWeight:'bold'}}>Estatura:</Text><Text>{item.height}"</Text>
        </View>
       
        </View>
        
        
      
      
    );
  
  };

  const athleteUrl = 'https://white-smile-272204.ue.r.appspot.com/athletes/public/'
 

 const componentDidMount= () => {
    axios
      .get(athleteUrl)
      .then(res => {
        
        //'data' field in the response has the text[]
        let temp=[];
        res.data.Athletes.map(element => {
          if(element.sport_id==sportId){
            temp.push(element)
          }
        })
        setAthlete(temp);
        

      })
      .catch(err => console.log(err));
  };



  useEffect(() => {
    componentDidMount()
  },[])

  
 
  return (
    <View>
                { athlete.length==0 ? (
                <ActivityIndicator size="large" />
                ) : ( 
    
                    <View style={styles.container,{padding:4,marginTop:10,marginBottom:15,backgroundColor:'white'}}>
                    <FlatList
                    data={athlete}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    ItemSeparatorComponent={()=><Divider />}
                    ListEmptyComponent={() => (
                       <Text> No hay Atletas</Text>
                    )}
                    />
                  </View>   
    
              )}   
                </View>
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

export default AthletePage;
