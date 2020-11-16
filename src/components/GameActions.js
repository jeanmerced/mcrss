import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

// Action: single action render component
const Action = ({ action, name, number }) => (
  <View style={styles.action}>
    <Text style={styles.actionText}>{action}</Text>
    <Text style={styles.actionText}>
      #{number}. {name}
    </Text>
  </View>
);

// Game actions: list of actions for an event
const GameActions = ({ sport, gameActions, teamRosters }) => {
  // Function to render each action
  const renderItem = ({ item }) => {
    const actionType = item.action_type;
    // Get dictionary that has action type descriptions
    const sportDic = actionsDescriptions[sport];
    // Check if the action type is define in sport dictionary
    const actionDesc = sportDic.hasOwnProperty(actionType)
      ? sportDic[actionType]
      : 'Acción desconocida';
    // Get the roster corresponding to the team who performed the action
    const roster = teamRosters[item.team];
    let athleteName = '';
    let athleteNumber = '';
    // Check if athlete is in the roster
    if (roster.hasOwnProperty(`athlete-${item.athlete_id}`)) {
      const athlete = roster[`athlete-${item.athlete_id}`];
      athleteName =
        item.team == 'uprm'
          ? [athlete.first_name, athlete.middle_name, athlete.last_names]
              .filter(Boolean)
              .join(' ')
          : athlete.name;
      athleteNumber = athlete.number;
    } else {
      athleteName = 'Atleta desconocido';
      athleteNumber = '?';
    }
    return (
      <Action action={actionDesc} name={athleteName} number={athleteNumber} />
    );
  };

  return (
    <FlatList
      data={gameActions}
      keyExtractor={item => item.id.toString()}
      renderItem={renderItem}
      ItemSeparatorComponent={() => <View style={styles.divider} />}
      contentContainerStyle={{ flexGrow: 1 }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  divider: {
    borderColor: '#F6F6F6',
    borderWidth: 2,
  },
  action: {
    height: 70,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
  },
});

const actionsDescriptions = {
  Voleibol: {
    KillPoint: 'Punto de Ataque',
    AttackError: 'Error de Ataque',
    Assist: 'Asistencia',
    Ace: 'Servicio Directo',
    ServiceError: 'Error de Servicio',
    Dig: 'Recepción',
    Block: 'Bloqueo',
    BlockPoint: 'Punto de Bloqueo',
    BlockingError: 'Error de Bloqueo',
    ReceptionError: 'Error de Recepción',
  },
};
export default GameActions;
