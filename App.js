import React, { useEffect, useState } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Toast from 'react-native-toast-message';

import { store } from './src/redux/store';
import { login, setAdmin, setRegistered } from './src/redux/slices/authSlice';
import { setTheme } from './src/redux/slices/themeSlice';

import AppNavigator from './src/navigation/AppNavigator';
import AdminNavigator from './src/navigation/AdminNavigator';

import { initDB } from './src/data/db';

export const ThemeContext = React.createContext();

const lightColors = {
  background: '#fff',
  text: '#000',
  card: '#fff',
  accent: '#f57c00',
  subtitle: '#666',
  addBtn: '#eee',
  primary: '#FFD600',
  muted: '#666',
  buttonText: '#000',
};
const darkColors = {
  background: '#121212',
  text: '#fff',
  card: '#1e1e1e',
  accent: '#f57c00',
  subtitle: '#aaa',
  addBtn: '#333',
  primary: '#FFD600',
  muted: '#aaa',
  buttonText: '#000',
};

function AppContent() {
  const dispatch = useDispatch();
  const { isLoggedIn, isAdmin } = useSelector(state => state.auth);
  const { theme } = useSelector(state => state.theme);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      try {
        await initDB();

        const loggedIn = await AsyncStorage.getItem('isLoggedIn');
        const admin = await AsyncStorage.getItem('isAdmin');
        const registered = await AsyncStorage.getItem('hasRegistered');
        const savedTheme = await AsyncStorage.getItem('appTheme');

        if (loggedIn === 'true') {
          dispatch(login());

          if (admin === 'true') {
            dispatch(setAdmin(true));
          } else {
            dispatch(setAdmin(false)); 
          }
        } else {
         
          dispatch(setAdmin(false));
        }

        if (registered === 'true') {
          dispatch(setRegistered(true));
        }

        if (savedTheme) {
          dispatch(setTheme(JSON.parse(savedTheme)));
        }
      } catch (err) {
        console.log('Initialization error:', err);

        Toast.show({
          type: 'error',
          text1: 'Initialization Error',
          text2: 'Failed to initialize database',
          position: 'bottom',
        });
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  const toggleThemeHandler = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    dispatch(setTheme(newTheme));
    await AsyncStorage.setItem('appTheme', JSON.stringify(newTheme));
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        colors: theme === 'light' ? lightColors : darkColors,
        toggleTheme: toggleThemeHandler,
      }}
    >
      <NavigationContainer theme={theme === 'light' ? DefaultTheme : DarkTheme}>
        {isLoggedIn ? (
          isAdmin ? <AdminNavigator /> : <AppNavigator />
        ) : (
          <AppNavigator /> 
        )}
      </NavigationContainer>
    </ThemeContext.Provider>
  );
}


export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
      <Toast />
    </Provider>
  );
}
