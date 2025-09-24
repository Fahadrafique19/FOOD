import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { WebView } from 'react-native-webview';

const { width } = Dimensions.get('window');

const COLORS = {
  bg: '#F5F6F8',
  textDark: '#2A2A2A',
  muted: '#909090',
  orange: '#FF7A00',
  green: '#7ACB3F',
  yellow: '#FFD426',
};

export default function TrackingScreen({ navigation }) {
  const mapHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body, html { margin: 0; padding: 0; height: 100%; }
          iframe { width: 100%; height: 100%; border: 0; }
        </style>
      </head>
      <body>
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3604.312620618822!2d68.32827627521822!3d25.394344077584645!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x394c7bf1cf1c723f%3A0x6f7c3172f82824c4!2sVerge%20Systems%20Pvt.%20Ltd.!5e0!3m2!1sen!2s!4v1757318073103!5m2!1sen!2s" 
          allowfullscreen=""
          loading="lazy">
        </iframe>
      </body>
    </html>
  `;

  return (
    <View style={styles.safe}>
      <WebView
        originWhitelist={['*']}
        source={{ html: mapHtml }}
        style={{ flex: 1 }}
      />

      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="chevron-back" size={22} color="#000" />
      </TouchableOpacity>

      <View style={styles.bottomCard}>
        <Text style={{ fontSize: 16, color: COLORS.textDark }}>
          Delivery time
        </Text>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}
        >
          <Ionicons name="time-outline" size={18} color="#000" />
          <Text style={{ marginLeft: 6, fontSize: 18, fontWeight: '700' }}>
            20 Min
          </Text>
        </View>

        <View style={styles.deliveryRow}>
          <Image
            source={{
              uri: 'https://randomuser.me/api/portraits/women/44.jpg',
            }}
            style={styles.avatar}
          />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: '700' }}>
              George William
            </Text>
            <Text style={{ color: COLORS.muted }}>Delivery person</Text>
          </View>
          <TouchableOpacity style={styles.callBtn}>
            <Ionicons name="call-outline" size={20} color={COLORS.orange} />
          </TouchableOpacity>
        </View>

        <View style={styles.statusRow}>
          <Ionicons name="checkmark-circle" size={22} color={COLORS.green} />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.statusTitle}>Order confirmed</Text>
            <Text style={styles.statusText}>Your order has been confirmed</Text>
          </View>
        </View>
        <View style={styles.statusRow}>
          <Ionicons name="checkmark-circle" size={22} color={COLORS.green} />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.statusTitle}>Order prepared</Text>
            <Text style={styles.statusText}>Your order has been prepared</Text>
          </View>
        </View>
        <View style={styles.statusRow}>
          <Ionicons name="ellipse" size={22} color={COLORS.orange} />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.statusTitle}>Delivery in progress</Text>
            <Text style={styles.statusText}>
              Hang on! Your food is on the way
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  backBtn: {
    position: 'absolute',
    top: 50,
    left: 16,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 12,
    elevation: 3,
  },
  bottomCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.yellow,
    padding: 20,
    borderTopLeftRadius: 65,
    borderTopRightRadius: 0,
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  avatar: { width: 50, height: 50, borderRadius: 25 },
  callBtn: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 14,
  },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  statusTitle: { fontWeight: '700', fontSize: 16 },
  statusText: { fontSize: 13, color: '#333' },
  bottomTabs: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 70,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  cartFab: {
    backgroundColor: COLORS.yellow,
    padding: 16,
    borderRadius: 24,
    marginTop: -30,
  },
});
