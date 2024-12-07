import { useEffect, useState } from 'react'
import { FlatList, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { GOOGLE_API_KEY, WEATHER_API_KEY, WEATHER_API_BASE_URL } from '@env'

import 'react-native-get-random-values'
import { Ionicons } from '@expo/vector-icons'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'

import { NavigationProps } from '../../types'

import WeatherInfo from '../../components/WeatherInfo'
import WeatherGradient from '../../components/WeatherGradient'

import { MyFavorites, useFavorites } from '../../hooks/useFavorites'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

type Props = NavigationProps<'Home'>

export function Home({ navigation }: Props) {      
    const [isDaytime, setIsDaytime] = useState<boolean>(true)
    
    const [currentCity, setCurrentCity] = useState<string>('')
    const [weatherForecastData, setWeatherForecastData] = useState<MyFavorites['data']|null>(null)

    const { favorites, addFavorite, removeFavorite, cityIsInFavorites } = useFavorites()

    function toggleFavorite() {
        const city: MyFavorites = {
            name: currentCity,
            data: weatherForecastData,
        }

        if (cityIsInFavorites(currentCity)) {
            removeFavorite(currentCity)
        } else {
            addFavorite(city)
        }
    }

    interface WeatherForecastEndpoint {
        endpoint:  'weather' | 'forecast'
        q: string // selected city on input
        lang?: string // to set Portuguese as language in return
        units?: string // to define Celsius as a metric in the return
    }

    interface MainData {
        feels_like: number,
        grnd_level: number,
        humidity: number,
        pressure: number,
        sea_level: number,
        temp: number,
        temp_max: number,
        temp_min: number,
    }

    function handleGetWeatherForecast({
        endpoint,
        q,
        lang = 'pt_br',
        units = 'metric',
    }: WeatherForecastEndpoint) {
        const baseUrl = WEATHER_API_BASE_URL
        const apiKey = WEATHER_API_KEY // key that guarantees your access to the api

        const endpoitUrl = `${baseUrl}/${endpoint}?appid=${apiKey}&q=${q}&lang=${lang}&units=${units}` 

        fetch(endpoitUrl)
            .then(response => response.json())
            .then(data => {
                setWeatherForecastData(data) // saves all returned data for future use
                setCurrentCity(data.name)

                if (data.sys && data.dt && data.timezone) {
                    const localDateTime = new Date((data.dt + data.timezone) * 1000)
                    const localHour = localDateTime.getUTCHours()
                    const localIsDaytime = localHour >= 6 && localHour < 18

                    setIsDaytime(localIsDaytime)
                }
            })
            .catch(error => console.error("Unable to obtain the weather via request:", error))
    }

    useEffect(() => {
        handleGetWeatherForecast({ endpoint: 'weather', q: 'São José do Rio Preto' })
    }, [])

    useEffect(() => {
        console.log(favorites)
    }, [favorites])

    return (
        <KeyboardAwareScrollView
            style={styles.container}
        >        
            <WeatherGradient weatherForecastData={weatherForecastData} isDaytime={isDaytime} />

            <SafeAreaView style={styles.container}>         

                <View
                    style={{ flexGrow: 1, paddingTop: 80, }}
                >
                    <View style={{
                        position: 'absolute', 
                        alignSelf: 'center', 
                        zIndex: 1, 
                        width: '100%', 
                        flex: 1,
                        marginTop: 32,
                        paddingHorizontal: 16,
                    }}>
                        <GooglePlacesAutocomplete
                            placeholder="Digite o nome de uma cidade"
                            fetchDetails={true}
                            onPress={(data, details = null) => {
                                if (details) {
                                    handleGetWeatherForecast({ endpoint: 'weather', q: data.description })
                                }
                            }}
                            currentLocationLabel={currentCity}
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

                        <TouchableOpacity onPress={toggleFavorite} style={{  margin: 16, justifyContent: 'center', alignItems: 'center', gap: 8, flexDirection: 'row' }}>
                            <Ionicons 
                                name={cityIsInFavorites(currentCity) ? "heart" : "heart-outline"} 
                                style={[
                                    styles.menuTextIcon,
                                    cityIsInFavorites(currentCity) && { color: '#F00'}
                                ]} 
                            />

                            <View>
                                <Text style={styles.menuTextButton}>Salvar no</Text>
                                <Text style={styles.menuTextButton}>Favoritos</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.weatherInfoContainer}>
                        <View style={styles.weatherInfoContent}>
                            <View style={styles.weatherInfoHeader}>
                                <Ionicons name="location-outline" style={styles.weatherInfoHeaderIcon} />

                                <Text style={styles.weatherInfoHeaderText}>
                                    {currentCity}
                                </Text>
                            </View>

                            <WeatherInfo 
                                weatherForecastData={weatherForecastData}
                                isDaytime={isDaytime}
                            />
                        </View>                    
                    </View>

                    <View style={styles.nextFiveDaysContainer}>
                        <FlatList
                            data={[
                                { id: '1', title: 'Item 1' },
                                { id: '2', title: 'Item 2' },
                                { id: '3', title: 'Item 3' },
                                { id: '4', title: 'Item 4' },
                            ]}
                            horizontal
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <View style={{ paddingRight: 16,}}>
                                    <View style={styles.card}>
                                        <Text>{item.title}</Text>
                                    </View>
                                </View>
                            )}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{
                                paddingHorizontal: 0,
                            }}
                            style={{ paddingHorizontal: 16 }}
                        />
                    </View>
                </View>  
            </SafeAreaView>
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchInputContainer: {
        flex: 1,
        zIndex: 1,
        // padding: 16,
        // paddingTop: 32,
    },
    searchInputText: {
        height: 44,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    menuContainer: {
        // flex: 1, 
        // paddingTop: 48,
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        // width: '100%' 
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
    weatherInfoContainer: {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: 'orange', 
        // minHeight: 200
    },
    weatherInfoContent: {
        flex: 1,
        paddingTop: 16,
        backgroundColor: 'green',
        alignItems: 'center', 
        justifyContent: 'center',
        overflow: 'hidden',
    },
    weatherInfoHeader: {
        flexDirection: 'row',
        // alignItems: 'center',
        // justifyContent: 'center',
        width: '100%',
        gap: 8,
        paddingHorizontal: 16
    },
    weatherInfoHeaderIcon: {
        fontSize: 24,
        color: '#FFF'
    },
    weatherInfoHeaderText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
        paddingRight: 8,
    },

    card: {
        backgroundColor: 'lightgreen',
        width: 150,
        height: 150,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        // marginRight: 16,
    },
    nextFiveDaysContainer: {
        // flex: 1,
        backgroundColor: 'purple',
        paddingVertical: 16,
    },
})
