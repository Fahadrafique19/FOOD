import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ImageBackground,
  Alert,
  Platform,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../../App';

const ADMIN_ITEMS_KEY = 'admin_items_v1';

const HomeScreen = ({ navigation, isAdmin, showBack }) => {
  const { theme } = useContext(ThemeContext);
  const [search, setSearch] = useState('');
  const [adminItems, setAdminItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({
    name: '',
    price: '',
    image: 'https://via.placeholder.com/300',
    discount: '',
    rating: '',
    time: '',
  });

  const nearestRestaurants = [
    {
      id: 1,
      name: 'Pizza Place',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJi88a-9Ke2AHALSOaV6fa3ZnueU2zsxCRlg&s',
      discount: '10% off',
      rating: 4.5,
      time: '15-20 min',
    },
    {
      id: 2,
      name: 'Sushi Bar',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRddXcUETc2t4JBDptaPMGOJROAIC2XX2Phew&s',
      discount: '15% off',
      rating: 4.8,
      time: '20-25 min',
    },
    {
      id: 3,
      name: 'Coffee House',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnDL__fpdiU2MVm_g4thEXqtkIqDDf4YBSgQ&s',
      discount: '5% off',
      rating: 4.2,
      time: '10-15 min',
    },
    {
      id: 4,
      name: 'Burger House',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmKFDuZ4YnrZ-FUv7qjNjYV1smSuFeZ4CMuA&s',
      discount: '12% off',
      rating: 4.6,
      time: '15-20 min',
    },
    {
      id: 5,
      name: 'Taco Spot',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4pSExMTWup4nfXqdI5V9_OC99-eonB4N6-g&s',
      discount: '8% off',
      rating: 4.4,
      time: '10-15 min',
    },
  ];

  const popularRestaurants = [
    {
      id: 1,
      name: 'Italian Delight',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBLbRXP0NepN8iexGjAzHZQSJAReL28KHkNA&s',
      discount: '20% off',
      rating: 4.9,
      time: '25-30 min',
    },
    {
      id: 2,
      name: 'Veggie Garden',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBLbRXP0NepN8iexGjAzHZQSJAReL28KHkNA&s',
      discount: '10% off',
      rating: 4.7,
      time: '15-20 min',
    },
    {
      id: 3,
      name: 'Steak House',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlbCCBn_zUd50ZX3jFDn9TJDhU9yR4eZZqRg&s',
      discount: '15% off',
      rating: 4.8,
      time: '30-35 min',
    },
    {
      id: 4,
      name: 'Seafood Shack',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGFYRAPCgug3DtC6Y_xMMrj1HXnx4BstZNlQ&s',
      discount: '12% off',
      rating: 4.6,
      time: '20-25 min',
    },
    {
      id: 5,
      name: 'Dessert Hub',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-WKIMZrrVxfUYGQ1gDhPwyq50W0YZDV6qBA&s',
      discount: '5% off',
      rating: 4.5,
      time: '10-15 min',
    },
  ];

  const filterData = data =>
    data.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => {
    loadAdminItems();
  }, []);

  const loadAdminItems = async () => {
    try {
      const json = await AsyncStorage.getItem(ADMIN_ITEMS_KEY);
      if (json) setAdminItems(JSON.parse(json));
    } catch (e) {
      console.log('loadAdminItems error:', e);
    }
  };

  const persistAdminItems = async items => {
    try {
      await AsyncStorage.setItem(ADMIN_ITEMS_KEY, JSON.stringify(items));
      setAdminItems(items);
    } catch (e) {
      console.log('persistAdminItems error:', e);
    }
  };

  const openAddScreen = () => {
    navigation.navigate('AdminItemScreen', { onSave: handleSaveItem });
  };

  const openEditScreen = item => {
    navigation.navigate('AdminItemScreen', { item, onSave: handleSaveItem });
  };

  const handleSaveItem = (form, editingItem) => {
    if (editingItem) {
      const updated = adminItems.map(it =>
        it.id === editingItem.id ? { ...it, ...form } : it,
      );
      persistAdminItems(updated);
    } else {
      const newItem = { id: Date.now(), ...form };
      persistAdminItems([newItem, ...adminItems]);
    }
  };

  const confirmDelete = id => {
    Alert.alert('Delete item', 'Are you sure you want to delete this item?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          const updated = adminItems.filter(i => i.id !== id);
          persistAdminItems(updated);
        },
      },
    ]);
  };

  const renderCard = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: theme === 'light' ? '#fff' : '#1E1E1E' },
      ]}
      onPress={() =>
        navigation.navigate('RestaurantDetail', { restaurant: item })
      }
      activeOpacity={0.9}
    >
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      {item.discount && (
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>{item.discount}</Text>
        </View>
      )}
      {isAdmin && (
        <View
          style={[
            styles.adminActions,
            {
              backgroundColor:
                theme === 'light'
                  ? 'rgba(255,255,255,0.9)'
                  : 'rgba(50,50,50,0.9)',
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => openEditScreen(item)}
            style={{ marginRight: 8 }}
          >
            <Icon name="create-outline" size={18} color="#4CAF50" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => confirmDelete(item.id)}>
            <Icon name="trash-outline" size={18} color="#F44336" />
          </TouchableOpacity>
        </View>
      )}
      <View style={{ paddingHorizontal: 8, paddingTop: 6 }}>
        <Text
          style={[
            styles.cardTitle,
            { color: theme === 'light' ? '#000' : '#fff' },
          ]}
        >
          {item.name}
        </Text>
        {item.price && (
          <Text
            style={{
              fontSize: 13,
              color: theme === 'light' ? '#333' : '#ccc',
              marginTop: 2,
            }}
          >
            PKR {item.price}
          </Text>
        )}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 4,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="star" size={14} color="gold" />
            <Text
              style={[
                styles.rating,
                { color: theme === 'light' ? '#555' : '#ccc' },
              ]}
            >
              {item.rating || '—'}
            </Text>
          </View>
          <Text
            style={[
              styles.time,
              { color: theme === 'light' ? '#555' : '#ccc' },
            ]}
          >
            {item.time || ''}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme === 'light' ? '#fff' : '#121212' },
      ]}
    >
      {isAdmin && showBack && (
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.replace('Dashboard')}
        >
          <Icon
            name="arrow-back-outline"
            size={24}
            color={theme === 'light' ? '#000' : '#fff'}
          />
          <Text
            style={{
              color: theme === 'light' ? '#000' : '#fff',
              marginLeft: 6,
            }}
          >
            Back
          </Text>
        </TouchableOpacity>
      )}

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <ImageBackground
            source={require('../assets/Cover.png')}
            style={styles.headerBg}
            imageStyle={{ borderBottomRightRadius: 75 }}
          >
            <View
              style={[
                styles.searchWrapper,
                { backgroundColor: theme === 'light' ? '#fff' : '#2c2c2c' },
              ]}
            >
              <Icon
                name="search-outline"
                size={20}
                color={theme === 'light' ? '#aaa' : '#ccc'}
                style={{ marginHorizontal: 8 }}
              />
              <TextInput
                placeholder="Find your taste"
                placeholderTextColor={theme === 'light' ? '#aaa' : '#ccc'}
                style={[
                  styles.searchInput,
                  { color: theme === 'light' ? '#000' : '#fff' },
                ]}
                value={search}
                onChangeText={setSearch}
              />
            </View>
          </ImageBackground>
        </View>

        <View
          style={[
            styles.locationRow,
            { backgroundColor: theme === 'light' ? '#f8f8f8' : '#2c2c2c' },
          ]}
        >
          <Icon
            name="location-outline"
            size={20}
            color={theme === 'light' ? '#333' : '#ccc'}
          />
          <View style={{ marginLeft: 5 }}>
            <Text
              style={{
                fontWeight: 'bold',
                color: theme === 'light' ? '#000' : '#fff',
              }}
            >
              Home
            </Text>
            <Text style={{ color: theme === 'light' ? '#555' : '#ccc' }}>
              242 ST Marks Eve, Finland
            </Text>
          </View>
          <Icon
            name="options-outline"
            size={20}
            color={theme === 'light' ? '#333' : '#ccc'}
            style={{ marginLeft: 'auto' }}
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            marginHorizontal: 20,
            marginBottom: 10,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              flex: 1,
              color: theme === 'light' ? '#000' : '#fff',
            }}
          >
            Special Items
          </Text>
          {isAdmin && (
            <TouchableOpacity style={styles.addButton} onPress={openAddScreen}>
              <Icon name="add-circle-outline" size={20} color="#fff" />
              <Text style={{ color: '#fff', marginLeft: 6, fontWeight: '700' }}>
                Add
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <FlatList
          data={adminItems}
          horizontal
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          renderItem={renderCard}
          keyExtractor={item => item.id.toString()}
          ListEmptyComponent={() => (
            <View style={{ paddingHorizontal: 20 }}>
              <Text style={{ color: theme === 'light' ? '#777' : '#aaa' }}>
                No special items yet.
              </Text>
            </View>
          )}
        />

        <Text
          style={[
            styles.sectionTitle,
            { color: theme === 'light' ? '#000' : '#fff' },
          ]}
        >
          Nearest Restaurants
        </Text>
        <FlatList
          data={filterData(nearestRestaurants)}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={renderCard}
          keyExtractor={item => item.id.toString()}
        />

        <Text
          style={[
            styles.sectionTitle,
            { color: theme === 'light' ? '#000' : '#fff' },
          ]}
        >
          Popular Restaurants
        </Text>
        <FlatList
          data={filterData(popularRestaurants)}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={renderCard}
          keyExtractor={item => item.id.toString()}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    height: 200,
    width: '100%',
    borderBottomRightRadius: 75,
    overflow: 'hidden',
  },
  headerBg: { flex: 1, justifyContent: 'center', paddingHorizontal: 25 },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 10,
    elevation: 3,
  },
  searchInput: { flex: 1, padding: 10, fontSize: 16 },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 15,
    marginHorizontal: 25,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    margin: 10,
    paddingTop: 10,
  },
  card: {
    borderRadius: 15,
    marginRight: 15,
    // paddingBottom:50,
    marginBottom:20,
    marginTop:20,
    width:140 ,
    height: 170,
    elevation: 9,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  cardImage: {
    width: '100%',
    height: 80,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#ff8800',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  discountText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginHorizontal: 8,
    marginTop: 6,
  },
  rating: { fontSize: 12 },
  time: { fontSize: 12 },
  adminActions: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    padding: 6,
    borderRadius: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD200',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 20,
    zIndex: 10,
  },
});

export default HomeScreen;
