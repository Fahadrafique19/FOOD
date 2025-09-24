import React, { useState, useContext } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Text,
  StatusBar,
  Image,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { ThemeContext } from '../../App';

const STORAGE_KEY = 'menu_items_v1';

export default function AddMenuItemScreen({ route, navigation }) {
  const { colors } = useContext(ThemeContext);
  const { mode, item } = route.params || {};

  const [title, setTitle] = useState(item?.title || '');
  const [subtitle, setSubtitle] = useState(item?.subtitle || '');
  const [price, setPrice] = useState(item?.price?.toString() || '');
  const [image, setImage] = useState(item?.image || '');
  const [category, setCategory] = useState(item?.category || 'Best Seller');
  const [offer, setOffer] = useState(item?.offer || '');

  const handleSave = async () => {
    try {
      const newItem = {
        id: item?.id || Date.now(),
        title,
        subtitle,
        price: parseFloat(price) || 0,
        image,
        category,
        offer,
      };

      const storedData = await AsyncStorage.getItem(STORAGE_KEY);
      let items = storedData ? JSON.parse(storedData) : [];

      if (mode === 'edit') {
        items = items.map(it => (it.id === newItem.id ? newItem : it));
      } else {
        items.push(newItem);
      }

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));

      Alert.alert('Success', mode === 'edit' ? 'Item Updated!' : 'Item Added!');
      navigation.goBack();
    } catch (error) {
      // console.log('Error saving item', error);
      Alert.alert('Error', 'Failed to save item.');
    }
  };

  const pickFromGallery = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.7 }, res => {
      if (!res.didCancel && !res.errorCode) {
        setImage(res.assets[0].uri);
      }
    });
  };

  return (
    <View style={[styles.safe, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={
          colors.background === '#fff' ? 'dark-content' : 'light-content'
        }
      />

      <View style={[styles.headerRow, { backgroundColor: colors.card }]}>
        <TouchableOpacity
          style={[styles.iconBtn, { backgroundColor: colors.inputBg }]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {mode === 'edit' ? 'Edit Item' : 'Add Item'}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.form}>
        <TextInput
          placeholder="Title"
          placeholderTextColor={colors.placeholder}
          value={title}
          onChangeText={setTitle}
          style={[
            styles.input,
            {
              backgroundColor: colors.card,
              color: colors.text,
              borderColor: colors.border,
            },
          ]}
        />
        <TextInput
          placeholder="Subtitle"
          placeholderTextColor={colors.placeholder}
          value={subtitle}
          onChangeText={setSubtitle}
          style={[
            styles.input,
            {
              backgroundColor: colors.card,
              color: colors.text,
              borderColor: colors.border,
            },
          ]}
        />
        <TextInput
          placeholder="Price"
          placeholderTextColor={colors.placeholder}
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          style={[
            styles.input,
            {
              backgroundColor: colors.card,
              color: colors.text,
              borderColor: colors.border,
            },
          ]}
        />

        {image ? (
          <Image source={{ uri: image }} style={styles.imagePreview} />
        ) : (
          <Text style={{ marginVertical: 10, color: colors.text }}>
            No image selected
          </Text>
        )}

        <TextInput
          placeholder="Or paste Image URL here"
          placeholderTextColor={colors.placeholder}
          value={image}
          onChangeText={setImage}
          style={[
            styles.input,
            {
              backgroundColor: colors.card,
              color: colors.text,
              borderColor: colors.border,
            },
          ]}
        />

        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.pickBtn, { backgroundColor: colors.card }]}
            onPress={pickFromGallery}
          >
            <Ionicons name="image-outline" size={20} color={colors.text} />
            <Text style={[styles.pickBtnText, { color: colors.text }]}>
              Gallery
            </Text>
          </TouchableOpacity>
        </View>

        <TextInput
          placeholder="Category (Best Seller / Veg / Non-Veg / Beverages)"
          placeholderTextColor={colors.placeholder}
          value={category}
          onChangeText={setCategory}
          style={[
            styles.input,
            {
              backgroundColor: colors.card,
              color: colors.text,
              borderColor: colors.border,
            },
          ]}
        />
        <TextInput
          placeholder="Offer (e.g. 20% OFF)"
          placeholderTextColor={colors.placeholder}
          value={offer}
          onChangeText={setOffer}
          style={[
            styles.input,
            {
              backgroundColor: colors.card,
              color: colors.text,
              borderColor: colors.border,
            },
          ]}
        />

        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: colors.primary }]}
          onPress={handleSave}
        >
          <Text style={styles.saveBtnText}>
            {mode === 'edit' ? 'Update Item' : 'Add Item'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
    elevation: 2,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
  },
  form: { padding: 20 },
  input: {
    borderWidth: 1,
    marginBottom: 14,
    padding: 12,
    borderRadius: 12,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  pickBtn: {
    flex: 1,
    marginHorizontal: 5,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  pickBtnText: { fontSize: 14, fontWeight: '600' },
  imagePreview: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 14,
  },
  saveBtn: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
