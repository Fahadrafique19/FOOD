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
import { registerUser } from '../data/db';
import { ThemeContext } from '../../App';

const RegisterScreen = ({ navigation, route }) => {
  const { colors } = useContext(ThemeContext);
  const { redirectTo } = route.params || {};

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const showMessage = (msg) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      console.log('Toast:', msg); // iOS fallback
    }
  };

  const handleRegister = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      showMessage('Please fill all fields');
      return;
    }
    if (password !== confirmPassword) {
      showMessage('Passwords do not match');
      return;
    }

    try {
      await registerUser(fullName, email, password);
      showMessage('User registered successfully!');

      if (redirectTo) {
        navigation.replace('Login', { redirectTo });
      } else {
        navigation.replace('Login');
      }
    } catch (error) {
      showMessage(error.message);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Image
          source={require('../assets/Cover.png')}
          style={styles.headerImage}
          resizeMode="cover"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={{ color: colors.text }}>Full Name</Text>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: colors.card, color: colors.text },
          ]}
          value={fullName}
          onChangeText={setFullName}
          placeholder="John Doe"
          placeholderTextColor={colors.muted}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={{ color: colors.text }}>Email</Text>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: colors.card, color: colors.text },
          ]}
          value={email}
          onChangeText={setEmail}
          placeholder="sample@email.com"
          keyboardType="email-address"
          placeholderTextColor={colors.muted}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={{ color: colors.text }}>Password</Text>
        <View style={[styles.passwordRow, { backgroundColor: colors.card }]}>
          <TextInput
            style={[styles.passwordInput, { color: colors.text }]}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!passwordVisible}
            placeholder="Enter password"
            placeholderTextColor={colors.muted}
          />
          <TouchableOpacity
            onPress={() => setPasswordVisible(!passwordVisible)}
          >
            <Text style={{ color: colors.text }}>
              {passwordVisible ? 'Hide' : 'Show'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={{ color: colors.text }}>Confirm Password</Text>
        <View style={[styles.passwordRow, { backgroundColor: colors.card }]}>
          <TextInput
            style={[styles.passwordInput, { color: colors.text }]}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!confirmPasswordVisible}
            placeholder="Confirm password"
            placeholderTextColor={colors.muted}
          />
          <TouchableOpacity
            onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
          >
            <Text style={{ color: colors.text }}>
              {confirmPasswordVisible ? 'Hide' : 'Show'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.registerButton, { backgroundColor: colors.primary }]}
        onPress={handleRegister}
      >
        <Text style={{ fontWeight: '700', color: '#fff' }}>Register</Text>
      </TouchableOpacity>

      <View style={styles.registerRow}>
        <Text style={{ color: colors.text }}>Already have an account? </Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Login', { redirectTo: redirectTo || null })
          }
        >
          <Text style={{ fontWeight: '700', color: colors.primary }}>
            Sign In
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { height: 220, width: '100%', overflow: 'hidden' },
  headerImage: { width: '100%', height: '100%', borderBottomRightRadius: 40 },
  inputContainer: { marginHorizontal: 25, marginBottom: 15 },
  input: { borderRadius: 12, paddingHorizontal: 15, height: 50, fontSize: 15 },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 15,
  },
  passwordInput: { flex: 1, height: 50, fontSize: 15 },
  registerButton: {
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

export default RegisterScreen;
