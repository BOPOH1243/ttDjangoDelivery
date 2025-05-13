// src/theme/theme.js
import { DefaultTheme, DarkTheme } from '@react-navigation/native';

export const LightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#FFFFFF',
    card: '#F5F5F5',
    text: '#000000',
    primary: '#6200ee',
    border: '#CCCCCC',
    notification: '#FF4081',
  },
};

export const DarkThemeCustom = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#121212',
    card: '#1E1E1E',
    text: '#FFFFFF',
    primary: '#BB86FC',
    border: '#272727',
    notification: '#FF4081',
  },
};

export const theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#121212', // Тёмный фон
    surface: '#1E1E1E', // Тёмная поверхность
    text: '#FFFFFF', // Белый текст
  },
};
