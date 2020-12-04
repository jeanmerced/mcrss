import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text, Divider } from 'react-native-elements';

const Headlines = ({ navigation, news }) => {
  const header = (
    <View>
      <Text h4 style={{ marginBottom: 5 }}>
        Noticias
      </Text>
    </View>
  );

  const navToArticle = (title, content, postId) =>
    navigation.navigate('Article', {
      title,
      content,
      postId,
    });
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
      {header}
      {news.map(article => (
        <View
          key={`article-${article.mid}`}
          style={{
            height: 45,
            justifyContent: 'center',
            borderTopWidth: 0.5,
            borderColor: 'gray',
          }}
        >
          <TouchableOpacity
            onPress={() =>
              navToArticle(article.title, article.content, article.mid)
            }
            activeOpacity={0.5}
          >
            <Text>{article.title}</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

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
