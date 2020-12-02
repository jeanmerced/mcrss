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
      // add stats value to each team
      uprm: { ...statistics[sport] },
      opponent: { ...statistics[sport] },
    };
    gameActions.forEach(action => {
      if (statistics[sport].hasOwnProperty(action.action_type)) {
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

  const statsHeader = (
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

  const renderStats = item => {
    // Item is on value from a sport array in sportStats
    // it has description and the key (stat) to get the value from team
    const statDescription = item.desc;
    let uprmValue = stats.uprm[item.stat];
    let opponentValue = stats.opponent[item.stat];
    // This applies to the game of basketball
    // For field goals, 3 pointers and freethrows, we want the percentage as well
    // For basketball we want to show percentage for field goals, 3 pointers and free throws
    if (
      item.stat == '2Points' ||
      item.stat == '3Points' ||
      item.stat == 'Freethrow'
    ) {
      const uprmAttempts = uprmValue + stats.uprm[`${item.stat}Miss`];
      const oppAttempts = opponentValue + stats.opponent[`${item.stat}Miss`];
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
        key={`${item.stat}`}
        statDescription={statDescription}
        homeValue={homeValue}
        awayValue={awayValue}
      />
    );
  };
  // Can return a flat list as well, depending if you want to set scroll view on the parent page
  // <FlatList
  //   data={sportStats[sport]}
  //   style={depth1}
  //   keyExtractor={item => item.stat.toString()}
  //   renderItem={renderStats}
  //   ItemSeparatorComponent={() => <View style={styles.divider} />}
  //   ListHeaderComponent={StatsHeader}
  //   ListEmptyComponent={() => <Text>No hay estadisticos de equipo</Text>}
  //   stickyHeaderIndices={[0]}
  // />

  return (
    <View style={depth1}>
      {statsHeader}
      {sportStats[sport].map(item => renderStats(item))}
    </View>
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
    borderBottomColor: '#F6F6F6',
    borderBottomWidth: 1,
  },
  cell: {
    flex: 1,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellText: {
    fontSize: 14,
  },
  headerText: {
    fontWeight: 'bold',
    color: 'white',
  },
});

const statistics = {
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

const sportStats = {
  Voleibol: [
    { stat: 'KillPoint', desc: 'Puntos de Ataque' },
    { stat: 'AttackError', desc: 'Errores de Ataque' },
    { stat: 'Ace', desc: 'Servicios Directos' },
    { stat: 'ServiceError', desc: 'Errores de Servicio' },
    { stat: 'Assist', desc: 'Asistencia' },
    { stat: 'Dig', desc: 'Recepciones' },
    { stat: 'ReceptionError', desc: 'Errores de Recepción' },
    { stat: 'Block', desc: 'Bloqueos' },
    { stat: 'BlockPoint', desc: 'Puntos de Bloqueo' },
    { stat: 'BlockingError', desc: 'Errores de Bloqueo' },
  ],
  Futbol: [
    { stat: 'Goal', desc: 'Goles' },
    { stat: 'GoalAttempt', desc: 'Tiros a portería' },
    { stat: 'Assist', desc: 'Asistencias' },
    { stat: 'Tackle', desc: 'Atajadas' },
    { stat: 'Foul', desc: 'Faltas' },
    { stat: 'YellowCard', desc: 'Tarjetas amarillas' },
    { stat: 'RedCard', desc: 'Tarjetas rojas' },
  ],
  Baloncesto: [
    { stat: '2Points', desc: 'Tiros de campo' },
    { stat: '3Points', desc: 'Tiros de 3' },
    { stat: 'Freethrow', desc: 'Tiros libres' },
    { stat: 'Assist', desc: 'Asistencias' },
    { stat: 'Rebound', desc: 'Rebotes' },
    { stat: 'Steals', desc: 'Robos de balón' },
    { stat: 'Blocks', desc: 'Bloqueos' },
    { stat: 'Turnover', desc: 'Pérdidas de balón' },
    { stat: 'Foul', desc: 'Faltas' },
  ],
  Beisbol: [
    { stat: 'AtBat', desc: 'Al Bate' },
    { stat: 'Run', desc: 'Carreras' },
    { stat: 'Hit', desc: 'Hits' },
    { stat: 'RunBattedIn', desc: 'Carreras empujadas' },
    { stat: 'BaseOnBall', desc: 'Base por bola' },
    { stat: 'StrikeOut', desc: 'Ponches' },
    { stat: 'LeftOnBase', desc: 'Dejado en base' },
    { stat: 'Homerun', desc: 'Cuadrangulares' },
  ],
  Softbol: [
    { stat: 'AtBat', desc: 'Al Bate' },
    { stat: 'Run', desc: 'Carreras' },
    { stat: 'Hit', desc: 'Hits' },
    { stat: 'RunBattedIn', desc: 'Carreras empujadas' },
    { stat: 'BaseOnBall', desc: 'Base por bola' },
    { stat: 'StrikeOut', desc: 'Ponches' },
    { stat: 'LeftOnBase', desc: 'Dejado en base' },
    { stat: 'Homerun', desc: 'Cuadrangulares' },
  ],
};

export default memo(PBPTeamStats);
