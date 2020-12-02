import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import 'moment/locale/es';
import { locale_es } from '_locale';
import AppNavigator from '_navigation/AppNavigator';

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

const App = () => <AppNavigator />;

export default App;
