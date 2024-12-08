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
        keyExtractor={(item) => item.city.name}
        renderItem={({ item }) => (
          <FavoriteCard 
            title={item.city.name} 
            description={`Lat: ${item.city.coord.lat}, Lon: ${item.city.coord.lon}`} 
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
