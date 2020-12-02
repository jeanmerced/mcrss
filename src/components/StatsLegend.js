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
};
export default StatsLegend;
