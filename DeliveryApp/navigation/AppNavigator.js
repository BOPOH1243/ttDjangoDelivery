// 📄 src/navigation/AppNavigator.js

import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthContext } from '../contexts/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import DeliveryListScreen from '../screens/DeliveryListScreen';
import DeliveryFormScreen from '../screens/DeliveryFormScreen';
import DeliveryDetailScreen from '../screens/DeliveryDetailScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { userToken } = useContext(AuthContext);

  return (
    <Stack.Navigator>
      {userToken ? (
        <>
          <Stack.Screen name="Deliveries" component={DeliveryListScreen} />
          <Stack.Screen name="NewDelivery" component={DeliveryFormScreen} />
          <Stack.Screen name="DeliveryDetail" component={DeliveryDetailScreen} />
        </>
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
