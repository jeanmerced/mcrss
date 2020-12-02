import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Card, Avatar } from 'react-native-elements';
import { depth1 } from '_styles/elevations';

const aboutusCaptainUrl =
  'https://white-smile-272204.ue.r.appspot.com/aboutus/captain';
const aboutusMembersUrl =
  'https://white-smile-272204.ue.r.appspot.com/aboutus/member';
const aboutusDescriptionUrl =
  'https://white-smile-272204.ue.r.appspot.com/aboutus/description';

const ABOUT_LINES = 6;

const About = () => {
  const [loading, setLoading] = useState(false);
  const [captain, setCaptain] = useState({});
  const [members, setMembers] = useState([]);
  const [lines, setLines] = useState(() => ABOUT_LINES);
  const [about, setAbout] = useState({});

  const toogleLine = () => {
    if (lines) {
      setLines(null);
    } else {
      setLines(ABOUT_LINES);
    }
  };

  useEffect(() => {
    const loadAbout = async () => {
      setLoading(true);
      const captain = await axios.get(aboutusCaptainUrl);
      const hdCaptain = captain.data.AboutUs[0];

      const members = await axios.get(aboutusMembersUrl);
      const hdMembers = members.data.AboutUs;

      const about = await axios.get(aboutusDescriptionUrl);
      const hdAbout = about.data.AboutUs[0];

      setLoading(false);
      setCaptain(hdCaptain);
      setMembers(hdMembers);
      setAbout(hdAbout);
    };
    loadAbout();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {loading ? (
        <ActivityIndicator
          style={{ alignSelf: 'center', marginTop: '50%' }}
          size="large"
        />
      ) : (
        <View>
          <View style={[styles.about, depth1]}>
            <View style={styles.aboutHeader}>
              <Text style={{ fontWeight: 'bold', fontSize: 22 }}>
                Sobre Nosotros
              </Text>
            </View>
            <View style={styles.aboutBody}>
              <TouchableOpacity activeOpacity={0.6} onPress={toogleLine}>
                <Text
                  style={{ fontSize: 16, textAlign: 'justify' }}
                  numberOfLines={lines}
                >
                  {about.title}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View>
            <Card>
              <Card.Title style={{ fontSize: 18 }}>
                {captain.hdmember}
              </Card.Title>

              <Avatar
                rounded
                size="xlarge"
                source={{ uri: captain.picture }}
                containerStyle={{ alignSelf: 'center' }}
              />

              <Text style={styles.cardText}>
                <Text style={{ fontWeight: 'bold' }}>Cargo: </Text>
                {captain.title}
              </Text>
              <Text style={styles.cardText}>
                <Text style={{ fontWeight: 'bold' }}>
                  Programa de estudio:{' '}
                </Text>
                {captain.major}
              </Text>
            </Card>
            {members.map(member => (
              <Card key={member.hdid.toString()}>
                <Card.Title style={{ fontSize: 18 }}>
                  {member.hdmember}
                </Card.Title>

                <Avatar
                  rounded
                  size="xlarge"
                  source={{ uri: member.picture }}
                  containerStyle={{ alignSelf: 'center' }}
                />

                <Text style={styles.cardText}>
                  <Text style={{ fontWeight: 'bold' }}>Cargo: </Text>
                  {member.title}
                </Text>
                <Text style={styles.cardText}>
                  <Text style={{ fontWeight: 'bold' }}>
                    Programa de estudio:{' '}
                  </Text>
                  {member.major}
                </Text>
              </Card>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default About;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  about: {
    backgroundColor: 'white',
    padding: 10,
  },
  cardText: { fontSize: 16, marginBottom: 5 },
  aboutHeader: { marginBottom: 10 },
  aboutBody: {},
});
