import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, Alert, StyleSheet, TouchableOpacity, Platform, Modal } from 'react-native';
import { FAB, useTheme, } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from 'react-datetime-picker';
//import {DateTimePickerModal as DateTimePicker} from "react-native-modal-datetime-picker";
import api from '../api/axios';
import FilePicker from '../elements/FilePicker.web';

export default function DeliveryFormScreen({ route, navigation }) {
  const editing = route.params?.delivery;
  const theme = useTheme();

  const [transportModel, setTransportModel] = useState(editing?.transport_model || '');
  const [transportNumber, setTransportNumber] = useState(editing?.transport_number || '');
  const [departureTime, setDepartureTime] = useState(new Date(editing?.departure_time || Date.now()));
  const [arrivalTime, setArrivalTime] = useState(new Date(editing?.arrival_time || Date.now()));
  const [distanceKm, setDistanceKm] = useState(editing?.distance_km?.toString() || '');
  const [packaging, setPackaging] = useState(editing?.packaging || '');
  const [status, setStatus] = useState(editing?.status || '');
  const [cargoType, setCargoType] = useState(editing?.cargo_type || '');
  const [technicalState, setTechnicalState] = useState(editing?.technical_state || 'good');
  const [servicesSelected, setServicesSelected] = useState(editing?.services || []);

  const [showDepPicker, setShowDepPicker] = useState(false);
  const [showArrPicker, setShowArrPicker] = useState(false);

  const [transportModels, setTransportModels] = useState([]);
  const [packagings, setPackagings] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [cargoTypes, setCargoTypes] = useState([]);
  const [services, setServices] = useState([]);

  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tmRes, pkgRes, stRes, ctRes, srvRes] = await Promise.all([
          api.get('/transport-models/'),
          api.get('/packagings/'),
          api.get('/statuses/'),
          api.get('/cargo-types/'),
          api.get('/services/'),
        ]);
        setTransportModels(tmRes.data);
        setPackagings(pkgRes.data);
        setStatuses(stRes.data);
        setCargoTypes(ctRes.data);
        setServices(srvRes.data);
      } catch (error) {
        Alert.alert('Ошибка', 'Не удалось загрузить данные для формы.');
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    // Проверка обязательных полей
    if (!transportModel || !transportNumber || !departureTime || !arrivalTime || !distanceKm || !packaging || !status) {
      Alert.alert('Ошибка', 'Пожалуйста, заполните все обязательные поля.');
      return;
    }
  
    // Создаем FormData
    const formData = new FormData();
    formData.append('transport_model', transportModel);
    formData.append('transport_number', transportNumber);
    formData.append('departure_time', departureTime.toISOString());
    formData.append('arrival_time', arrivalTime.toISOString());
    formData.append('distance_km', distanceKm);
    formData.append('packaging', packaging);
    formData.append('status', status);
    if (cargoType) formData.append('cargo_type', cargoType);
    formData.append('technical_state', technicalState);
    servicesSelected.forEach(id => formData.append('services', id.toString()));
  
    // Если файл выбран, добавляем его
    if (selectedFile) {
      // Для React Native (Android/iOS) DocumentPicker:
      if (Platform.OS !== 'web') {
        // selectedFile: { uri, name, type }
        formData.append('media_file', {
          uri: selectedFile.uri,
          name: selectedFile.name,
          type: selectedFile.type || 'application/octet-stream',
        });
      } else {
        // Для Web selectedFile — это JS File object
        formData.append('media_file', selectedFile, selectedFile.name);
      }
    }
  
    try {
      const config = {
        headers: {
          //'Content-Type': 'multipart/form-data',
        },
      };
  
      if (editing) {
        await api.put(`/deliveries/${editing.id}/`, formData, config);
      } else {
        await api.post('/deliveries/', formData, config);
      }
  
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Ошибка', 'Не удалось сохранить доставку.');
    }
  };
  

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.label, { color: theme.colors.onBackground }]}>Модель транспорта *</Text>
      <Picker
        selectedValue={transportModel}
        onValueChange={setTransportModel}
        style={[styles.picker, { backgroundColor: theme.colors.surface, color: theme.colors.outline }]}
      >
        <Picker.Item label="Выберите модель" value="" />
        {transportModels.map((model) => (
          <Picker.Item key={model.id} label={model.name} value={model.id} />
        ))}
      </Picker>

      <Text style={[styles.label, { color: theme.colors.onBackground }]}>Номер транспорта *</Text>
      <TextInput
        value={transportNumber}
        onChangeText={setTransportNumber}
        style={[styles.input, { borderColor: theme.colors.outline, color: theme.colors.onSurface }]}
        placeholder="Введите номер"
        placeholderTextColor={theme.colors.placeholder}
      />

      <Text style={[styles.label, { color: theme.colors.onBackground }]}>Время отправки *</Text>
      <TouchableOpacity onPress={() => setShowDepPicker(true)}>
        <Text style={[styles.input, { color: theme.colors.outline }]}>{departureTime.toLocaleString()}</Text>
      </TouchableOpacity>
      {showDepPicker && (
        <Modal transparent={true} animationType="slide">
          <View style={{
            flex: 1,
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)'
          }}>
            <View style={{
              backgroundColor: theme.colors.background,
              padding: 20,
              borderRadius: 10,
              margin: 20
            }}>
              <DateTimePicker
                value={departureTime}
                mode="datetime"
                display="spinner"
                onChange={(_, date) => {
                  setShowDepPicker(false);
                  if (date) setDepartureTime(date);
                }}
                textColor={theme.dark ? 'white' : 'black'}
              />
              <TouchableOpacity
                onPress={() => setShowDepPicker(false)}
                style={{ padding: 10, alignItems: 'center' }}
              >
                <Text style={{ color: theme.colors.primary }}>Готово</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      <Text style={[styles.label, { color: theme.colors.outline }]}>Время доставки *</Text>
      <TouchableOpacity onPress={() => setShowArrPicker(true)}>
        <Text style={[styles.input, { color: theme.colors.primary }]}>{arrivalTime.toLocaleString()}</Text>
      </TouchableOpacity>
      {showArrPicker && (
        <Modal transparent={true} animationType="slide">
          <View style={{
            flex: 1,
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)'
          }}>
            <View style={{
              backgroundColor: theme.colors.background,
              padding: 20,
              borderRadius: 10,
              margin: 20
            }}>
              <DateTimePicker
                value={departureTime}
                mode="datetime"
                display="spinner"
                onChange={(_, date) => {
                  setShowArrPicker(false);
                  if (date) setArrivalTime(date);
                }}
                textColor={theme.dark ? 'white' : 'black'}
              />
              <TouchableOpacity
                onPress={() => setShowArrPicker(false)}
                style={{ padding: 10, alignItems: 'center' }}
              >
                <Text style={{ color: theme.colors.primary }}>Готово</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      <Text style={[styles.label, { color: theme.colors.onBackground }]}>Дистанция (км) *</Text>
      <TextInput
        value={distanceKm}
        onChangeText={setDistanceKm}
        keyboardType="numeric"
        style={[styles.input, { borderColor: theme.colors.outline, color: theme.colors.onSurface }]}
        placeholder="Введите дистанцию"
        placeholderTextColor={theme.colors.placeholder}
      />

      <Text style={[styles.label, { color: theme.colors.onBackground }]}>Упаковка *</Text>
      <Picker
        selectedValue={packaging}
        onValueChange={setPackaging}
        style={[styles.picker, { backgroundColor: theme.colors.surface, color: theme.colors.outline }]}
      >
        <Picker.Item label="Выберите упаковку" value="" />
        {packagings.map((pkg) => (
          <Picker.Item key={pkg.id} label={pkg.name} value={pkg.id} />
        ))}
      </Picker>

      <Text style={[styles.label, { color: theme.colors.onBackground }]}>Статус *</Text>
      <Picker
        selectedValue={status}
        onValueChange={setStatus}
        style={[styles.picker, { backgroundColor: theme.colors.surface, color: theme.colors.outline }]}
      >
        <Picker.Item label="Выберите статус" value="" />
        {statuses.map((st) => (
          <Picker.Item key={st.id} label={st.name} value={st.id} />
        ))}
      </Picker>

      <Text style={[styles.label, { color: theme.colors.onBackground }]}>Тип груза</Text>
      <Picker
        selectedValue={cargoType}
        onValueChange={setCargoType}
        style={[styles.picker, { backgroundColor: theme.colors.surface, color: theme.colors.outline }]}
      >
        <Picker.Item label="Выберите тип груза" value="" />
        {cargoTypes.map((ct) => (
          <Picker.Item key={ct.id} label={ct.name} value={ct.id} />
        ))}
      </Picker>

      <Text style={[styles.label, { color: theme.colors.onBackground }]}>Техническое состояние</Text>
      <Picker
        selectedValue={technicalState}
        onValueChange={setTechnicalState}
        style={[styles.picker, { backgroundColor: theme.colors.surface, color: theme.colors.outline }]}
      >
        <Picker.Item label="Исправно" value="good" />
        <Picker.Item label="Неисправно" value="bad" />
      </Picker>
      <Text style={[styles.label, { color: theme.colors.onBackground }]}>Прикрепить файл</Text>
      <FilePicker onFileSelected={setSelectedFile} />
      {selectedFile && (
        <Text style={{ marginTop: 8, color: theme.colors.primary }}>
          Выбран файл: {selectedFile.name}
        </Text>
      )}

      <Text style={[styles.label, { color: theme.colors.onBackground }]}>Услуги</Text>
      {services.map((srv) => (
        <View key={srv.id} style={styles.serviceRow}>
          <Text style={{ color: theme.colors.onBackground, fontSize: 20 }}>{srv.name}</Text>
          <FAB
            mode="text"
            icon={servicesSelected.includes(srv.id) ? 'minus' : 'plus'}
            onPress={() => {
              const updated = servicesSelected.includes(srv.id)
                ? servicesSelected.filter((id) => id !== srv.id)
                : [...servicesSelected, srv.id];
              setServicesSelected(updated);
            }}
            labelStyle={{ color: theme.colors.primary }}
          />
        </View>
      ))}

      <Button title={editing ? 'Обновить' : 'Создать'} onPress={handleSave} color={theme.colors.accent} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    textAlignVertical: 'center',
  },
  picker: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
});