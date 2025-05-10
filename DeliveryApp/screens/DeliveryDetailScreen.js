// 📄 src/screens/DeliveryDetailScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import api from '../api/client';

const DeliveryDetailScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const [delivery, setDelivery] = useState(null);

  useEffect(() => {
    const fetchDelivery = async () => {
      try {
        const response = await api.get(`/api/deliveries/${id}/`);
        setDelivery(response.data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchDelivery();
  }, [id]);

  const deleteDelivery = async () => {
    try {
      await api.delete(`/api/deliveries/${id}/`);
      navigation.goBack();
    } catch (e) {
      console.error(e);
    }
  };

  if (!delivery) return null;

  return (
    <View>
      <Text>Transport Model: {delivery.transport_model}</Text>
      <Text>Transport Number: {delivery.transport_number}</Text>
      {/* Отобразите остальные поля доставки */}
      <Button title="Delete Delivery" onPress={deleteDelivery} />
    </View>
  );
};

export default DeliveryDetailScreen;
