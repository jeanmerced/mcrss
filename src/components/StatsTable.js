import React, { useState, useEffect } from 'react';
import { useTeamRosters, useGameActions } from '_hooks';
import { SafeAreaView, Text, FlatList, StyleSheet, View } from 'react-native';

const StatsTable = ({ sport, gameActions }) => {
  const [stats, setStats] = useState({ uprm: {}, opponent: {} });

  useEffect(() => {
    const teamStats = {
      uprm: { ...sportsStatsDic[sport] },
      opponent: { ...sportsStatsDic[sport] },
    };
    gameActions.forEach(action => {
      teamStats[action.team][action.action_type] += 1;
      if (action.action_type == 'BlockPoint') {
        teamStats[action.team]['Block'] += 1;
      }
    });
    setStats({ ...teamStats });
  }, [gameActions]);

  const renderStats = () => (
    <View>
      <View style={{ margin: 10 }}>
        {Object.entries(stats.uprm).map(([key, value]) => (
          <Text key={`uprm-${key}`}>
            {key} - {value}
          </Text>
        ))}
      </View>
      <View style={{ margin: 10 }}>
        {Object.entries(stats.opponent).map(([key, value]) => (
          <Text key={`opponent-${key}`}>
            {key} - {value}
          </Text>
        ))}
      </View>
    </View>
  );

  return <SafeAreaView>{renderStats()}</SafeAreaView>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderBottomWidth: 0.5,
  },
  cell: {
    flex: 1,
    paddingHorizontal: 2,
    paddingVertical: 10,
  },
});

const sportsStatsDic = {
  Voleibol: {
    KillPoint: 0,
    AttackError: 0,
    Assist: 0,
    Ace: 0,
    ServiceError: 0,
    Dig: 0,
    Block: 0,
    BlockPoint: 0,
    BlockingError: 0,
    ReceptionError: 0,
  },
};

const volleyballStats = [
  {
    stat: 'K',
    desc: 'Puntos de Ataque',
  },
  {
    stat: 'E',
    desc: 'Errores de Ataque',
  },
  {
    stat: 'AST',
    desc: 'Asistencias',
  },
  {
    stat: 'ACE',
    desc: 'Puntos en servicio',
  },
  {
    stat: 'SE',
    desc: 'Errores de servicio',
  },
  {
    stat: 'DIG',
    desc: 'Digs',
  },
  {
    stat: 'BS',
    desc: 'Bloqueos',
  },
  {
    stat: 'BHE',
    desc: 'Errores de bloqueos',
  },
  {
    stat: 'RE',
    desc: 'Errores de defensa',
  },
];

export default StatsTable;
