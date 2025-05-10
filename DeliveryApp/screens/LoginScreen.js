// 📄 src/screens/LoginScreen.js

import React, { useState, useContext } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';

const LoginScreen = () => {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <TextInput placeholder="Username" value={username} onChangeText={setUsername} style={styles.input} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <Button title="Login" onPress={() => login(username, password)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  input: { marginBottom: 12, borderWidth: 1, padding: 8 },
});

export default LoginScreen;
