import React, { useMemo, useState, useEffect, useContext } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  StatusBar,
  FlatList,
  Image,
  Pressable,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  getMenuItems,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from '../data/menuService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../../App';

const { width } = Dimensions.get('window');
const CATEGORY_TABS = ['Best Seller', 'Veg', 'Non-Veg', 'Beverages'];

export default function MenuScreen({ navigation, route }) {
  const { isAdmin } = route.params || {};
  const { theme } = useContext(ThemeContext);

  const [activeTab, setActiveTab] = useState('Best Seller');
  const [items, setItems] = useState([]);

  useEffect(() => {
    loadItems();
    const unsubscribe = navigation.addListener('focus', loadItems);
    return unsubscribe;
  }, [navigation]);

  const loadItems = async () => {
    const data = await getMenuItems();
    setItems(data);
  };

  const handleAdd = async item => {
    await addMenuItem(item);
    loadItems();
  };
  const handleUpdate = async item => {
    await updateMenuItem(item);
    loadItems();
  };
  const handleDelete = async id => {
    await deleteMenuItem(id);
    loadItems();
  };

  const toggleSelect = async id => {
    const updated = items.map(it =>
      it.id === id ? { ...it, selected: !it.selected } : it,
    );
    setItems(updated);
    await AsyncStorage.setItem('menu_items_v1', JSON.stringify(updated));
  };

  const filteredData = useMemo(
    () =>
      activeTab === 'Best Seller'
        ? items
        : items.filter(i => i.category === activeTab),
    [activeTab, items],
  );
  const cartCount = useMemo(
    () => items.filter(i => i.selected).length,
    [items],
  );
  const cartTotal = useMemo(
    () => items.filter(i => i.selected).reduce((sum, it) => sum + it.price, 0),
    [items],
  );

  const openAddMenuScreen = (itemToEdit = null) => {
    navigation.navigate('AddMenuItemScreen', {
      mode: itemToEdit ? 'edit' : 'add',
      item: itemToEdit,
      onSave: itemToEdit ? handleUpdate : handleAdd,
    });
  };

  const styles = getStyles(theme);

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.card,
        { backgroundColor: theme === 'light' ? '#fff' : '#1E1E1E' },
      ]}
    >
      <View style={styles.imageWrap}>
        <Image source={{ uri: item.image }} style={styles.image} />
        {item.offer && (
          <View style={styles.discountPill}>
            <Text style={styles.discountText}>{item.offer}</Text>
          </View>
        )}
      </View>

      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text
          style={[
            styles.title,
            { color: theme === 'light' ? '#2A2A2A' : '#fff' },
          ]}
        >
          {item.title}
        </Text>
        <Text
          style={[
            styles.subtitle,
            { color: theme === 'light' ? '#909090' : '#ccc' },
          ]}
        >
          {item.subtitle || ' '}
        </Text>
        <Text
          style={[
            styles.price,
            { color: theme === 'light' ? '#2A2A2A' : '#fff' },
          ]}
        >
          ${item.price.toFixed(2)}
        </Text>

        {isAdmin && (
          <View style={{ flexDirection: 'row', marginTop: 8 }}>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: '#FF7A00' }]}
              onPress={() => openAddMenuScreen(item)}
            >
              <Ionicons name="create-outline" size={18} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.actionBtn,
                { backgroundColor: 'red', marginLeft: 8 },
              ]}
              onPress={() => handleDelete(item.id)}
            >
              <Ionicons name="trash-outline" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {!isAdmin && (
        <Pressable
          onPress={() => toggleSelect(item.id)}
          style={({ pressed }) => [
            styles.addBtn,
            pressed && { opacity: 0.7 },
            { marginRight: 12 },
          ]}
        >
          {item.selected ? (
            <Ionicons name="checkmark" size={22} color="green" />
          ) : (
            <Ionicons name="add" size={22} color="#909090" />
          )}
        </Pressable>
      )}
    </View>
  );

  return (
    <View
      style={[
        styles.safe,
        { backgroundColor: theme === 'light' ? '#F5F6F8' : '#121212' },
      ]}
    >
      <StatusBar
        barStyle={theme === 'light' ? 'dark-content' : 'light-content'}
      />

      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() =>
            navigation.canGoBack()
              ? navigation.goBack()
              : navigation.navigate('Home')
          }
        >
          <Ionicons
            name="chevron-back"
            size={22}
            color={theme === 'light' ? '#000' : '#fff'}
          />
        </TouchableOpacity>

        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text
            style={[
              styles.brand,
              { color: theme === 'light' ? '#909090' : '#ccc' },
            ]}
          >
            Westway
          </Text>
          <Text
            style={[
              styles.screenTitle,
              { color: theme === 'light' ? '#2A2A2A' : '#fff' },
            ]}
          >
            Menu
          </Text>
        </View>

        {isAdmin && (
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => openAddMenuScreen()}
          >
            <Ionicons name="add" size={20} color="#FF7A00" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.tabsRow}>
        {CATEGORY_TABS.map(tab => (
          <Pressable
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[
              styles.tab,
              {
                backgroundColor:
                  activeTab === tab
                    ? '#FF7A00'
                    : theme === 'light'
                    ? '#fff'
                    : '#333',
              },
            ]}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    activeTab === tab
                      ? '#fff'
                      : theme === 'light'
                      ? '#2A2A2A'
                      : '#fff',
                },
              ]}
            >
              {tab}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={filteredData}
        keyExtractor={it => it.id.toString()}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
        contentContainerStyle={{ padding: 16, paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      />

      {cartCount > 0 && !isAdmin && (
        <View style={[styles.cartBar, { backgroundColor: '#7ACB3F' }]}>
          <Text style={styles.cartItemsText}>{cartCount} Item</Text>
          <Pressable
            style={styles.viewCartBtn}
            onPress={() =>
              navigation.navigate('Cart', {
                screen: 'CartScreen',
                params: { cart: items.filter(i => i.selected) },
              })
            }
          >
            <Text style={styles.viewCartText}>View Cart</Text>
          </Pressable>

          <View style={styles.cartTotalPill}>
            <Text style={styles.cartTotalText}>${cartTotal.toFixed(2)}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const CARD_HEIGHT = 96;
const getStyles = theme =>
  StyleSheet.create({
    safe: { flex: 1 },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingTop: 50,
    },
    iconBtn: {
      width: 48,
      height: 48,
      borderRadius: 16,
      backgroundColor: theme === 'light' ? '#fff' : '#1E1E1E',
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 1,
    },
    brand: { fontSize: 22, fontWeight: '600' },
    screenTitle: { fontSize: 32, fontWeight: '700', marginTop: -4 },
    tabsRow: { flexDirection: 'row', paddingHorizontal: 16, marginTop: 12 },
    tab: {
      paddingVertical: 10,
      paddingHorizontal: 18,
      borderRadius: 14,
      marginRight: 8,
    },
    tabText: { fontWeight: '700' },
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 18,
      height: CARD_HEIGHT,
      marginBottom: 10,
    },
    imageWrap: {
      width: 136,
      height: '100%',
      marginRight: 12,
      overflow: 'hidden',
      position: 'relative',
    },
    image: { width: '100%', height: '100%', resizeMode: 'cover' },
    discountPill: {
      position: 'absolute',
      left: 12,
      bottom: 10,
      backgroundColor: '#FF7A00',
      borderRadius: 40,
      paddingHorizontal: 12,
      paddingVertical: 6,
    },
    discountText: { color: '#fff', fontWeight: '900' },
    title: { fontSize: 20, fontWeight: '800' },
    subtitle: { marginTop: 2 },
    price: { marginTop: 8, fontSize: 18, fontWeight: '800' },
    addBtn: {
      width: 36,
      height: 36,
      borderRadius: 12,
      backgroundColor: theme === 'light' ? '#fff' : '#1E1E1E',
      alignItems: 'center',
      justifyContent: 'center',
    },
    actionBtn: {
      padding: 8,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cartBar: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 18,
      paddingVertical: 12,
      borderRadius: 14,
    },
    cartItemsText: { color: '#fff', fontSize: 18, fontWeight: '800' },
    viewCartBtn: {
      backgroundColor: '#fff',
      borderRadius: 14,
      paddingHorizontal: 16,
      paddingVertical: 10,
    },
    viewCartText: { color: '#2A2A2A', fontWeight: '800', fontSize: 16 },
    cartTotalPill: {
      backgroundColor: 'rgba(255,255,255,0.25)',
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 14,
    },
    cartTotalText: { color: '#fff', fontWeight: '900' },
  });
