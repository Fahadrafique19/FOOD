import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  StatusBar,
  ImageBackground,
} from 'react-native';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    image: require('../assets/popcorn.png'),
    title: 'Choose A Tasty Dish',
    subtitle: 'Order anything you want from your Favorite restaurant.',
  },

  {
    id: '2',
    image: require('../assets/money.png'),
    title: 'Easy Payment',
    subtitle:
      'Payment made easy through debit card, credit card & more ways to pay for your food',
  },

  {
    id: '3',
    image: require('../assets/restaurant.png'),
    title: 'Enjoy the Taste!',
    subtitle:
      'Healthy eating means eating a variety of foods that give you the nutrients you need to maintain your health.',
  },
];

export default function OnboardingScreen({ navigation }) {
  const [index, setIndex] = useState(0);
  const ref = useRef();

  const handleNext = () => {
    if (index < slides.length - 1) {
      ref.current.scrollToIndex({ index: index + 1 });
    } else {
      navigation.replace('Login');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      <FlatList
        ref={ref}
        data={slides}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <Image
              source={item.image}
              style={styles.image}
              resizeMode="contain"
            />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </View>
        )}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={e => {
          const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
          setIndex(newIndex);
        }}
      />

      <ImageBackground
        source={require('../assets/Bottom.png')}
        style={styles.bottomContainer}
        resizeMode="cover"
      >
        <View style={styles.dots}>
          {slides.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === index && styles.activeDot]}
            />
          ))}
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
            <Text style={styles.nextText}>
              {index === slides.length - 1 ? 'Get Started' : 'Next'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.replace('Register')}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  slide: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
  },
  image: { width: 220, height: 220, marginBottom: 20 },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
    marginTop: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#777',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 40,
    lineHeight: 22,
  },

  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 150,
    paddingVertical: 25,
  },

  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#FFD600',
    borderWidth: 1.5,
    borderColor: '#333',
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 15,
    paddingRight: 20,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#444',
  },

  nextBtn: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  nextText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
});
