import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Colors } from '_styles/';

const AthleteStats = ({ sport, gameActions, teamRosters }) => {
  const [stats, setStats] = useState({ uprm: {}, opponent: {} });

  useEffect(() => {
    /* 
    Get Rosters. A roster is an object where keys have other
    objects as values. The main key is athlete id and the value
    is athlete info.
    */
    const uprmAthletes = { ...teamRosters.uprm };
    const oppAthletes = { ...teamRosters.opponent };
    // Add Stats to every athlete
    Object.entries(uprmAthletes).forEach(([key, value]) => {
      // Merge athlete info with sport stats
      uprmAthletes[key] = { ...value, ...sportsStats[sport] };
    });
    Object.entries(oppAthletes).forEach(([key, value]) => {
      oppAthletes[key] = { ...value, ...sportsStats[sport] };
    });
    // Put in a single object for easier look up
    // All stats has 3 levels Rosters - Athletes - Stats
    const allStats = {
      uprm: { ...uprmAthletes },
      opponent: { ...oppAthletes },
    };
    gameActions.forEach(action => {
      if (sportsStats[sport].hasOwnProperty(action.action_type)) {
        const team = action.team;
        const athleteId = `athlete-${action.athlete_id}`;
        const actionType = action.action_type;
        // Check if athlete is in Roster
        if (allStats[team].hasOwnProperty(athleteId)) {
          allStats[team][athleteId][actionType]++;
          if (actionType == 'BlockPoint') {
            allStats[team][athleteId]['BlockPoint']++;
          }
        }
      }
    });
    setStats({ ...allStats });
  }, [gameActions, teamRosters]);

  const statsHeader = (
    <View style={styles.tableHeader}>
      {statsAbbreviation[sport].map(abbr => (
        <Text key={`h-${abbr}`} style={styles.headerText}>
          {abbr}
        </Text>
      ))}
    </View>
  );

  const playerHeader = (
    <View style={styles.tableHeader}>
      <Text style={styles.playerHeaderText}>Atleta</Text>
    </View>
  );

  const renderStats = (key, value) => (
    /* 
    To ensure the order in which stats columns are 
    placed, we use the sport dictionary. The dictionary
    keys are use on the value object to get the stats value.
    */
    <View key={key} style={styles.row}>
      {Object.keys(sportsStats[sport]).map(k => (
        <Text key={k} style={styles.col}>
          {value[k]}
        </Text>
      ))}
    </View>
  );

  const renderUprmAthlete = (key, value) => {
    const name = [value.first_name, value.middle_name, value.last_names]
      .filter(Boolean)
      .join(' ');
    return (
      <View key={`ath-${key}`} style={styles.playerCell}>
        <Text style={styles.playerText}>{name}</Text>
      </View>
    );
  };

  const renderTable = team => (
    /*
    renderTable will render individual stats for athletes
    for a specific team. First we interate through the roster
    with the map funcion where key is athlete id and in value
    we find the stats. For each intereation we call renderStats
    that takes care of rendering a row in the table
    */
    <View>
      {Object.entries(stats[team]).map(([key, value]) =>
        renderStats(key, value)
      )}
    </View>
  );

  const renderAthletes = team => (
    <View>
      {Object.entries(stats[team]).map(([key, value]) =>
        renderUprmAthlete(key, value)
      )}
    </View>
  );

  return (
    <ScrollView style={{ backgroundColor: '#fff' }}>
      <View style={styles.container}>
        <View style={{ flexDirection: 'column' }}>
          {playerHeader}
          {renderAthletes('uprm')}
        </View>
        <ScrollView horizontal>
          <View style={{ flexDirection: 'column' }}>
            {statsHeader}
            {renderTable('uprm')}
          </View>
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  playerHeaderText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'left',
    fontSize: 16,
    width: 120,
    marginLeft: 10,
  },
  playerCell: {
    flex: 1,
    height: 50,
    width: 120,
    justifyContent: 'center',
  },
  playerText: {
    flexWrap: 'wrap',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'left',
    marginLeft: 10,
  },
  tableHeader: {
    backgroundColor: Colors.headerBackground,
    flexDirection: 'row',
    height: 30,
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
    width: 40,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    height: 50,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  col: {
    textAlign: 'center',
    fontSize: 16,
    width: 40,
  },
  divider: {
    borderColor: '#F6F6F6',
    borderWidth: 2,
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

const statsAbbreviation = {
  Voleibol: [
    'K', // KillPoints
    'E', // AttackErrors
    'ACE', // Ace
    'SE', // Service Errors
    'AST', // Assists
    'DIG', // Digs
    'RE', // Reception Errors
    'BS', // Blocks
    'BP', // Block Points
    'BE', // Bloking Error
  ],
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

export default AthleteStats;
