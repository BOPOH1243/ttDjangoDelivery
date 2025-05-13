import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import { Button, Card, List, Divider, useTheme, FAB } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import api from '../api/axios';
import { Badge } from 'react-native-paper';

export default function DeliveryListScreen() {
  const [deliveries, setDeliveries] = useState([]);
  const [statusMap, setStatusMap] = useState({});
  const navigation = useNavigation();
  const theme = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deliveriesResponse, statusesResponse] = await Promise.all([
          api.get('/deliveries/'),
          api.get('/statuses/'),
        ]);

        const statusMapping = {};
        statusesResponse.data.forEach(status => {
          statusMapping[status.id] = status.name;
        });

        setDeliveries(deliveriesResponse.data);
        setStatusMap(statusMapping);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
    };

    fetchData();
  }, []);

  const renderItem = ({ item }) => (
    <Card
      style={{
        marginVertical: 6,
        backgroundColor: theme.colors.surface,
      }}
      onPress={() => navigation.navigate('DeliveryForm', { delivery: item })}
    >
      <Card.Content>
        <List.Item
          title={`№ ${item.id} — ${item.transport_number}`}
          description={() => (
            <Badge
              style={{
                backgroundColor: 'green',
                color: 'white',
                borderRadius: 12,
                paddingHorizontal: 8,
                paddingVertical: 4,
                alignSelf: 'flex-start',
                fontSize: 15
              }}
            >
              {statusMap[item.status] || 'Неизвестно'}
            </Badge>
          )}
          titleStyle={{ color: theme.colors.onSurface }}
        />
      </Card.Content>
    </Card>
  );

  return (
    <View style={{ flex: 1, padding: 10, backgroundColor: theme.colors.background }}>
      <FlatList
        data={deliveries}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <Divider />}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <FAB
        icon="plus"
        style={{
          position: 'absolute',
          margin: 16,
          right: 10,
          bottom: 10,
          backgroundColor: theme.colors.accent,
        }}
        onPress={() => navigation.navigate('DeliveryForm')}
      />
    </View>
  );
}
