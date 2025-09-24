import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { ThemeContext } from '../../App';

import {
  initBestSellerDB,
  getBestSellersByRestaurant,
  addBestSeller,
} from '../data/bestSellerService';

const TABS = ['Best Seller', 'Veg', 'Non-Veg', 'Beverages'];

const RestaurantDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { restaurant } = route.params;
  const { colors } = useContext(ThemeContext);

  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('Best Seller');

  useEffect(() => {
    const fetchData = async () => {
      await initBestSellerDB();
      const existing = await getBestSellersByRestaurant(restaurant.id);

      if (existing.length === 0) {
        await addBestSeller(
          restaurant.id,
          'Chicken Burger',
          450,
          '20% OFF',
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCrA9ev9KuwvHTtjwcOg5VlzqC9_x7V1u6EQ&s',
        );
        await addBestSeller(
          restaurant.id,
          'Veg Pizza',
          800,
          null,
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_7gbHJl2zg93KoiFFZN4Ue_XH0QD3i-u91w&s',
        );
      }

      const data = await getBestSellersByRestaurant(restaurant.id);
      setProducts(data);
    };
    fetchData();
  }, [restaurant.id]);

  const renderProduct = ({ item }) => (
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      {item.offer && (
        <View
          style={[styles.discountBadge, { backgroundColor: colors.accent }]}
        >
          <Text style={styles.discountText}>{item.offer}</Text>
        </View>
      )}
      <View style={styles.cardContent}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>
          {item.name}
        </Text>
        <Text style={[styles.cardPrice, { color: colors.subtitle }]}>
          Rs {item.price}
        </Text>
      </View>
      <TouchableOpacity
        style={[styles.addBtn, { backgroundColor: colors.addBtn }]}
      >
        <Text style={{ fontSize: 20, color: colors.text }}>+</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.statusBar} />
      <Image source={{ uri: restaurant.image }} style={styles.headerImage} />

      <View style={styles.headerButtons}>
        <TouchableOpacity
          style={[styles.iconBtn, { backgroundColor: colors.card }]}
          onPress={() => navigation.goBack()}
        >
          <Icon name="chevron-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TouchableOpacity
            style={[styles.iconBtn, { backgroundColor: colors.card }]}
          >
            <Icon name="heart-outline" size={22} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconBtn, { backgroundColor: colors.card }]}
          >
            <Icon name="share-outline" size={22} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.infoBox}>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <Text style={[styles.title, { color: colors.text }]}>
              {restaurant.name}
            </Text>
            <Text style={[styles.moreInfo, { color: colors.accent }]}>
              More info
            </Text>
          </View>
          <Text style={[styles.rating, { color: colors.subtitle }]}>
            ⭐ {restaurant.rating} • ⏱ {restaurant.time}
          </Text>
          {restaurant.discount && (
            <Text style={[styles.discount, { color: colors.accent }]}>
              {restaurant.discount}
            </Text>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabsRow}
        >
          {TABS.map(tab => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tabBtn,
                {
                  backgroundColor:
                    activeTab === tab ? colors.accent : colors.border,
                },
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && { color: '#fff', fontWeight: '600' },
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Best sellers
        </Text>
        <FlatList
          data={products}
          keyExtractor={item => item.id.toString()}
          renderItem={renderProduct}
          scrollEnabled={false}
        />

        <TouchableOpacity
          style={styles.menuBtn}
          onPress={() => navigation.navigate('MenuScreen', { restaurant })}
        >
          <Text style={[styles.menuText, { color: colors.accent }]}>
            See our menu
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default RestaurantDetailScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerImage: {
    width: '100%',
    height: 200,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 70,
  },
  headerButtons: {
    position: 'absolute',
    top: 40,
    left: 15,
    right: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconBtn: { padding: 10, borderRadius: 12, elevation: 3 },
  infoBox: { padding: 15 },
  title: { fontSize: 22, fontWeight: 'bold' },
  moreInfo: { fontWeight: '600' },
  rating: { marginTop: 6, fontSize: 14 },
  discount: { marginTop: 6, fontWeight: 'bold' },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    paddingHorizontal: 15,
    marginTop: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
    marginVertical: 8,
    borderRadius: 12,
    padding: 10,
    elevation: 2,
  },
  cardImage: { width: 60, height: 60, borderRadius: 10 },
  discountBadge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    borderBottomLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  discountText: { color: '#fff', fontSize: 10 },
  cardContent: { flex: 1, marginLeft: 10 },
  cardTitle: { fontSize: 16, fontWeight: '600' },
  cardPrice: { marginTop: 2, fontWeight: 'bold' },
  addBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabsRow: { flexDirection: 'row', paddingHorizontal: 10, marginVertical: 10 },
  tabBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 10,
  },
  tabText: { color: '#444' },
  menuBtn: { alignSelf: 'flex-end', padding: 15 },
  menuText: { fontWeight: '600' },
});
