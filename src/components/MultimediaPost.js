import React, { useState, useEffect, memo } from 'react';
import moment from 'moment';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Avatar, Divider } from 'react-native-elements';
import YoutubePlayer from '_components/YoutubePlayer';
import { depth1 } from '_styles/elevations';

const MAX_CHAR = 477;

const screenHeight = Dimensions.get('window').height;

const hdAvatar =
  'https://scontent.fsig3-1.fna.fbcdn.net/v/t1.0-9/15032148_1168852516536914_8884572002414323563_n.jpg?_nc_cat=108&ccb=2&_nc_sid=85a577&_nc_ohc=vIb421K_uFAAX_FTP3v&_nc_ht=scontent.fsig3-1.fna&oh=34f0a31329c46d5fa1e98055a0d32d62&oe=5FE71829';

const MultimediaPost = ({
  title,
  publishedDate,
  content,
  type,
  navigation,
}) => {
  const [renderContent, setRenderContent] = useState();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    switch (type) {
      case 'image':
        setLoading(true);
        Image.getSize(content, (width, height) => {
          const ratio = width / height;
          setRenderContent(
            <View>
              <Image
                source={{ uri: content }}
                style={{ width: '100%', aspectRatio: ratio }}
                resizeMode={'contain'}
              />
              <Divider />
              <View
                style={{ marginHorizontal: 10, marginBottom: 10, marginTop: 5 }}
              >
                <Text style={{ textAlign: 'justify' }}>{title}</Text>
              </View>
            </View>
          );
          setLoading(false);
        });
        break;
      case 'text':
        const truncate = content.length > MAX_CHAR;
        // use msg to use manual truncate or you can use
        // numberOfLines={11} in <Text />
        // max is 477 and '... leer más' is 12 characters
        const msg = truncate
          ? content.substring(0, MAX_CHAR - 12) + '...'
          : content;
        const textPost = (
          <View
            style={{ marginHorizontal: 10, marginBottom: 10, marginTop: 5 }}
          >
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 5 }}>
              {title}
            </Text>
            <Text style={{ textAlign: 'justify', fontSize: 15 }}>
              {msg}
              {truncate ? (
                <Text style={{ fontSize: 15, color: 'gray' }}> leer más</Text>
              ) : null}
            </Text>
          </View>
        );
        setRenderContent(
          truncate ? (
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                navigation.navigate('Article', {
                  title,
                  content,
                });
              }}
            >
              {textPost}
            </TouchableOpacity>
          ) : (
            textPost
          )
        );
        break;
      case 'video':
        setRenderContent(
          <View>
            <YoutubePlayer videoLink={content} />
            <Divider />
            <View
              style={{ marginHorizontal: 10, marginBottom: 10, marginTop: 5 }}
            >
              <Text style={{ textAlign: 'justify' }}>{title}</Text>
            </View>
          </View>
        );

        break;
      default:
        break;
    }
  }, [type]);

  return (
    <View style={[styles.postContainer, depth1]}>
      <View style={styles.postHeader}>
        <Avatar
          rounded
          source={{ uri: hdAvatar }}
          containerStyle={{ marginHorizontal: 10 }}
        />
        <View>
          <Text style={{ fontSize: 12 }}>
            {moment(publishedDate).format('LL')}
          </Text>
          <Text style={{ fontSize: 12 }}>
            {moment(publishedDate).format('h:mm a')}
          </Text>
        </View>
      </View>
      <Divider />
      {loading ? (
        <ActivityIndicator style={{ aspectRatio: 1.77 }} />
      ) : (
        renderContent
      )}
    </View>
  );
};

export default memo(MultimediaPost);

const styles = StyleSheet.create({
  postContainer: {
    marginVertical: 5,
    backgroundColor: 'white',
  },
  postHeader: {
    flexDirection: 'row',
    height: 40,
    marginVertical: 5,
    alignItems: 'center',
  },
});
