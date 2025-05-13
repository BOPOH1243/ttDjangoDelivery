import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DeliveryListScreen from '../screens/DeliveryListScreen';
import DeliveryFormScreen from '../screens/DeliveryFormScreen';
import { MD3DarkTheme as PaperDarkTheme, PaperProvider } from 'react-native-paper';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <PaperProvider theme={{
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
        <Stack.Screen name="Deliveries" component={DeliveryListScreen} />
        <Stack.Screen name="DeliveryForm" component={DeliveryFormScreen} />
      </Stack.Navigator>
    </PaperProvider>
  );
}