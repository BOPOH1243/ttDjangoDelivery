// 📄 src/contexts/AuthContext.js

import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/client';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);

  const login = async (username, password) => {
    try {
      const response = await api.post('/api/token/', { username, password });
      const { access, refresh } = response.data;
      await AsyncStorage.setItem('access', access);
      await AsyncStorage.setItem('refresh', refresh);
      setUserToken(access);
    } catch (e) {
      console.error(e);
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('access');
    await AsyncStorage.removeItem('refresh');
    setUserToken(null);
  };

  useEffect(() => {
    const loadToken = async () => {
      const token = await AsyncStorage.getItem('access');
      if (token) {
        setUserToken(token);
      }
    };
    loadToken();
  }, []);

  return (
    <AuthContext.Provider value={{ userToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
