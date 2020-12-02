import React, { Component } from 'react'
import { StyleSheet,ActivityIndicator, View,Dimensions,ScrollView,TouchableOpacity} from 'react-native'
import {Card,Text,Image, Button, Icon } from 'react-native-elements'
import axios from 'axios'
import moment from 'moment'


const imageUrl = 'https://white-smile-272204.ue.r.appspot.com/events'

let {width,height} = Dimensions.get('window');

height=height/2.7;

width= width/2


class EventHome extends Component {
    state = { isLoading: false, pics: [],last:[], size: { width, height },};
  
    componentDidMount() {
      this.setState({ isLoading: true });
      // Fetch sport pics
      axios
        .get(imageUrl)
        .then(res => {
          
          //'data' field in the response has the pics[]
          this.setState({pics:res.data.Events});
          this.setState({last:res.data.Events.slice(-4)});
          this.setState({ isLoading: false });

        })
        .catch(err => console.log(err));
    }
  
    render() {
      let images = this.state.last.map(a => a.sport_img_url);
      let opp = this.state.last.map(a => a.opponent_name);
      let branch = this.state.last.map(a => a.branch);
      let spb = this.state.last.map(a => a.branch);
      let sport = this.state.last.map(a => a.sport_name);
      let date = this.state.last.map(a => a.event_date);
      for (let i = 0; i < branch.length; i++) {
        if(branch[i]=='Masculino'){
          branch[i]='Tarzanes'
        }
        else{
          branch[i]='Juanas'
        }
      }
      // for (let i = 0; i < date.length; i++) {
      //    date[i]=date[i].slice(5,16)
      // }
      return (
        <View>
          {this.state.isLoading ? (
            <ActivityIndicator size="large" />
          ) : ( 
              <ScrollView horizontal={true} alwaysBounceHorizontal Style={styles.container} >
                
                <Card  containerStyle={[this.state.size,{padding:0}]}  >
                <Card.Image source={{uri:images[0]}}/>
          
                <TouchableOpacity>
                
                <Text style={{fontWeight:'bold',textAlign:'left',margin:5}}>
                      {branch[0]} vs  {opp[0]}
                  </Text>
                  <Text style={{textAlign:'left',margin:5}}>
                      {sport[0]} {spb[0]}
                  </Text>
                  <Text style={{textAlign:'left',margin:5}}>
                        {moment(date[0]).utc().format('ll')}
                  </Text>
                  </TouchableOpacity>
                </Card>
                
                
                <Card  containerStyle={[this.state.size,{padding:0}]}  >
                <Card.Image source={{uri:images[1]}}/>
          
                <TouchableOpacity>
                
                <Text style={{fontWeight:'bold',textAlign:'left',margin:5}}>
                      {branch[1]} vs  {opp[1]}
                  </Text>
                  <Text style={{textAlign:'left',margin:5}}>
                      {sport[1]} {spb[1]}
                  </Text>
                  <Text style={{textAlign:'left',margin:5}}>
                       {moment(date[1]).utc().format('ll')}
                  </Text>
                  </TouchableOpacity>
                </Card>

                <Card  containerStyle={[this.state.size,{padding:0}]}  >
                <Card.Image source={{uri:images[2]}}/>
          
                <TouchableOpacity>
                
                <Text style={{fontWeight:'bold',textAlign:'left',margin:5}}>
                      {branch[2]} vs  {opp[2]}
                  </Text>
                  <Text style={{textAlign:'left',margin:5}}>
                      {sport[2]} {spb[2]}
                  </Text>
                  <Text style={{textAlign:'left',margin:5}}>
                      {moment(date[2]).utc().format('ll')}
                  </Text>
                  </TouchableOpacity>
                </Card>

                <Card  containerStyle={[this.state.size,{padding:0}]}  >
                <Card.Image source={{uri:images[3]}}/>
          
                <TouchableOpacity>
                
                <Text style={{fontWeight:'bold',textAlign:'left',margin:5}}>
                      {branch[3]} vs  {opp[3]}
                  </Text>
                  <Text style={{textAlign:'left',margin:5}}>
                      {sport[3]} {spb[3]}
                  </Text>
                  <Text style={{textAlign:'left',margin:5}}>
                  {moment(date[3]).utc().format('ll')}
                  </Text>
                  </TouchableOpacity>
                </Card>
                
                
              </ScrollView>   
          )}
        </View>
      );
    }
  }

  const styles = StyleSheet.create({
    text: {
      color: 'darkslateblue',
      fontSize: 30,
      textAlign: 'center',
    },
    shadow:{
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 10,
        },
        shadowOpacity: 1,
        shadowRadius: 13.97,

        elevation: 21,
        
      
    },
    
  });
  


export default EventHome
