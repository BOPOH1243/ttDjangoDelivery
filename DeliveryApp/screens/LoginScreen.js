import React, { useState, useContext } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { Button, useTheme, FAB } from 'react-native-paper';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.label, { color: theme.colors.onBackground }]}>Имя пользователя</Text>
      <TextInput
        value={username}
        onChangeText={setUsername}
        style={[styles.input, { borderColor: theme.colors.outline, color: theme.colors.onSurface }]}
        placeholder="Введите имя пользователя"
        placeholderTextColor={theme.colors.placeholder}
      />
      <Text style={[styles.label, { color: theme.colors.onBackground }]}>Пароль</Text>
      <TextInput
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={[styles.input, { borderColor: theme.colors.outline, color: theme.colors.onSurface }]}
        placeholder="Введите пароль"
        placeholderTextColor={theme.colors.placeholder}
      />
      <Button
        mode="contained"
        onPress={() => login(username, password)}
        style={[styles.button, { backgroundColor: theme.colors.accent }]}
        labelStyle={{ color: theme.colors.onAccent }}
      >
        Войти
      </Button>
      <FAB
        icon="account-plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => console.log('Регистрация')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
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
  },
  button: {
    marginBottom: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
