import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import { MD3DarkTheme as PaperDarkTheme, PaperProvider } from 'react-native-paper';

export default function Navigation() {
  const { auth } = useContext(AuthContext);
  return (
    <PaperProvider >
      <NavigationContainer theme={{
        ...PaperDarkTheme, colors: {
          ...PaperDarkTheme.colors,
          primary: '#FF8066',
          background: '#2b2b2b',
          card: '#504747',
          text: '#ffffff',
          border: '#757575',
          notification: '#436195',
        }
      }}>
        {auth ? <AppNavigator /> : <AuthNavigator />}
      </NavigationContainer>
    </PaperProvider>
  );
}