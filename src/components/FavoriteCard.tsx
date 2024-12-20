import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { MyFavorites } from '../hooks/useFavorites';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

interface Props {
  city: MyFavorites['city'];
  onDelete: () => void;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export function FavoriteCard({ city, onDelete }: Props) {
  const [isSwipeableIsClose, setSwipeableIsClose] = useState(true);
  const borderRadius = useSharedValue(8);
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    borderRadius.value = withTiming(isSwipeableIsClose ? 8 : 0);
  }, [isSwipeableIsClose]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      borderTopRightRadius: borderRadius.value,
      borderBottomRightRadius: borderRadius.value,
    };
  });

  return (
    <View style={styles.container}>
      <Swipeable
        renderRightActions={() => (
          <TouchableOpacity
            style={[styles.deleteButton, styles.shadow]}
            onPress={onDelete}
          >
            <Ionicons 
              name="trash"
              style={styles.deleteButtonIcon} 
            />
          </TouchableOpacity>
        )}
        onSwipeableWillOpen={() => setSwipeableIsClose(false)}
        onSwipeableWillClose={() => setSwipeableIsClose(true)}
        rightThreshold={50}
        overshootLeft={false}
        overshootRight={false}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate('Home', { city: city.name })}
          activeOpacity={1}
        >
          <Animated.View style={[styles.card, styles.shadow, animatedStyle]}>
            <Text style={styles.cardTitle}>{city.name}</Text>

            <Text style={styles.cardText}>
              Latitude: 
              <Text style={styles.cardTextBold}>{city.coord.lat}</Text>
            </Text>
            
            <Text style={styles.cardText}>
              Longitude: 
              <Text style={styles.cardTextBold}>{city.coord.lon}</Text>
            </Text>
          </Animated.View>
        </TouchableOpacity>
      </Swipeable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginVertical: 8,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    borderColor: '#CCC',
    backgroundColor: '#F00',
    
  },
  deleteButtonIcon: {
    color: '#FFF',
    fontSize: 32,
  },
  card: {
    padding: 16,
    backgroundColor: '#FFF',
    marginVertical: 8,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    borderWidth: 1,
    borderColor: '#CCC',
    
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
  },
  cardText: {
    fontSize: 12,
  },
  cardTextBold: {
    fontSize: 12,
    fontWeight: 'bold'
  },
  shadow: {
    shadowColor: '#CCC',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
});
