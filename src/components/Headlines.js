import React, { Component } from 'react';
import {
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import { Text, Divider } from 'react-native-elements';
import axios from 'axios';

const imageUrl = 'https://white-smile-272204.ue.r.appspot.com/multimedia/text';

let { width, height } = Dimensions.get('window');

height = height / 4;

const renderItem = ({ item }) => {
  let title = item.title;
  let mid = item.mid;
  return (
    <View
      style={{ height: 40, justifyContent: 'center', paddingHorizontal: 5 }}
    >
      <TouchableOpacity>
        <Text>{title}</Text>
      </TouchableOpacity>
    </View>
  );
};

const Header = () => {
  //View to set in Header
  return (
    <View>
      <Text h4 style={{ marginBottom: 5 }}>
        Noticias
      </Text>
    </View>
  );
};

class Headlines extends Component {
  state = { isLoading: false, text: [], size: { width, height } };
  render() {
    return (
      <View
        style={{
          backgroundColor: 'white',
          paddingHorizontal: 10,
          paddingTop: 10,
          marginTop: 10,
          marginBottom: 15,
          backgroundColor: 'white',
        }}
      >
        {Header()}
        {this.props.news.map(article => (
          <View
            key={`article-${article.mid}`}
            style={{
              height: 45,
              justifyContent: 'center',
              borderTopWidth: 0.5,
              borderColor: 'gray',
            }}
          >
            <TouchableOpacity>
              <Text>{article.title}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
      // <View>
      //   {this.state.isLoading ? (
      //     <ActivityIndicator size="large" />
      //   ) : (
      //     <View
      //       style={
      //         (styles.container,
      //         {
      //           padding: 4,
      //           marginTop: 10,
      //           marginBottom: 15,
      //           backgroundColor: 'white',
      //         })
      //       }
      //     >
      //       <FlatList
      //         data={this.state.text}
      //         renderItem={renderItem}
      //         keyExtractor={item => item.mid}
      //         ItemSeparatorComponent={() => <Divider />}
      //         ListHeaderComponent={Header}
      //         ListEmptyComponent={() => <Text> No hay nuevas noticias</Text>}
      //       />
      //     </View>
      //   )}
      // </View>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    color: 'darkslateblue',
    fontSize: 30,
    textAlign: 'center',
  },
  shadow: {},
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginBottom: 10,
  },
});

export default Headlines;
