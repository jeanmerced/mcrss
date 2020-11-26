import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const getActionDescription = (sport, actionType) => {
  const sportDictionary = actionsDescriptions[sport];
  if (sportDictionary.hasOwnProperty(actionType))
    return sportDictionary[actionType];
  else return 'Acción desconocida';
};

//
const getAthleteInfo = (rosters, team, athleteId) => {
  const teamRoster = rosters[team];
  let athleteName = '';
  let athleteNumber = '';
  if (teamRoster?.hasOwnProperty(`athlete-${athleteId}`)) {
    const athlete = teamRoster[`athlete-${athleteId}`];
    athleteName =
      team == 'uprm'
        ? [athlete.first_name, athlete.middle_name, athlete.last_names]
            .filter(Boolean)
            .join(' ')
        : athlete.name;
    athleteNumber = athlete.number;
  } else {
    athleteName = 'Atleta desconocido';
    athleteNumber = '?';
  }
  return { athleteName, athleteNumber };
};

// Action: single action render component
const Action = ({ action, name, number, teamName }) => (
  <View style={styles.action}>
    <Text style={styles.actionText}>
      [{teamName}]<Text style={{ fontWeight: 'bold' }}> {action}</Text>
    </Text>
    <Text style={styles.actionText}>
      #{number} {name}
    </Text>
  </View>
);

// Game actions: list of actions for an event
const GameActions = ({
  sport,
  gameActions,
  teamRosters,
  uprmName,
  opponentName,
}) => {
  // Function to render each action
  const actionData = useMemo(() => {
    return gameActions.filter(action =>
      actionsDescriptions[sport].hasOwnProperty(action.action_type)
    );
  }, [gameActions]);

  const renderItem = ({ item }) => {
    const actionDesc = getActionDescription(sport, item.action_type);
    const teamName = item.team == 'uprm' ? uprmName : opponentName;
    const { athleteName, athleteNumber } = getAthleteInfo(
      teamRosters,
      item.team,
      item.athlete_id
    );
    return (
      <Action
        action={actionDesc}
        name={athleteName}
        number={athleteNumber}
        teamName={teamName}
      />
    );
  };

  return (
    <FlatList
      data={actionData}
      keyExtractor={item => item.id.toString()}
      renderItem={renderItem}
      ItemSeparatorComponent={() => <View style={styles.divider} />}
      contentContainerStyle={{ flexGrow: 1 }}
      ListEmptyComponent={() => (
        <Text>No hay acciones de juego disponibles</Text>
      )}
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
    borderWidth: 0.5,
  },
  action: {
    height: 45,
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingLeft: 10,
  },
  actionText: {
    fontSize: 13,
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
  Futbol: {
    Goal: 'Gol',
    GoalAttempt: 'Tiro a portería',
    Assist: 'Asistencia',
    Tackle: 'Atajada',
    Foul: 'Falta',
    YellowCard: 'Tarjeta amarilla',
    RedCard: 'Tarjeta roja',
  },
  Baloncesto: {
    '2Points': 'Tiro de campo anotado',
    '3Points': 'Tiro de 3 anotado',
    Freethrow: 'Tiro libre anotado',
    Assist: 'Asistencia',
    Rebound: 'Rebote',
    Steals: 'Robo de balón',
    Blocks: 'Bloqueo',
    Turnover: 'Pérdida de balón',
    Foul: 'Falta',
  },
};
export default GameActions;
