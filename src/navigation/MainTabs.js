import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

import HomeScreen from '../screens/HomeScreen';
import RestaurantDetail from '../screens/RestaurantDetailScreen';
import MenuScreen from '../screens/MenuScreen';
import TrackingScreen from '../screens/TrackingScreen';
import CartScreen from '../screens/CartScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack({ route }) {
  const { isAdmin } = route.params;
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen">
        {props => <HomeScreen {...props} isAdmin={isAdmin} />}
      </Stack.Screen>
      <Stack.Screen name="RestaurantDetail" component={RestaurantDetail} />
      <Stack.Screen name="MenuScreen" component={MenuScreen} />
      <Stack.Screen name="TrackingScreen" component={TrackingScreen} />
    </Stack.Navigator>
  );
}

function CartStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CartScreen" component={CartScreen} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
    </Stack.Navigator>
  );
}

export default function MainTabs({ route }) {
  const { isAdmin } = route.params;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home-outline';
          else if (route.name === 'Cart') iconName = 'bag-handle-outline';
          else if (route.name === 'Profile') iconName = 'person-outline';

          return (
            <View
              style={[
                styles.iconWrapper,
                { backgroundColor: focused ? '#FFD54F' : '#fff' },
              ]}
            >
              <Ionicons
                name={iconName}
                size={22}
                color={focused ? '#000' : '#aaa'}
              />
            </View>
          );
        },
        tabBarShowLabel: false,
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        initialParams={{ isAdmin }}
      />
      <Tab.Screen name="Cart" component={CartStack} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
});
