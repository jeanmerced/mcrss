import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

const ArticleScreen = ({ route }) => {
  const { title, content } = route.params;
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
