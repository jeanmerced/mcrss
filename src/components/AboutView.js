import React, { Component } from 'react'
import { StyleSheet,ActivityIndicator, Text, View,Dimensions, ScrollView } from 'react-native'
import { Image,Card} from 'react-native-elements'
import axios from 'axios';

const aboutusCaptainUrl = 'https://white-smile-272204.ue.r.appspot.com/aboutus/captain'
const aboutusMembersUrl = 'https://white-smile-272204.ue.r.appspot.com/aboutus/member'
const aboutusDescriptionUrl = 'https://white-smile-272204.ue.r.appspot.com/aboutus/description'

let {width,height} = Dimensions.get('window');

height=height/2.6;
width=width/2;


class AboutView extends Component {
    state = { isLoading: false, members: [],captain:[],description:[], size: { width, height },};
  
    componentDidMount() {
        // Fetch sport events
        axios
            .get(aboutusCaptainUrl)
            .then(res => {
                
                //'data' field in the response has the events[]
                this.setState({captain:res.data.AboutUs})
                
            })
            .catch(err => console.log(err));

        axios
            .get(aboutusMembersUrl)
            .then(res => {
                
                //'data' field in the response has the events[]
                this.setState({members:res.data.AboutUs})
                
            })
            .catch(err => console.log(err));

        axios
            .get(aboutusDescriptionUrl)
            .then(res => {
                
                //'data' field in the response has the events[]
                this.setState({description:res.data.AboutUs})
                
            })
            .catch(err => console.log(err));
        
        
    
        
    }
  
    render() {
      let name = this.state.captain.map(a => a.hdmember);
      let major = this.state.captain.map(a => a.major);
      let picture = this.state.captain.map(a => a.picture);
      let title = this.state.captain.map(a => a.title);
      let description = this.state.description.map(a => a.title);
      return (
        <ScrollView>
          {(this.state.members.length==0 || this.state.captain.length==0 || this.state.description.length==0) ? (
            <ActivityIndicator size="large" />
          ) : ( 

              <View  style={styles.container}>
                  <Text style={{fontWeight:'bold',textAlign:'left',margin:20}}>
                    Sobre Nosotros
                  </Text>
                  <Text numberOfLines={8} style={{textAlign:'left',marginHorizontal:20}}>
                      {description}
                  </Text>

                <View>
                    
                </View>
                <View>
                <Card  containerStyle={[{padding:10}]}  >
                <Card.Image  source={{uri:picture[0]}} resizeMode={'center'}  style={{borderRadius: 100 }} />
                <Text style={{fontWeight:'bold',textAlign:'center',margin:5}}>
                      {name[0]}
                  </Text>
                  <Text style={{textAlign:'left',margin:5}}>
                     <Text style={{fontWeight:'bold'}}> Cargo:</Text> {title[0]}
                  </Text>
                  <Text style={{textAlign:'left',margin:5}}>
                  <Text style={{fontWeight:'bold'}}> Programa de Estudio:</Text>  {major[0]}
                  </Text>
                </Card>

                </View>
                <View>

                {this.state.members.map((a,i) => (
                <Card key={i} containerStyle={[{padding:10}]}  >
                <Card.Image  source={{uri:a.picture}} resizeMode={'center'}  style={{borderRadius: 100 }} />
                <Text style={{fontWeight:'bold',textAlign:'center',margin:5}}>
                      {a.hdmember}
                  </Text>
                  <Text style={{textAlign:'left',margin:5}}>
                     <Text style={{fontWeight:'bold'}}> Cargo:</Text> {a.title}</Text>
                  <Text style={{textAlign:'left',margin:5}}>
                  <Text style={{fontWeight:'bold'}}> Programa de Estudio:</Text>  {a.major}
                  </Text>
                </Card>
                ))}
                </View>
                
            </View>
              

          )}
        </ScrollView>
      );
    }
  }

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start' ,// if you want to fill rows left to right

      },
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 9,
        },
        shadowOpacity: 0.50,
        shadowRadius: 12.35,

        elevation: 19,
      },
 
});


export default AboutView

