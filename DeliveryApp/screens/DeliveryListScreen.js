// 📄 src/screens/DeliveryListScreen.js

import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, Button, TouchableOpacity } from 'react-native';
import api from '../api/client';

const DeliveryListScreen = ({ navigation }) => {
  const [deliveries, setDeliveries] = useState([]);

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const response = await api.get('/api/deliveries/');
        setDeliveries(response.data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchDeliveries();
  }, []);

  return (
    <View>
      <Button title="New Delivery" onPress={() => navigation.navigate('NewDelivery')} />
      <FlatList
        data={deliveries}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('DeliveryDetail', { id: item.id })}>
            <Text>{item.transport_model} - {item.transport_number}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default DeliveryListScreen;
