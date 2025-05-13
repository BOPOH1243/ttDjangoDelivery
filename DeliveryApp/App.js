import React from 'react';
import { AuthProvider } from './context/AuthContext';
import Navigation from './navigation';
import { lightTheme, darkTheme, theme } from './theme/theme';
import { useColorScheme } from 'react-native';
import { MD3DarkTheme, PaperProvider, useTheme } from 'react-native-paper';

export default function App() {
  const theme = MD3DarkTheme
  return (
    <AuthProvider theme={theme}>
      <Navigation theme={theme} />
    </AuthProvider>
  );
}