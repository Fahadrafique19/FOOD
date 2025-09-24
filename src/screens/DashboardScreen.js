import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ThemeContext } from '../../App';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';

const DashboardScreen = ({ navigation }) => {
  const { theme, toggleTheme, colors } = useContext(ThemeContext);
  const dispatch = useDispatch();
  const isAdmin = useSelector(state => state.auth.isAdmin);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: colors.text }]}>Dashboard</Text>
        <TouchableOpacity
          onPress={() => toggleTheme(theme === 'light' ? 'dark' : 'light')}
        >
          <Ionicons
            name={theme === 'light' ? 'moon' : 'sunny'}
            size={26}
            color="yellow"
          />
        </TouchableOpacity>
      </View>

      <Text style={[styles.subtitle, { color: colors.subtitle }]}>
        Welcome, {isAdmin ? 'Admin' : 'User'}
      </Text>

      <TouchableOpacity
        style={[styles.card, { backgroundColor: colors.card }]}
        onPress={() =>
          navigation.navigate('Home', { isAdmin: true, showBack: true })
        }
      >
        <Text style={[styles.cardText, { color: colors.text }]}>
          Manage Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.card, { backgroundColor: colors.card }]}
        onPress={() => navigation.navigate('MenuScreen', { isAdmin: true })}
      >
        <Text style={[styles.cardText, { color: colors.text }]}>
          Go to Menu
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.card, { backgroundColor: colors.card }]}
        onPress={() => navigation.navigate('UsersScreen', { isAdmin: true })}
      >
        <Text style={[styles.cardText, { color: colors.text }]}>
          Manage Users
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.logoutBtn, { backgroundColor: colors.accent }]}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: 'center' },
  headerRow: {
    width: '100%',
    marginTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { fontSize: 26, fontWeight: 'bold', paddingLeft: 120 },
  subtitle: { fontSize: 18, marginBottom: 20 },
  card: {
    width: '90%',
    padding: 20,
    borderRadius: 12,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
    alignItems: 'center',
  },
  cardText: { fontSize: 18 },
  logoutBtn: {
    marginTop: 30,
    padding: 15,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
  },
  logoutText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
