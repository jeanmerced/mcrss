import React, { useState, useEffect, memo } from 'react';
import { Text, FlatList, StyleSheet, View } from 'react-native';

const TableRow = ({ statDescription, uprmValue, opponentValue }) => (
  <View style={styles.row}>
    <Text style={styles.col}>{uprmValue}</Text>
    <Text style={[styles.col, { width: '60%' }]}>{statDescription}</Text>
    <Text style={styles.col}>{opponentValue}</Text>
  </View>
);

const TeamStats = ({ sport, uprmName, opponentName, gameActions }) => {
  const [stats, setStats] = useState(() => ({ uprm: {}, opponent: {} }));
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

  const StatsHeader = () => (
    <View style={styles.row}>
      <Text style={[styles.col, { fontWeight: 'bold' }]}>{uprmName}</Text>
      <Text style={[styles.col, { width: '60%', fontWeight: 'bold' }]}>
        Estadísticas
      </Text>
      <Text style={[styles.col, { fontWeight: 'bold' }]}>{opponentName}</Text>
    </View>
  );

  const renderStats = ({ item }) => {
    // item is a key from the sport dictionary
    const statDescription = statsDescriptions[sport][item];
    const uprmValue = stats.uprm[item];
    const opponentValue = stats.opponent[item];
    return (
      <TableRow
        statDescription={statDescription}
        uprmValue={uprmValue}
        opponentValue={opponentValue}
      />
    );
  };

  return (
    <FlatList
      data={Object.keys(sportsStats[sport])}
      ListHeaderComponent={StatsHeader}
      keyExtractor={item => item.toString()}
      renderItem={renderStats}
      extraData={gameActions}
      ItemSeparatorComponent={() => <View style={styles.divider} />}
      ListEmptyComponent={() => <Text>No hay estadisticos de equipo</Text>}
      contentContainerStyle={{ flexGrow: 1 }}
      stickyHeaderIndices={[0]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  divider: {
    borderColor: '#F6F6F6',
    borderWidth: 0.5,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    height: 45,
    backgroundColor: '#fff',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  col: {
    textAlign: 'center',
    fontSize: 12,
    width: '20%',
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
