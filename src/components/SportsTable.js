import React, { Component } from 'react';
import {
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  ScrollView,
  View,
  Dimensions,
} from 'react-native';
import { Text, Divider } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';

import axios from 'axios';

const imageUrl = 'https://white-smile-272204.ue.r.appspot.com/sports';

let { width, height } = Dimensions.get('window');

class SportsTable extends Component {
  state = { isLoading: false, text: [], size: { width, height } };

  componentDidMount() {
    this.setState({ isLoading: true });
    // Fetch sport text
    axios
      .get(imageUrl)
      .then(res => {
        //'data' field in the response has the text[]
        this.setState({ text: res.data.SPORTS });
        this.setState({ isLoading: false });
      })
      .catch(err => console.log(err));
  }
  render() {
    const { navigation } = this.props;

    const renderItem = ({ item }) => {
      let title = item.sport_name;
      let branch = item.branch_name;
      let sid = item.sport_id;
      return (
        <ScrollView>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Sports Info', {
                title: title,
                sportId: sid,
                branch: branch,
              });
            }}
          >
            <View style={{ padding: 10, height: 50, justifyContent: 'center' }}>
              <Text style={{ fontSize: 13, fontWeight: 'bold' }}>
                {title.toLocaleUpperCase()} {branch.toLocaleUpperCase()}
              </Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      );
    };

    return (
      <View>
        {this.state.isLoading ? (
          <ActivityIndicator size="large" />
        ) : (
          <View style={{ backgroundColor: 'white' }}>
            <FlatList
              style={this.state.size}
              data={this.state.text}
              renderItem={renderItem}
              keyExtractor={item => item.sport_id}
              ItemSeparatorComponent={() => <Divider />}
              ListEmptyComponent={() => <Text> No hay nuevas noticias</Text>}
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
  shadow: {},
});

export default function (props) {
  const navigation = useNavigation();

  return <SportsTable {...props} navigation={navigation} />;
}
