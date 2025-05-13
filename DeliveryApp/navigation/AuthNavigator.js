import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';

const Stack = createNativeStackNavigator();
import { MD3DarkTheme as PaperDarkTheme, PaperProvider } from 'react-native-paper';
export default function AuthNavigator() {
  return (
    <PaperProvider theme={PaperDarkTheme}>
      <Stack.Navigator theme={{
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
        <Stack.Screen name="Login" component={LoginScreen} />
      </Stack.Navigator>
    </PaperProvider>
  );
}