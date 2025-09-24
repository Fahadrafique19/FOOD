import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useDispatch } from 'react-redux';
import DashboardScreen from '../screens/DashboardScreen';
import HomeScreen from '../screens/HomeScreen';
import RestaurantDetail from '../screens/RestaurantDetailScreen';
import MenuScreen from '../screens/MenuScreen';
import CartScreen from '../screens/CartScreen';
import TrackingScreen from '../screens/TrackingScreen';
import AdminItemScreen from '../screens/AdminItemScreen';
import AddMenuItemScreen from '../screens/AddMenuItemScreen';
import UserFormScreen from '../screens/UserFormScreen';
import UsersScreen from '../screens/UsersScreen';
import { logout } from '../redux/slices/authSlice';

const Stack = createNativeStackNavigator();

export default function AdminNavigator() {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard">
        {props => <DashboardScreen {...props} onLogout={handleLogout} />}
      </Stack.Screen>
      <Stack.Screen name="Home">
        {props => <HomeScreen {...props} isAdmin={true} showBack={true} />}
      </Stack.Screen>
      <Stack.Screen name="RestaurantDetail" component={RestaurantDetail} />
      <Stack.Screen name="MenuScreen" component={MenuScreen} />
      <Stack.Screen name="CartScreen" component={CartScreen} />
      <Stack.Screen name="TrackingScreen" component={TrackingScreen} />
      <Stack.Screen name="AdminItemScreen" component={AdminItemScreen} />
      <Stack.Screen name="AddMenuItemScreen" component={AddMenuItemScreen} />
      <Stack.Screen name="UserFormScreen" component={UserFormScreen} />
      <Stack.Screen name="UsersScreen" component={UsersScreen} />
    </Stack.Navigator>
  );
}
