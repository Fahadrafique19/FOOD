import React, { useContext, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { ThemeContext } from "../../App";
import Ionicons from "react-native-vector-icons/Ionicons";
import { logout } from "../redux/slices/authSlice";

export default function SettingsScreen({ navigation }) {
  const { colors, toggleTheme } = useContext(ThemeContext);
  const dispatch = useDispatch();

  const { isLoggedIn } = useSelector(state => state.auth);

  const handlePress = () => {
    if (isLoggedIn) {
      dispatch(logout());
    } else {
      navigation.navigate("Login");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.topRight}>
        <TouchableOpacity onPress={toggleTheme}>
          <Ionicons
            name={colors.background === "#fff" ? "moon" : "sunny"}
            size={30}
            color="#f57c00"
          />
        </TouchableOpacity>
      </View>

      <Text style={[styles.title, { color: colors.text }]}>Settings</Text>

      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonText}>
          {isLoggedIn ? "Logout" : "Login"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  topRight: { alignItems: "flex-end", marginTop: 60 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center", marginTop: 30 },
  button: {
    backgroundColor: "#f57c00",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold", textAlign: "center" },
});
