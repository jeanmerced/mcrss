import React, { Component } from 'react'
import { StyleSheet,ActivityIndicator,FlatList, TouchableOpacity, View,Dimensions } from 'react-native'
import { Text,Divider } from 'react-native-elements'
import axios from 'axios';


const imageUrl = 'https://white-smile-272204.ue.r.appspot.com/multimedia/text'

let {width,height} = Dimensions.get('window');

height=height/4;




const renderItem = ({ item }) => { 
  let title=item.title;
  let mid=item.mid;
  return (
    <View> 
      <TouchableOpacity>
      <Text style={{padding:8,margin:10,fontSize:13}}>{title}</Text>
      </TouchableOpacity>
    </View>
    
  );

};

const Header = () => {
  //View to set in Header
  return (
    <View >
      <Text h4 style={{padding:5}}>
          Noticias
      </Text>
      <Divider />
    </View>
  );
};


class Headlines extends Component {
    state = { isLoading: false, text: [], size: { width, height },};
  
    componentDidMount() {
      this.setState({ isLoading: true });
      // Fetch sport text
      axios
        .get(imageUrl)
        .then(res => {
          
          //'data' field in the response has the text[]
          this.setState({text:res.data.Multimedias.slice(-3)});
          this.setState({ isLoading: false });

        })
        .catch(err => console.log(err));
    }
    render() {
      console.log(this.state.text);
      return (
        <View>
          {this.state.isLoading ? (
            <ActivityIndicator size="large" />
          ) : ( 
              <View style={styles.container,{padding:4,marginTop:10,marginBottom:15,backgroundColor:'white'}}>
                <FlatList
                data={this.state.text}
                renderItem={renderItem}
                keyExtractor={item => item.mid}
                ItemSeparatorComponent={()=><Divider />}
                ListHeaderComponent={Header}
                ListEmptyComponent={() => (
                   <Text> No hay nuevas noticias</Text>
                )}
                />
              </View>   
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
      
    },
    container: {
      flex: 1,
      backgroundColor:'white',
      marginBottom:10
    },

  });
  


export default Headlines
