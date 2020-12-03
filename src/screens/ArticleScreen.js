import React, { useLayoutEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Share } from 'react-native';
import { Entypo } from '@expo/vector-icons';

const shareUrl = 'https://huella-deportiva-web.ue.r.appspot.com/multimedios';

const ArticleScreen = ({ route, navigation }) => {
  const { title, content, postId } = route.params;
  console.log(postId);

  const onShare = async (msg, id) => {
    try {
      const result = await Share.share({
        message: `${msg}\n${shareUrl}/${id}`,
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
          onPress={() => onShare(title, postId)}
        />
      ),
    });
  }, [navigation]);
  return (
    <ScrollView>
      <View style={{ padding: 10, backgroundColor: 'white' }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 10 }}>
          {title}
        </Text>
        <Text style={{ textAlign: 'justify', fontSize: 17 }}>{content}</Text>
      </View>
    </ScrollView>
  );
};

export default ArticleScreen;
