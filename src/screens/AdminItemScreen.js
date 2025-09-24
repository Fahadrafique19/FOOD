import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { ThemeContext } from '../../App';

const AdminItemScreen = ({ navigation, route }) => {
  const { item, onSave } = route.params || {};
  const { theme, colors } = useContext(ThemeContext);

  const [form, setForm] = useState({
    name: '',
    price: '',
    image: 'https://via.placeholder.com/300',
    discount: '',
    rating: '',
    time: '',
  });

  useEffect(() => {
    if (item) {
      setForm({
        name: item.name || '',
        price: item.price ? String(item.price) : '',
        image: item.image || 'https://via.placeholder.com/300',
        discount: item.discount || '',
        rating: item.rating ? String(item.rating) : '',
        time: item.time || '',
      });
    }
  }, [item]);

  const saveForm = () => {
    if (!form.name.trim()) {
      Alert.alert('Validation', 'Please enter a name.');
      return;
    }
    onSave({ ...item, ...form, price: form.price, rating: form.rating });
    navigation.goBack();
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <Text style={[styles.title, { color: colors.text }]}>
        {item ? 'Edit Item' : 'Add Item'}
      </Text>

      <Text style={[styles.label, { color: colors.text }]}>Name</Text>
      <TextInput
        style={[
          styles.input,
          { color: colors.text, borderColor: colors.border },
        ]}
        value={form.name}
        placeholder="Enter name"
        placeholderTextColor={colors.placeholder}
        onChangeText={t => setForm(s => ({ ...s, name: t }))}
      />

      <Text style={[styles.label, { color: colors.text }]}>Price</Text>
      <TextInput
        keyboardType="numeric"
        style={[
          styles.input,
          { color: colors.text, borderColor: colors.border },
        ]}
        value={form.price}
        placeholder="Enter price"
        placeholderTextColor={colors.placeholder}
        onChangeText={t => setForm(s => ({ ...s, price: t }))}
      />

      <Text style={[styles.label, { color: colors.text }]}>Image URL</Text>
      <TextInput
        style={[
          styles.input,
          { color: colors.text, borderColor: colors.border },
        ]}
        value={form.image}
        placeholder="Enter image URL"
        placeholderTextColor={colors.placeholder}
        onChangeText={t => setForm(s => ({ ...s, image: t }))}
      />

      <Text style={[styles.label, { color: colors.text }]}>Discount</Text>
      <TextInput
        style={[
          styles.input,
          { color: colors.text, borderColor: colors.border },
        ]}
        value={form.discount}
        placeholder="Enter discount"
        placeholderTextColor={colors.placeholder}
        onChangeText={t => setForm(s => ({ ...s, discount: t }))}
      />

      <Text style={[styles.label, { color: colors.text }]}>Rating</Text>
      <TextInput
        keyboardType="numeric"
        style={[
          styles.input,
          { color: colors.text, borderColor: colors.border },
        ]}
        value={form.rating}
        placeholder="Enter rating"
        placeholderTextColor={colors.placeholder}
        onChangeText={t => setForm(s => ({ ...s, rating: t }))}
      />

      <Text style={[styles.label, { color: colors.text }]}>Time</Text>
      <TextInput
        style={[
          styles.input,
          { color: colors.text, borderColor: colors.border },
        ]}
        value={form.time}
        placeholder="Enter time"
        placeholderTextColor={colors.placeholder}
        onChangeText={t => setForm(s => ({ ...s, time: t }))}
      />

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: colors.card }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={{ color: colors.text }}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, { backgroundColor: colors.primary }]}
          onPress={saveForm}
        >
          <Text style={{ color: '#fff', fontWeight: '700' }}>
            {item ? 'Save' : 'Add'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexGrow: 1,
    paddingTop: 60,
  },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  label: { fontSize: 13, fontWeight: '600', marginTop: 8 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    height: 44,
    marginTop: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  btn: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 8,
    minWidth: 110,
    alignItems: 'center',
  },
});

export default AdminItemScreen;
