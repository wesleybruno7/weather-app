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
            description={`Lat: ${item.data?.coord.lat}, Lon: ${item.data?.coord.lon}`} 
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
