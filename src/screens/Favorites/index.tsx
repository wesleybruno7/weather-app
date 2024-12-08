import React, { useEffect, useState } from 'react'
import { View, FlatList, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, Text } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { FavoriteCard } from '../../components/FavoriteCard'
import { useFavorites } from '../../hooks/useFavorites'
import { NavigationProps } from '../../types'

type Props = NavigationProps<'Favorites'>

export function Favorites({ navigation }: Props) {  

  const { favorites, removeFavorite } = useFavorites()

  const [searchText, setSearchText] = useState('')
  const [filteredFavorites, setFilteredFavorites] = useState(favorites)

  useEffect(() => {
    const normalizedSearchText = normalize(searchText)
    setFilteredFavorites(
      favorites.filter(favorite => 
        normalize(favorite.city.name).includes(normalizedSearchText)
      )
    )
  }, [searchText, favorites])

  const normalize = (text: string) => {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
  }

  return (
    <>
      <View style={{
        backgroundColor: '#444DF4',
        height: 50,
      }} />

      <SafeAreaView style={styles.container}>
        <View style={styles.searchContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>

          <TextInput
            style={styles.searchInput}
            placeholder="Buscar cidade..."
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        <View style={styles.listContainer}>
          {
            filteredFavorites.length === 0 ? (
              <Text style={styles.emptyMessage}>Nenhum registro para exibir</Text>
            ) : (
              <FlatList
                data={filteredFavorites}
                keyExtractor={(item) => item.city.name}
                renderItem={({ item }) => (
                  <FavoriteCard
                    city={item.city}
                    onDelete={() => removeFavorite(item.city.name)}
                  />
                )}
              />
            )
          }
        </View>
      </SafeAreaView>
    </>    
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#444DF4',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  backButton: {
    marginRight: 16,
  },
  searchInput: {
    flex: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    height: 45,
  },
  listContainer: {
    flex: 1,
    paddingVertical: 16,
  },
  emptyMessage: {
    textAlign: 'center',
    marginTop: 32,
    fontSize: 18,
    color: '#888',
    alignSelf: 'center',
  },
})
