import React, { useState, useEffect, memo } from 'react';
import { Text, FlatList, StyleSheet, View } from 'react-native';
import { depth1 } from '_styles/elevations';

// Component to display a row on the team results
const TableRow = ({ statDescription, homeValue, awayValue }) => (
  <View style={styles.row}>
    <View style={styles.cell}>
      <Text style={styles.cellText}>{homeValue}</Text>
    </View>
    <View style={[styles.cell, { flex: 2 }]}>
      <Text style={styles.cellText}>{statDescription}</Text>
    </View>
    <View style={styles.cell}>
      <Text style={styles.cellText}>{awayValue}</Text>
    </View>
  </View>
);

const PBPTeamStats = ({
  sport,
  isLocal,
  uprmName,
  opponentName,
  gameActions,
}) => {
  const homeName = isLocal ? uprmName : opponentName;
  const awayName = !isLocal ? uprmName : opponentName;
  const [stats, setStats] = useState(() => ({ uprm: {}, opponent: {} }));
  useEffect(() => {
    const teamStats = {
      uprm: { ...sportsStats[sport] },
      opponent: { ...sportsStats[sport] },
    };
    gameActions.forEach(action => {
      if (sportsStats[sport].hasOwnProperty(action.action_type)) {
        teamStats[action.team][action.action_type]++;
        switch (action.action_type) {
          case 'BlockPoint':
            teamStats[action.team]['Block']++;
            break;
          case 'Goal':
            teamStats[action.team]['GoalAttempt']++;
            break;
          case 'RunBattedIn':
            teamStats[action.team]['Run']++;
            break;
          case 'Homerun':
            teamStats[action.team]['Run']++;
            teamStats[action.team]['Hit']++;
            teamStats[action.team]['RunBattedIn']++;
            break;

          default:
            break;
        }
      }
    });
    setStats({ ...teamStats });
  }, [gameActions]);

  const StatsHeader = () => (
    <View style={[styles.row, { backgroundColor: '#1B7744', height: 30 }]}>
      <View style={styles.cell}>
        <Text style={[styles.cellText, styles.headerText]}>{homeName}</Text>
      </View>
      <View style={[styles.cell, { flex: 2 }]}>
        <Text style={[styles.cellText, styles.headerText]}>Estadísticas</Text>
      </View>
      <View style={styles.cell}>
        <Text style={[styles.cellText, styles.headerText]}>{awayName}</Text>
      </View>
    </View>
  );

  const renderStats = ({ item }) => {
    // item is a key from the stats dictionary
    const statDescription = statsDescriptions[sport][item];
    let uprmValue = stats.uprm[item];
    let opponentValue = stats.opponent[item];
    // This applies to the game of basketball
    // For field goals, 3 pointers and freethrows, we want the percentage as well
    if (item == '2Points' || item == '3Points' || item == 'Freethrow') {
      const uprmAttempts = uprmValue + stats.uprm[`${item}Miss`];
      const oppAttempts = opponentValue + stats.opponent[`${item}Miss`];
      if (uprmAttempts != 0) {
        const uprmPercentage = ((uprmValue / uprmAttempts) * 100).toFixed(1);
        uprmValue = `${uprmValue}/${uprmAttempts} (${uprmPercentage}%)`;
      }
      if (oppAttempts != 0) {
        const oppPercentage = ((opponentValue / oppAttempts) * 100).toFixed(1);
        opponentValue = `(${oppPercentage}%) ${opponentValue}/${oppAttempts}`;
      }
    }
    let homeValue;
    let awayValue;

    if (isLocal) {
      homeValue = uprmValue;
      awayValue = opponentValue;
    } else {
      homeValue = opponentValue;
      awayValue = uprmValue;
    }
    return (
      <TableRow
        statDescription={statDescription}
        homeValue={homeValue}
        awayValue={awayValue}
      />
    );
  };

  // When rendering stats we want to show statistics that have their descriptions
  return (
    <FlatList
      data={Object.keys(statsDescriptions[sport])}
      style={depth1}
      keyExtractor={item => item.toString()}
      renderItem={renderStats}
      ItemSeparatorComponent={() => <View style={styles.divider} />}
      ListHeaderComponent={StatsHeader}
      ListEmptyComponent={() => <Text>No hay estadisticos de equipo</Text>}
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
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  cell: {
    flex: 1,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellText: {
    fontSize: 13,
  },
  headerText: {
    fontWeight: 'bold',
    color: 'white',
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
  Futbol: {
    Goal: 0,
    GoalAttempt: 0,
    Assist: 0,
    Tackle: 0,
    Foul: 0,
    YellowCard: 0,
    RedCard: 0,
  },
  Baloncesto: {
    '2Points': 0,
    '2PointsMiss': 0,
    '3Points': 0,
    '3PointsMiss': 0,
    Freethrow: 0,
    FreethrowMiss: 0,
    Assist: 0,
    Rebound: 0,
    Steals: 0,
    Blocks: 0,
    Turnover: 0,
    Foul: 0,
  },
  Beisbol: {
    AtBat: 0,
    Run: 0,
    Hit: 0,
    RunBattedIn: 0,
    BaseOnBall: 0,
    StrikeOut: 0,
    LeftOnBase: 0,
    Homerun: 0,
  },
  Softbol: {
    AtBat: 0,
    Run: 0,
    Hit: 0,
    RunBattedIn: 0,
    BaseOnBall: 0,
    StrikeOut: 0,
    LeftOnBase: 0,
    Homerun: 0,
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
  Futbol: {
    Goal: 'Goles',
    GoalAttempt: 'Tiros a portería',
    Assist: 'Asistencias',
    Tackle: 'Atajadas',
    Foul: 'Faltas',
    YellowCard: 'Tarjetas amarillas',
    RedCard: 'Tarjetas rojas',
  },
  Baloncesto: {
    '2Points': 'Tiros de campo',
    '3Points': 'Tiros de 3',
    Freethrow: 'Tiros libres',
    Assist: 'Asistencias',
    Rebound: 'Rebotes',
    Steals: 'Robos de balón',
    Blocks: 'Bloqueos',
    Turnover: 'Pérdidas de balón',
    Foul: 'Faltas',
  },
  Beisbol: {
    AtBat: 'Al Bate',
    Run: 'Carreras',
    Hit: 'Hits',
    RunBattedIn: 'Carreras empujadas',
    BaseOnBall: 'Base por bola',
    StrikeOut: 'Ponches',
    LeftOnBase: 'Dejado en base',
    Homerun: 'Cuadrangulares',
  },
  Softbol: {
    AtBat: 'Al Bate',
    Run: 'Carreras',
    Hit: 'Hits',
    RunBattedIn: 'Carreras empujadas',
    BaseOnBall: 'Base por bola',
    StrikeOut: 'Ponches',
    LeftOnBase: 'Dejado en base',
    Homerun: 'Cuadrangulares',
  },
};

export default memo(PBPTeamStats);
