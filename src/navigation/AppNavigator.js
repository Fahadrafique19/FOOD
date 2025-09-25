import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";

import MainTabs from "./MainTabs";
import RestaurantDetail from "../screens/RestaurantDetailScreen";
import MenuScreen from "../screens/MenuScreen";
import TrackingScreen from "../screens/TrackingScreen";
import RegisterScreen from "../screens/RegisterScreen";
import LoginScreen from "../screens/LoginScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { isAdmin } = useSelector(state => state.auth);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        initialParams={{ isAdmin }}
      />
    
      <Stack.Screen name="RestaurantDetail" component={RestaurantDetail} />
      <Stack.Screen name="MenuScreen" component={MenuScreen} />
      <Stack.Screen name="TrackingScreen" component={TrackingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      
    </Stack.Navigator>
  );
}
