// import React, { useContext } from "react";
// import { createStackNavigator } from "@react-navigation/stack";
// import { useSelector } from "react-redux";
// import SplashScreen from "../screens/SplashScreen";
// import OnboardingScreen from "../screens/OnboardingScreen";
// import LoginScreen from "../screens/LoginScreen";
// import RegisterScreen from "../screens/RegisterScreen";
// import { ThemeContext } from "../../App";

// const Stack = createStackNavigator();

// export default function AuthNavigator() {
//   const { colors } = useContext(ThemeContext);
//   const { hasRegistered } = useSelector(state => state.auth); // Redux state

//   return (
//     <Stack.Navigator
//       screenOptions={{
//         headerShown: false,
//         cardStyle: { backgroundColor: colors.background },
//       }}
//       initialRouteName={hasRegistered ? "Login" : "Register"} // Redux state
//     >
//       <Stack.Screen name="Splash" component={SplashScreen} />
//       <Stack.Screen name="Onboarding" component={OnboardingScreen} />

//       <Stack.Screen name="Register" component={RegisterScreen} />
//       <Stack.Screen name="Login" component={LoginScreen} />
//     </Stack.Navigator>
//   );
// }
