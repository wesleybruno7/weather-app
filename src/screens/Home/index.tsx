import { useCallback, useEffect, useState } from 'react'
import { FlatList, Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { GOOGLE_API_KEY, WEATHER_API_KEY, WEATHER_API_BASE_URL } from '@env'

import 'react-native-get-random-values'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view'

import { NavigationProps } from '../../types'
import { weatherDataCity, WeatherDataList } from '../../types/openWeatherMap'

import { MyFavorites, useFavorites } from '../../hooks/useFavorites'
import { WeatherCard } from '../../components/WeatherCard'
import WeatherInfo from '../../components/WeatherInfo'
import { useFocusEffect } from '@react-navigation/native'

type Props = NavigationProps<'Home'>

export function Home({ navigation, route }: Props) {     
        
    const { addFavorite, removeFavorite, cityIsInFavorites, reloadFavorites } = useFavorites()

    const [weatherData, setWeatherData] = useState<MyFavorites | null>(null)

    function toggleFavorite() {
        if (weatherData) {
            const city: string = weatherData.city.name
    
            if (cityIsInFavorites(city)) {
                removeFavorite(city)
            } else {
                addFavorite(weatherData)
            }
        }
    }

    function handleGetWeatherForecast(str: string) {
        const baseUrl = WEATHER_API_BASE_URL
        const apiKey = WEATHER_API_KEY // key that guarantees your access to the api
        const endpoint = 'forecast'

        const lang = 'pt_br' // to set Portuguese as language in return
        const units = 'metric' // to define Celsius as a metric in the return
        const q = str // selected city on input

        const endpointUrl = `${baseUrl}/${endpoint}?appid=${apiKey}&q=${q}&lang=${lang}&units=${units}` 

        fetch(endpointUrl)
            .then(response => response.json())
            .then(data => {
                // Filtering the data to remove day and night duplicates
                const filteredList = data.list.filter((item: WeatherDataList, index: number, self: WeatherDataList[]) => 
                    index === self.findIndex((t) => (
                        t.dt_txt.split(' ')[0] === item.dt_txt.split(' ')[0]
                    ))
                );

                // Selecting the first 6 items from the filtered list
                const selectedWeatherList: WeatherDataList[] = filteredList.slice(0, 6);
                const selectedCity: weatherDataCity = data.city;

                setWeatherData({
                    list: selectedWeatherList, 
                    city: selectedCity
                });
            })
            .catch(error => console.error("Unable to obtain the weather via request:", error))
    }

    const city = route?.params?.city || 'São José do Rio Preto'

    useEffect(() => {
        handleGetWeatherForecast(city)
    }, [])

    useFocusEffect(
        useCallback(() => {
            reloadFavorites() // Update favorites when screen gains focus

            handleGetWeatherForecast(city)
        }, [])
    )

    return (
        <SafeAreaView style={styles.container}>     
            <LinearGradient 
                colors={['#444DF4', '#B0C4DE']}
                style={styles.gradient}
            />

            <View style={styles.serachWrapper}>
                <View style={styles.searchContainer}>
                    <GooglePlacesAutocomplete
                        placeholder="Digite o nome de uma cidade"
                        fetchDetails={true}
                        onPress={(data, details = null) => {
                            if (details) {
                                handleGetWeatherForecast(data.description)
                            }
                        }}
                        currentLocationLabel={weatherData?.city?.name || ''}
                        query={{
                            key: GOOGLE_API_KEY,
                            language: 'pt',
                            types: 'geocode',
                        }}
                        styles={styles.searchInputText}
                        debounce={100}
                        enablePoweredByContainer={false}
                        listViewDisplayed="auto"
                    />
                </View>
            </View>

            <KeyboardAwareFlatList
                data={['']}
                keyExtractor={item => item}
                ListHeaderComponent={() => null}
                ListFooterComponent={() => null} 
                contentContainerStyle={{ flexGrow: 1 }}
                renderItem={() => (
                    <View style={{ flexGrow: 1, height: '100%'}}>
                        <View
                            style={{ height: 70 }}
                        >
                            <View style={styles.menuContainer}>
                                <TouchableOpacity 
                                    style={styles.menuSettingsButton}
                                    onPress={() => navigation.navigate('Favorites')}
                                >
                                    <Ionicons 
                                        name="settings-outline"
                                        style={styles.menuTextIcon} 
                                    />

                                    <View>
                                        <Text style={styles.menuTextButton}>Gerenciar</Text>
                                        <Text style={styles.menuTextButton}>Favoritos</Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={toggleFavorite} style={styles.toggleFavoriteButton}>
                                    <Ionicons 
                                        name={cityIsInFavorites(weatherData?.city.name) ? "heart" : "heart-outline"} 
                                        style={[
                                            styles.menuTextIcon,
                                            cityIsInFavorites(weatherData?.city.name)  && { color: '#F00'}
                                        ]} 
                                    />

                                    <View>
                                        <Text style={styles.menuTextButton}>Salvar no</Text>
                                        <Text style={styles.menuTextButton}>Favoritos</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                        
                        <WeatherInfo 
                            data={weatherData}
                        />

                        <View style={styles.nextFiveDaysContainer}>
                            <FlatList
                                data={weatherData?.list.slice(1,6) || []}
                                horizontal
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item }) => (
                                    <WeatherCard data={item} />
                                )}
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{
                                    paddingLeft: 0, paddingRight: 32,
                                }}
                                style={{ paddingHorizontal: 24, paddingVertical: 16 }}
                            />
                        </View>
                    </View>
                )}
            />
        </SafeAreaView>        
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        ...StyleSheet.absoluteFillObject
    },
    serachWrapper: {
        zIndex: 1,
        height: Platform.OS === 'ios' ? 80 : 100,
        width: '100%',
    },
    searchContainer: {
        position: 'absolute', 
        alignSelf: 'center', 
        zIndex: 1, 
        width: '100%', 
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 20 : 40,
        paddingHorizontal: 16,
    },
    
    searchInputContainer: {
        flex: 1,
        zIndex: 1,
    },
    searchInputText: {
        height: 44,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    menuContainer: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
    },
    menuSettingsButton: { 
        margin: 16, 
        justifyContent: 'center', 
        alignItems: 'center', 
        gap: 8, 
        flexDirection: 'row' 
    },
    menuTextIcon: {
        fontSize: 32,
        color: "#FFF",
    },
    menuTextButton: {
        color: '#FFF',
        fontSize: 10,
    }, 
    toggleFavoriteButton: {
        margin: 16, 
        justifyContent: 'center', 
        alignItems: 'center', 
        gap: 8, 
        flexDirection: 'row'
    },
    nextFiveDaysContainer: {
        paddingVertical: 16,
    },
})
