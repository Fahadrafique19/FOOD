import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Pressable,
  TextInput,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ThemeContext } from '../../App';
import { useSelector } from 'react-redux';

const { width } = Dimensions.get('window');

const CartScreen = ({ navigation }) => {
  const { colors } = useContext(ThemeContext);

  const { isLoggedIn, hasRegistered } = useSelector(state => state.auth);

  const [cart, setCart] = React.useState([
    {
      id: '1',
      title: 'Burger with some',
      price: 152.0,
      qty: 1,
      image:
        'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1200&auto=format&fit=crop',
    },
    {
      id: '2',
      title: 'Pizza with toppings',
      price: 152.0,
      qty: 1,
      image:
        'https://images.unsplash.com/photo-1601924579440-0d79ba7dc12b?q=80&w=1200&auto=format&fit=crop',
    },
  ]);

  const updateQty = (id, delta) => {
    setCart(prev =>
      prev.map(item =>
        item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item,
      ),
    );
  };

  const removeItem = id => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const itemTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const discount = 10;
  const tax = 2;
  const total = itemTotal - discount + tax;

  const handleContinue = () => {
    if (isLoggedIn) {
      navigation.navigate('TrackingScreen');
    } else if (!hasRegistered) {
      navigation.navigate('Register', { redirectTo: 'CartScreen' });
    } else {
      navigation.navigate('Login', { redirectTo: 'CartScreen' });
    }
  };

  const renderItem = ({ item }) => (
    <View style={[styles.cartItem, { backgroundColor: colors.card }]}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={[styles.itemTitle, { color: colors.text }]}>
          {item.title}
        </Text>
        <View style={styles.qtyRow}>
          <Pressable
            style={[styles.qtyBtn, { backgroundColor: colors.addBtn }]}
            onPress={() => updateQty(item.id, -1)}
          >
            <Text style={[styles.qtyBtnText, { color: colors.text }]}>-</Text>
          </Pressable>
          <Text style={[styles.qtyText, { color: colors.text }]}>
            {item.qty}
          </Text>
          <Pressable
            style={[styles.qtyBtn, { backgroundColor: colors.addBtn }]}
            onPress={() => updateQty(item.id, 1)}
          >
            <Text style={[styles.qtyBtnText, { color: colors.text }]}>+</Text>
          </Pressable>
        </View>
      </View>
      <Text style={[styles.price, { color: colors.text }]}>
        {item.price.toFixed(2)}
      </Text>
      <Pressable onPress={() => removeItem(item.id)} style={{ marginLeft: 8 }}>
        <Ionicons name="close" size={20} color={colors.accent} />
      </Pressable>
    </View>
  );

  return (
    <View style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={[styles.iconBtn, { backgroundColor: colors.card }]}
          onPress={() =>
            navigation.canGoBack()
              ? navigation.goBack()
              : navigation.navigate('HomeScreen')
          }
        >
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Cart</Text>
        <View style={{ width: 48 }} />
      </View>

      <View style={[styles.addressBox, { backgroundColor: colors.accent }]}>
        <Ionicons name="location-outline" size={20} color="#fff" />
        <View style={{ marginLeft: 8, flex: 1 }}>
          <Text style={styles.addressLabel}>Deliver to</Text>
          <Text style={styles.addressText}>242 ST Marks Eve, Finland</Text>
        </View>
        <Ionicons name="chevron-down" size={20} color="#fff" />
      </View>

      <FlatList
        data={cart}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
      />

      <View style={[styles.promoBox, { backgroundColor: colors.card }]}>
        <TextInput
          placeholder="PROMO CODE"
          placeholderTextColor={colors.subtitle}
          style={[styles.promoInput, { color: colors.text }]}
        />
        <Ionicons name="add" size={20} color={colors.subtitle} />
      </View>

      <View style={[styles.summaryBox, { backgroundColor: colors.primary }]}>
        <View style={styles.summaryRow}>
          <Text style={{ color: colors.text }}>Item total</Text>
          <Text style={{ color: colors.text }}>${itemTotal.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={{ color: colors.text }}>Discount</Text>
          <Text style={{ color: 'red' }}>- ${discount}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={{ color: colors.text }}>Tax</Text>
          <Text style={{ color: colors.text }}>${tax}</Text>
        </View>
        <View style={[styles.summaryRow, { marginTop: 8 }]}>
          <Text style={[styles.totalLabel, { color: colors.text }]}>Total</Text>
          <Text style={[styles.totalValue, { color: colors.text }]}>
            {total.toFixed(2)}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.continueBtn, { backgroundColor: colors.card }]}
          onPress={handleContinue}
        >
          <Text style={[styles.continueText, { color: colors.text }]}>
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  iconBtn: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
  },
  headerTitle: { fontSize: 22, fontWeight: '700' },
  addressBox: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    padding: 16,
    borderRadius: 16,
  },
  addressLabel: { color: '#fff', fontSize: 14 },
  addressText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
  },
  itemImage: { width: 60, height: 60, borderRadius: 12 },
  itemTitle: { fontSize: 16, fontWeight: '600' },
  qtyRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  qtyBtn: {
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnText: { fontSize: 18, fontWeight: '700' },
  qtyText: { marginHorizontal: 10, fontWeight: '700' },
  price: { fontSize: 16, fontWeight: '700' },
  promoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 20,
  },
  promoInput: { flex: 1, fontSize: 16 },
  summaryBox: { padding: 20, borderTopLeftRadius: 45, borderTopRightRadius: 0 },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  totalLabel: { fontSize: 18, fontWeight: '700' },
  totalValue: { fontSize: 18, fontWeight: '900' },
  continueBtn: {
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  continueText: { fontSize: 16, fontWeight: '700' },
});

export default CartScreen;
