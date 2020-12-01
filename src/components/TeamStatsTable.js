import React, { useState, useEffect, memo } from 'react';
import { Text, StyleSheet, View, FlatList } from 'react-native';
import { depth1 } from '_styles/elevations';
import { headerBackground } from '_styles/colors';

const isMedalBased = sport => {
  switch (sport) {
    case 'Atletismo':
    case 'Campo Traviesa':
    case 'Halterofilia':
    case 'Judo':
    case 'Lucha Olímpica':
    case 'Natación':
    case 'Taekwondo':
    case 'Baile':
    case 'Porrismo':
      return true;
    default:
      return false;
  }
};

const isMatchBased = sport => {
  switch (sport) {
    case 'Tenis de Campo':
    case 'Tenis de Mesa':
      return true;
    default:
      return false;
  }
};

const isPercentage = stat => {
  switch (stat) {
    case 'field_goal_percentage':
    case 'three_point_percentage':
    case 'free_throw_percentage':
      return true;
    default:
      return false;
  }
};

const getSportType = sport => {
  if (isMedalBased(sport)) {
    return 'MedalBased';
  } else if (isMatchBased(sport)) {
    return 'MatchBased';
  } else {
    return sport;
  }
};

const MatchBased = statistics => {
  const renderStatRow = ({ item }) => {
    const [key, value] = item;
    return (
      <View style={styles.row}>
        <Text>{key}</Text>
        <Text>{value['matches_played']}</Text>
        <Text>{value['matches_won']}</Text>
      </View>
    );
  };
  return (
    <FlatList
      data={Object.entries(statistics)}
      renderItem={renderStatRow}
      ItemSeparatorComponent={() => <View style={styles.divider} />}
    />
  );
};

const MedalBased = statistics => {
  const renderStatRow = ({ item }) => (
    <View style={styles.row}>
      <Text>{item.category_name}</Text>
      <Text>{item.type_of_medal}</Text>
      <Text>{item.medals_earned}</Text>
    </View>
  );
  return (
    <FlatList
      data={statistics}
      keyExtractor={(item, index) => `team-${index}`}
      ItemSeparatorComponent={() => <View style={styles.divider} />}
      renderItem={renderStatRow}
    />
  );
};

const MainSports = (sport, statistics) => {
  const Header = () => (
    <View
      style={{
        backgroundColor: headerBackground,
        height: 40,
        justifyContent: 'center',
        paddingLeft: 5,
      }}
    >
      <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
        Estadísticas
      </Text>
    </View>
  );
  const renderStatRow = ({ item }) => (
    <View style={styles.row}>
      <Text style={{ fontWeight: 'bold' }}>{item.desc}</Text>
      <Text>
        {statistics[item.stat]}
        <Text>{isPercentage(item.stat) ? '%' : ''}</Text>
      </Text>
    </View>
  );
  return (
    <FlatList
      style={depth1}
      data={sportStats[sport]}
      keyExtractor={item => item.stat.toString()}
      renderItem={renderStatRow}
      ItemSeparatorComponent={() => <View style={styles.divider} />}
      stickyHeaderIndices={[0]}
      ListHeaderComponent={Header}
    />
  );
};
const TeamStatsTable = ({ sport, teamStatistics }) => {
  const selectedSport = getSportType(sport);

  let renderTable;
  switch (selectedSport) {
    case 'MedalBased':
      renderTable = MedalBased(teamStatistics);
      break;
    case 'MatchBased':
      renderTable = MatchBased(teamStatistics);
      break;
    default:
      renderTable = MainSports(sport, teamStatistics);
      break;
  }
  return renderTable;
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
    justifyContent: 'space-between',
    paddingLeft: 5,
    paddingRight: 15,
    height: 40,
  },
});

