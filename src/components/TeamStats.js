import React, { useState, useEffect } from 'react';
import { useTeamRosters, useGameActions } from '_hooks';
import { SafeAreaView, Text, FlatList, StyleSheet, View } from 'react-native';

const TeamStats = ({ sport, gameActions }) => {
  const [stats, setStats] = useState({ uprm: {}, opponent: {} });

  useEffect(() => {
    const teamStats = {
      uprm: { ...sportsStats[sport] },
      opponent: { ...sportsStats[sport] },
    };
    gameActions.forEach(action => {
      if (sportsStats[sport].hasOwnProperty(action.action_type)) {
        teamStats[action.team][action.action_type]++;
        if (action.action_type == 'BlockPoint') {
          teamStats[action.team]['Block']++;
        }
      }
    });
    setStats({ ...teamStats });
  }, [gameActions]);

  const renderStats = ({ item }) => {
    const [key, value] = item;
    const statDesc = statsDescriptions[sport][key];
    return (
      <View style={styles.row}>
        <Text style={styles.rowText}>
          {statDesc} {value}
        </Text>
      </View>
    );
  };

  return (
    <FlatList
      data={Object.entries(stats.uprm)}
      keyExtractor={([key, value]) => `uprm-${key}`}
      renderItem={renderStats}
      ItemSeparatorComponent={() => <View style={styles.divider} />}
      contentContainerStyle={{ flexGrow: 1 }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  divider: {
    borderColor: '#F6F6F6',
    borderWidth: 2,
  },
  row: {
    height: 70,
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingLeft: 20,
  },
  rowText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
  },
});

const sportsStats = {
  Voleibol: {
    KillPoint: 0,
    AttackError: 0,
    Ace: 0,
    ServiceError: 0,
    Assist: 0,
    Dig: 0,
    ReceptionError: 0,
    Block: 0,
    BlockPoint: 0,
    BlockingError: 0,
  },
};

const statsDescriptions = {
  Voleibol: {
    KillPoint: 'Puntos de Ataque',
    AttackError: 'Errores de Ataque',
    Assist: 'Asistencia',
    Ace: 'Servicios Directos',
    ServiceError: 'Errores de Servicio',
    Dig: 'Recepciones',
    Block: 'Bloqueos',
    BlockPoint: 'Puntos de Bloqueo',
    BlockingError: 'Errores de Bloqueo',
    ReceptionError: 'Errores de Recepción',
  },
};

export default TeamStats;
