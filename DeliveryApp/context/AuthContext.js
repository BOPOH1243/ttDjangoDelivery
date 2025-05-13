import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';
import { refreshTokenApi, loginApi } from '../api/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const loadAuth = async () => {
      const token = await AsyncStorage.getItem('access');
      if (token) setAuth({ access: token });
    };
    loadAuth();
  }, []);

  const login = async (username, password) => {
    const tokens = await loginApi(username, password);
    setAuth(tokens);
    await AsyncStorage.setItem('access', tokens.access);
    await AsyncStorage.setItem('refresh', tokens.refresh);
  };

  const logout = async () => {
    setAuth(null);
    await AsyncStorage.removeItem('access');
    await AsyncStorage.removeItem('refresh');
  };

  const refresh = async () => {
    try {
      const refreshToken = await AsyncStorage.getItem('refresh');
      const tokens = await refreshTokenApi(refreshToken);
      await AsyncStorage.setItem('access', tokens.access);
      setAuth({ access: tokens.access });
      return tokens.access;
    } catch {
      await logout();
      return null;
    }
  };

  const contextValue = {
    auth,
    login,
    logout,
    refresh,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
