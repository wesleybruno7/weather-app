import React from 'react'
import { View, FlatList, StyleSheet } from 'react-native'
import { FavoriteCard } from '../../components/FavoriteCard'
import { useFavorites } from '../../hooks/useFavorites'

export function Favorites() {
  const { favorites } = useFavorites()

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <FavoriteCard 
            title={item.name} 
            description={`Lat: ${item.coordinates.lat}, Lon: ${item.coordinates.lon}`} 
          />
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
})
