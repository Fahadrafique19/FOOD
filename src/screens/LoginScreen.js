import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ToastAndroid,
  Platform,
} from 'react-native';
import { loginUser } from '../data/db';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../../App';
import { useDispatch } from 'react-redux';
import { login, setAdmin } from '../redux/slices/authSlice';

const LoginScreen = ({ navigation, route }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const { theme } = useContext(ThemeContext);
  const dispatch = useDispatch();

  const { redirectTo } = route.params || {};

  const showMessage = msg => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      console.log('Toast:', msg);
    }
  };

  const handleLogin = async () => {
  if (!email || !password) {
    showMessage('Please fill all fields');
    return;
  }

  try {
    const user = await loginUser(email, password);

    // Save login status in AsyncStorage
    await AsyncStorage.setItem('isLoggedIn', 'true');
    dispatch(login());

    if (user.isAdmin) {
      await AsyncStorage.setItem('isAdmin', 'true');
      dispatch(setAdmin(true));
      showMessage('Hello Admin');

      // No navigation.reset needed for admin
      // AppContent will automatically render AdminNavigator
    } else {
      await AsyncStorage.setItem('isAdmin', 'false');
      dispatch(setAdmin(false));
      showMessage(`Hello ${user.fullName}`);

      // Redirect for normal users
      if (redirectTo === 'CartScreen') {
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainTabs', params: { screen: 'Cart' } }],
        });
      } else if (redirectTo === 'SettingsScreen') {
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainTabs', params: { screen: 'Profile' } }],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainTabs' }],
        });
      }
    }
  } catch (error) {
    showMessage(error.message);
  }
};


  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme === 'light' ? '#F5F5F5' : '#121212' },
      ]}
    >
      <View style={styles.header}>
        <Image
          source={require('../assets/Cover.png')}
          style={styles.headerImage}
          resizeMode="cover"
        />
      </View>

      <View style={styles.socialContainer}>
        <TouchableOpacity
          style={[
            styles.socialButton,
            { backgroundColor: theme === 'light' ? '#fff' : '#1E1E1E' },
          ]}
        >
          <FontAwesome name="google" size={22} color="#DB4437" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.socialButton,
            { backgroundColor: theme === 'light' ? '#fff' : '#1E1E1E' },
          ]}
        >
          <FontAwesome name="facebook" size={22} color="#1877F2" />
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <Text style={{ color: theme === 'light' ? '#000' : '#fff' }}>
          Email
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme === 'light' ? '#fff' : '#1E1E1E',
              color: theme === 'light' ? '#000' : '#fff',
            },
          ]}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter email"
          placeholderTextColor={theme === 'light' ? '#666' : '#aaa'}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={{ color: theme === 'light' ? '#000' : '#fff' }}>
          Password
        </Text>
        <View
          style={[
            styles.passwordRow,
            { backgroundColor: theme === 'light' ? '#fff' : '#1E1E1E' },
          ]}
        >
          <TextInput
            style={{
              flex: 1,
              color: theme === 'light' ? '#000' : '#fff',
              height: 50,
            }}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!passwordVisible}
            placeholder="Enter password"
            placeholderTextColor={theme === 'light' ? '#666' : '#aaa'}
          />
          <TouchableOpacity
            onPress={() => setPasswordVisible(!passwordVisible)}
          >
            <FontAwesome
              name={passwordVisible ? 'eye' : 'eye-slash'}
              size={20}
              color={theme === 'light' ? '#666' : '#bbb'}
            />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.signInButton} onPress={handleLogin}>
        <Text style={{ fontWeight: '600' }}>Sign In</Text>
      </TouchableOpacity>

      <View style={styles.registerRow}>
        <Text style={{ color: theme === 'light' ? '#000' : '#fff' }}>
          Don’t have an account?{' '}
        </Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Register', { redirectTo: redirectTo || null })
          }
        >
          <Text style={{ fontWeight: '700', color: '#FFD600' }}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    height: 220,
    width: '100%',
    overflow: 'hidden',
    position: 'relative',
  },
  headerImage: { width: '100%', height: '100%', borderBottomRightRadius: 40 },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 50,
  },
  socialButton: {
    width: 60,
    height: 60,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  inputContainer: { marginHorizontal: 25, marginBottom: 15 },
  input: {
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    fontSize: 15,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 15,
    elevation: 2,
  },
  signInButton: {
    backgroundColor: '#FFD600',
    marginHorizontal: 25,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 15,
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
});

export default LoginScreen;
