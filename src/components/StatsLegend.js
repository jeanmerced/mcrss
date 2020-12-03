import React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { depth1 } from '_styles/colors';

const StatsLegend = ({ sport }) => {
  const renderItem = ({ item }) => (
    <View style={{ width: 200, marginBottom: 2 }}>
      <Text style={{ fontSize: 9 }}>{item}</Text>
    </View>
  );
  return (
    <View
      style={[
        {
          padding: 5,
          backgroundColor: 'white',
          borderTopWidth: 0.5,
          borderColor: 'gray',
        },
        depth1,
      ]}
    >
      <FlatList
        scrollEnabled={false}
        data={statsDescriptions[sport]}
        keyExtractor={item => `stat-${item}`}
        numColumns={2}
        renderItem={renderItem}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
      />
    </View>
  );
};
const statsDescriptions = {
  Voleibol: [
    'K - Puntos de Ataque',
    'E - Errores de Ataque',
    'ACE - Servicios Directos',
    'AST - Asistencias',
    'SE - Errores de Servicio',
    'DIG - Recepciones',
    'RE - Errores de Recepción',
    'BS - Bloqueos',
    'BP - Puntos de Bloqueo',
    'BE - Errores de Bloqueo',
  ],
  Futbol: [
    'G - Goles',
    'SH - Tiros a portería',
    'A - Asistencias',
    'S - Atajadas',
    'F - Faltas',
    'YC - Tarjetas amarillas',
    'RC - Tarjetas rojas',
  ],
  Baloncesto: [
    'PTS - Puntos anotados',
    'FGM - Tiros de campo anotados',
    'FGA - Tiros de campo',
    'FG% - Porcentaje de tiro de campo',
    '3PM - Tiros de 3 anotados',
    '3PA - Tiros de 3',
    '3P% - Porcentaje de tiro de 3',
    'FTM - Tiros libres anotados',
    'FTA - Tiros libres',
    'FT% - Porcentaje de tiro libre',
    'REB - Rebotes',
    'STL - Robos de balón',
    'BLK - Bloqueos',
    'TOV - Pérdida de balón',
    'PF - Falta',
  ],
  Beisbol: [
    'AB - Al Bate',
    'R - Carreras',
    'H - Hits',
    'RBI - Carreras empujadas',
    'BB - Base por bola',
    'SO - Ponches',
    'LOB - Dejado en base',
    'HR - Cuadrangulares',
  ],
  Softbol: [
    'AB - Al Bate',
    'R - Carreras',
    'H - Hits',
    'RBI - Carreras empujadas',
    'BB - Base por bola',
    'SO - Ponches',
    'LOB - Dejado en base',
    'HR - Cuadrangulares',
  ],
};
export default StatsLegend;
