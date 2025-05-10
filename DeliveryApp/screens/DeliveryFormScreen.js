//screens/DeliveryFormScreen.js
import React, { useState, useEffect } from 'react'
import {
  View, ScrollView, Text, TextInput, Button, TouchableOpacity, Platform
} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import * as DocumentPicker from 'expo-document-picker';
import api from '../api/client'
import { Picker } from '@react-native-picker/picker'
import { styles } from '../utils/theme'

export default function DeliveryFormScreen({ navigation }) {
  // Справочники
  const [models, setModels] = useState([])
  const [packings, setPackings] = useState([])
  const [services, setServices] = useState([])
  const [statuses, setStatuses] = useState([])
  const [cargoTypes, setCargoTypes] = useState([])

  // Поля формы
  const [transportModel, setTransportModel] = useState(null)
  const [transportNumber, setTransportNumber] = useState('')
  const [departureTime, setDepartureTime] = useState(new Date())
  const [arrivalTime, setArrivalTime] = useState(new Date())
  const [showDepPicker, setShowDepPicker] = useState(false)
  const [showArrPicker, setShowArrPicker] = useState(false)
  const [distanceKm, setDistanceKm] = useState('')
  const [selectedServices, setSelectedServices] = useState([])
  const [packaging, setPackaging] = useState(null)
  const [status, setStatus] = useState(null)
  const [cargoType, setCargoType] = useState(null)
  const [mediaFile, setMediaFile] = useState(null)

  // Загрузка справочников
  useEffect(() => {
    const loadRefs = async () => {
      const [m, p, s, st, c] = await Promise.all([
        api.get('/api/transport-models/'),
        api.get('/api/packagings/'),
        api.get('/api/services/'),
        api.get('/api/statuses/'),
        api.get('/api/cargo-types/'),
      ])
      setModels(m.data)
      setPackings(p.data)
      setServices(s.data)
      setStatuses(st.data)
      setCargoTypes(c.data)
    }
    loadRefs()
  }, [])

  // Файловый селектор
  const pickFile = async () => {
    const res = await DocumentPicker.pickSingle({ type: [DocumentPicker.types.allFiles] })
    setMediaFile(res)
  }

  // Отправка формы
  const createDelivery = async () => {
    const form = new FormData()
    form.append('transport_model', transportModel)
    form.append('transport_number', transportNumber)
    form.append('departure_time', departureTime.toISOString())
    form.append('arrival_time', arrivalTime.toISOString())
    form.append('distance_km', distanceKm)
    selectedServices.forEach(id => form.append('services', id))
    form.append('packaging', packaging)
    form.append('status', status)
    if (cargoType) form.append('cargo_type', cargoType)
    form.append('technical_state', 'good') // или 'bad'
    if (mediaFile) {
      form.append('media_file', {
        uri: mediaFile.uri,
        type: mediaFile.type,
        name: mediaFile.name
      })
    }

    try {
      await api.post('/api/deliveries/', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      navigation.goBack()
    } catch (err) {
      console.error(err.response?.data || err)
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text>Модель транспорта</Text>
      <Picker selectedValue={transportModel} onValueChange={setTransportModel}>
        <Picker.Item label="— выберите —" value={null} />
        {models.map(m => <Picker.Item key={m.id} label={m.name} value={m.id} />)}
      </Picker>

      <Text>Номер транспорта</Text>
      <TextInput value={transportNumber} onChangeText={setTransportNumber} style={styles.input} />

      <Text>Время отправки</Text>
      <TouchableOpacity onPress={() => setShowDepPicker(true)}>
        <Text style={styles.input}>{departureTime.toLocaleString()}</Text>
      </TouchableOpacity>
      {showDepPicker && (
        <DateTimePicker
          value={departureTime}
          mode="datetime"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(_, d) => {
            setShowDepPicker(false)
            if (d) setDepartureTime(d)
          }}
        />
      )}

      <Text>Время доставки</Text>
      <TouchableOpacity onPress={() => setShowArrPicker(true)}>
        <Text style={styles.input}>{arrivalTime.toLocaleString()}</Text>
      </TouchableOpacity>
      {showArrPicker && (
        <DateTimePicker
          value={arrivalTime}
          mode="datetime"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(_, d) => {
            setShowArrPicker(false)
            if (d) setArrivalTime(d)
          }}
        />
      )}

      <Text>Дистанция (км)</Text>
      <TextInput
        value={distanceKm}
        onChangeText={setDistanceKm}
        keyboardType="numeric"
        style={styles.input}
      />

      <Text>Услуги</Text>
      {services.map(sv => (
        <TouchableOpacity
          key={sv.id}
          onPress={() => {
            const idx = selectedServices.indexOf(sv.id)
            const next = idx >= 0
              ? selectedServices.filter(x => x !== sv.id)
              : [...selectedServices, sv.id]
            setSelectedServices(next)
          }}
        >
          <Text style={{
            padding: 8,
            backgroundColor: selectedServices.includes(sv.id) ? '#555' : '#222',
            marginVertical: 4,
          }}>
            {sv.name}
          </Text>
        </TouchableOpacity>
      ))}

      <Text>Упаковка</Text>
      <Picker selectedValue={packaging} onValueChange={setPackaging}>
        <Picker.Item label="— выберите —" value={null} />
        {packings.map(p => <Picker.Item key={p.id} label={p.name} value={p.id} />)}
      </Picker>

      <Text>Статус</Text>
      <Picker selectedValue={status} onValueChange={setStatus}>
        <Picker.Item label="— выберите —" value={null} />
        {statuses.map(st => <Picker.Item key={st.id} label={st.name} value={st.id} />)}
      </Picker>

      <Text>Тип груза (необяз.)</Text>
      <Picker selectedValue={cargoType} onValueChange={setCargoType}>
        <Picker.Item label="— нет —" value={null} />
        {cargoTypes.map(c => <Picker.Item key={c.id} label={c.name} value={c.id} />)}
      </Picker>

      <Button title="Выбрать файл" onPress={pickFile} />
      {mediaFile && <Text>Файл: {mediaFile.name}</Text>}

      <View style={{ marginTop: 20 }}>
        <Button title="Создать доставку" onPress={createDelivery} />
      </View>
    </ScrollView>
  )
}