const sportStats = {
  Voleibol: [
    { stat: 'kill_points', desc: 'Puntos de ataque' },
    { stat: 'attack_errors', desc: 'Errores de ataque' },
    { stat: 'aces', desc: 'Servicios directos' },
    { stat: 'service_errors', desc: 'Errores de servicio' },
    { stat: 'assists', desc: 'Asistencia' },
    { stat: 'digs', desc: 'Recepciones' },
    { stat: 'reception_errors', desc: 'Errores de recepción' },
    { stat: 'blocks', desc: 'Bloqueos' },
    { stat: 'blocking_points', desc: 'Puntos de bloqueo' },
    { stat: 'blocking_errors', desc: 'Errores de bloqueo' },
  ],
  Futbol: [
    { stat: 'successful_goals', desc: 'Goles' },
    { stat: 'goal_attempts', desc: 'Tiros a portería' },
    { stat: 'assists', desc: 'Asistencias' },
    { stat: 'tackles', desc: 'Atajadas' },
    { stat: 'fouls', desc: 'Faltas' },
    { stat: 'cards', desc: 'Tarjetas' },
  ],
  Baloncesto: [
    { stat: 'points', desc: 'Puntos anotados' }, // Points
    { stat: 'successful_field_goal', desc: 'Tiros de campo anotados' }, // 2Points
    { stat: 'field_goal_attempt', desc: 'Tiros de campo' }, // 2Points Attempt
    { stat: 'field_goal_percentage', desc: 'Porcentaje de tiro de campo' }, // Field Percentage (will take the place of 2PointsMiss)
    { stat: 'successful_three_point', desc: 'Tiros de 3 anotados' }, // 3Points
    { stat: 'three_point_attempt', desc: 'Tiros de 3' }, // 3Points Attempt
    { stat: 'three_point_percentage', desc: 'Porcentaje de tiro de 3' }, // 3Points Percentage (will take the place of 3PointsMiss)
    { stat: 'successful_free_throw', desc: 'Tiros libres anotados' }, // Freethrow
    { stat: 'free_throw_attempt', desc: 'Tiros libres' }, // Freethrow Attemp
    { stat: 'free_throw_percentage', desc: 'Porcentaje de tiro libre' }, // Freethrow Percentage (will take the place of FreethrowMiss)
    { stat: 'assists', desc: 'Asistencias' }, // Assist
    { stat: 'rebounds', desc: 'Rebotes' }, // Rebound
    { stat: 'steals', desc: 'Robos de balón' }, // Steals
    { stat: 'blocks', desc: 'Bloqueos' }, // Blocks
    { stat: 'turnovers', desc: 'Pérdida de balón' }, // Turnover
  ],
  Beisbol: [
    { stat: 'at_bats', desc: 'Al Bate' },
    { stat: 'runs', desc: 'Carreras' },
    { stat: 'hits', desc: 'Hits' },
    { stat: 'runs_batted_in', desc: 'Carreras empujadas' },
    { stat: 'base_on_balls', desc: 'Base por bola' },
    { stat: 'strikeouts', desc: 'Ponches' },
    { stat: 'left_on_base', desc: 'Dejado en base' },
  ],
  Softbol: [
    { stat: 'at_bats', desc: 'Al Bate' },
    { stat: 'runs', desc: 'Carreras' },
    { stat: 'hits', desc: 'Hits' },
    { stat: 'runs_batted_in', desc: 'Carreras empujadas' },
    { stat: 'base_on_balls', desc: 'Base por bola' },
    { stat: 'strikeouts', desc: 'Ponches' },
    { stat: 'left_on_base', desc: 'Dejado en base' },
  ],

  MedalBased: [
    { stat: 'category_name', desc: 'Categoría' },
    { stat: 'type_of_medal', desc: 'Categoría' },

    { stat: 'medal_earned', desc: 'Tipo de Medalla' },
  ],
  MatchBased: [
    { stat: 'category_name', desc: 'Categoría' },
    { stat: 'matches_played', desc: 'Partidas Jugadas' },
    { stat: 'matches_won', desc: 'Partidas Ganadas' },
  ],
};

export default TeamStatsTable;
