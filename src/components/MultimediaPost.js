import React, { useState, useEffect, memo, useLayoutEffect } from 'react';
import moment from 'moment';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Share,
} from 'react-native';
import { Avatar, Divider } from 'react-native-elements';
import YoutubePlayer from '_components/YoutubePlayer';
import FacebookPlayer from '_components/FacebookPlayer';
import { Entypo } from '@expo/vector-icons';
import { depth1 } from '_styles/elevations';

const MAX_CHAR = 477;

const shareUrl = 'https://huella-deportiva-web.ue.r.appspot.com/multimedios';

const hdAvatar =
  'https://scontent.fsig3-1.fna.fbcdn.net/v/t1.0-9/15032148_1168852516536914_8884572002414323563_n.jpg?_nc_cat=108&ccb=2&_nc_sid=85a577&_nc_ohc=vIb421K_uFAAX_FTP3v&_nc_ht=scontent.fsig3-1.fna&oh=34f0a31329c46d5fa1e98055a0d32d62&oe=5FE71829';

const MultimediaPost = ({
  postId,
  title,
  publishedDate,
  content,
  type,
  navigation,
}) => {
  const [renderContent, setRenderContent] = useState();
  const [loading, setLoading] = useState(false);

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

  // When components mounts check the content of the post to render accordingly
  useEffect(() => {
    switch (type) {
      case 'image':
        setLoading(true);
        // We use getSize to get height and width to calculate the ratio and make pictures keep their ratio
        Image.getSize(content, (width, height) => {
          const ratio = width / height;
          // Since Image posts can only have titles we placed the title below the image since with
          // 300 characters they could work like captions as well.
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
                <Text style={{ textAlign: 'justify', fontSize: 15 }}>
                  {title}
                </Text>
              </View>
            </View>
          );
          setLoading(false);
        });
        break;
      case 'text':
        // If the text need to be truncated the post will have a touchable 'read more'
        // and allow navigation to the article screen.
        const truncate = content.length > MAX_CHAR;
        // use msg to use manual truncate or you can use numberOfLines={11} in <Text />
        const msg = truncate
          ? content.substring(0, MAX_CHAR - 3) + '...'
          : content;
        const navToArticle = () =>
          navigation.navigate('Article', {
            title,
            content,
            postId,
          });

        setRenderContent(
          <View
            style={{ marginHorizontal: 10, marginBottom: 10, marginTop: 5 }}
          >
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 5 }}>
              {title}
            </Text>
            <Text style={{ textAlign: 'justify', fontSize: 15 }}>
              {msg}
              {truncate ? (
                <TouchableOpacity
                  onPress={navToArticle}
                  hitSlop={{ top: 20, right: 20, left: 20, bottom: 20 }}
                >
                  <Text style={{ fontSize: 15, color: 'gray' }}>leer más</Text>
                </TouchableOpacity>
              ) : null}
            </Text>
          </View>
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
              <Text style={{ textAlign: 'justify', fontSize: 15 }}>
                {title}
              </Text>
            </View>
          </View>
        );
        break;
      case 'livestream':
        setRenderContent(
          <View>
            <FacebookPlayer videoLink={content} />
            <Divider />
            <View
              style={{ marginHorizontal: 10, marginBottom: 10, marginTop: 5 }}
            >
              <Text style={{ textAlign: 'justify', fontSize: 15 }}>
                {title}
              </Text>
            </View>
          </View>
        );
      default:
        break;
    }
  }, []);

  return (
    <View style={[styles.postContainer, depth1]}>
      <View style={styles.postHeader}>
        <Avatar
          rounded
          source={{ uri: hdAvatar }}
          containerStyle={{ marginHorizontal: 10 }}
        />
        <View>
          <Text style={{ fontSize: 13 }}>
            {moment(publishedDate).utc(true).format('LL')}
          </Text>
          <Text style={{ fontSize: 13 }}>
            {moment(publishedDate).utc(true).format('h:mm a')}
          </Text>
        </View>
        <Entypo
          name="share-alternative"
          size={22}
          color="#1B7744"
          style={{ marginLeft: 'auto', marginRight: 15 }}
          onPress={() => onShare(title, postId)}
        />
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
