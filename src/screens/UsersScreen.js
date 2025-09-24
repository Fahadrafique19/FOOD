import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../../App';

export default function UsersScreen({ navigation }) {
  const { colors } = useContext(ThemeContext);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const loadUsers = async () => {
      const storedUsers = await AsyncStorage.getItem('users');
      if (storedUsers) setUsers(JSON.parse(storedUsers));
    };
    const unsubscribe = navigation.addListener('focus', loadUsers);
    return unsubscribe;
  }, [navigation]);

  const handleDelete = index => {
    Alert.alert('Delete User', 'Are you sure you want to delete this user?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const updated = users.filter((_, i) => i !== index);
          setUsers(updated);
          await AsyncStorage.setItem('users', JSON.stringify(updated));
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity
        onPress={() => navigation.navigate('Dashboard')}
        style={{ marginBottom: 20 }}
      >
        <FontAwesome name="arrow-left" size={24} color={colors.text} />
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={[styles.heading, { color: colors.text }]}>Users</Text>
        <TouchableOpacity
          style={[
            styles.addButton,
            { backgroundColor: colors.buttonBackground || '#FFD600' },
          ]}
          onPress={() => navigation.navigate('UserFormScreen')}
        >
          <FontAwesome
            name="plus"
            size={20}
            color={colors.buttonText || '#fff'}
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={users}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View
            style={[
              styles.userItem,
              {
                borderColor: colors.border,
                backgroundColor: colors.cardBackground || colors.background,
              },
            ]}
          >
            <Text style={[styles.userName, { color: colors.text }]}>
              {item.first_name}
            </Text>
            <Text style={{ color: colors.text }}>
              {item.age ? `Age: ${item.age}` : ''}
            </Text>
            <Text style={{ color: colors.text }}>
              {item.gender ? `Gender: ${item.gender}` : ''}
            </Text>
            <Text style={{ color: colors.text }}>
              {item.country ? `Country: ${item.country}` : ''}
            </Text>
            <Text style={{ color: colors.text }}>
              {item.dob ? `DOB: ${new Date(item.dob).toDateString()}` : ''}
            </Text>
            <Text style={{ color: colors.text }}>
              {item.hobbies?.length
                ? `Hobbies: ${item.hobbies.join(', ')}`
                : ''}
            </Text>

            <View style={styles.actionRow}>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  { backgroundColor: colors.buttonBackground || '#FFD600' },
                ]}
                onPress={() =>
                  navigation.navigate('UserFormScreen', {
                    editUser: item,
                    index,
                  })
                }
              >
                <FontAwesome
                  name="pencil"
                  size={18}
                  color={colors.buttonText || '#fff'}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: 'red' }]}
                onPress={() => handleDelete(index)}
              >
                <FontAwesome name="trash" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text
            style={{ textAlign: 'center', marginTop: 50, color: colors.text }}
          >
            No users added yet.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, paddingTop: 60 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  heading: { fontSize: 24, fontWeight: '700' },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userItem: { padding: 15, borderWidth: 1, borderRadius: 12, marginBottom: 10 },
  userName: { fontWeight: '700', fontSize: 16 },
  actionRow: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'flex-end',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
});
