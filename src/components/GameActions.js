import React, { useMemo } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { depth1 } from '_styles/elevations';

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
const Action = ({ action, name, number, teamName, teamColor }) => (
  <View style={styles.action}>
    <View style={[styles.square, { backgroundColor: teamColor }]} />
    <View sty>
      <Text style={styles.actionText}>
        [{teamName}]<Text style={{ fontWeight: 'bold' }}> {action}</Text>
      </Text>
      <Text style={styles.actionText}>
        #{number} {name}
      </Text>
    </View>
  </View>
);

// Game actions: list of actions for an event
const GameActions = ({
  sport,
  gameActions,
  teamRosters,
  uprmName,
  opponentName,
  opponentColor,
}) => {
  // Function to render each action
  const actionData = useMemo(() => {
    // Acciones no estan definidas para este deporte

    try {
      return gameActions.filter(action =>
        actionsDescriptions[sport].hasOwnProperty(action.action_type)
      );
    } catch (error) {
      console.log(
        `Game actions are no defined for the following sport: '${sport}'`
      );
    }
  }, [gameActions]);

  const renderItem = ({ item }) => {
    const actionDesc = getActionDescription(sport, item.action_type);
    const teamName = item.team == 'uprm' ? uprmName : opponentName;
    const teamColor = item.team == 'uprm' ? '#1B7744' : opponentColor;
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
        teamColor={teamColor}
      />
    );
  };

  return (
    <FlatList
      data={actionData}
      style={depth1}
      keyExtractor={item => item.id.toString()}
      renderItem={renderItem}
      ItemSeparatorComponent={() => <View style={styles.divider} />}
      contentContainerStyle={{ flexGrow: 1 }}
      ListEmptyComponent={() => (
        <View style={{ alignSelf: 'center', marginTop: '50%' }}>
          <Text style={{ fontSize: 18 }}>No hay informacíon de jugadas.</Text>
        </View>
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
    flexDirection: 'row',
    height: 50,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 14,
    textAlign: 'left',
  },
  square: {
    height: 15,
    width: 15,
    marginHorizontal: 10,
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
  Beisbol: {
    AtBat: 'Al Bate',
    Run: 'Carrera',
    Hit: 'Hit',
    RunBattedIn: 'Carrera empujada',
    BaseOnBall: 'Base por bola',
    StrikeOut: 'Ponche',
    LeftOnBase: 'Dejado en base',
    Homerun: 'Cuadrangular',
    Out: 'Out',
  },
  Softbol: {
    AtBat: 'Al Bate',
    Run: 'Carrera',
    Hit: 'Hit',
    RunBattedIn: 'Carrera empujada',
    BaseOnBall: 'Base por bola',
    StrikeOut: 'Ponche',
    LeftOnBase: 'Dejado en base',
    Homerun: 'Cuadrangular',
    Out: 'Out',
  },
};
export default GameActions;
