import { useEffect, useState } from 'react'
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { GOOGLE_API_KEY, WEATHER_API_KEY, WEATHER_API_BASE_URL } from '@env'

import 'react-native-get-random-values'
import { Ionicons } from '@expo/vector-icons'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'

import { NavigationProps } from '../../types'

import WeatherInfo from '../../components/WeatherInfo'
import WeatherGradient from '../../components/WeatherGradient'

import { MyFavorites, useFavorites } from '../../hooks/useFavorites'
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view'
import { WeatherCard } from '../../components/WeatherCard'

type Props = NavigationProps<'Home'>

interface NextDaysData {
    dt_txt: string
    temp: number
    temp_min: number
    temp_max: number
    weather: {
        description: string
        icon: string
    }[]
}

export function Home({ navigation }: Props) {      
    const [isDaytime, setIsDaytime] = useState<boolean>(true)
    
    const [currentCity, setCurrentCity] = useState<string>('')
    const [weatherForecastData, setWeatherForecastData] = useState<MyFavorites['data']|null>(null)

    const { favorites, addFavorite, removeFavorite, cityIsInFavorites } = useFavorites()

    const [nextDaysData, setNextDaysData] = useState<NextDaysData[]>([])

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

    function handleGetWeatherForecast(str: string) {
        const baseUrl = WEATHER_API_BASE_URL
        const apiKey = WEATHER_API_KEY // key that guarantees your access to the api
        const endpoint = 'weather'

        const lang = 'pt_br' // to set Portuguese as language in return
        const units = 'metric' // to define Celsius as a metric in the return
        const q = str // selected city on input

        const endpointUrl = `${baseUrl}/${endpoint}?appid=${apiKey}&q=${q}&lang=${lang}&units=${units}` 

        fetch(endpointUrl)
            .then(response => response.json())
            .then(data => {
                console.log(data)

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

    function handleGetWeatherForecastNextFiveDays(str: string) {
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
                const filteredData = data.list?.filter((item: any, index: number, array: any[]) => {
                    const currentDate = new Date(item.dt_txt).getDate()
                    const previousDate = index > 0 ? new Date(array[index - 1].dt_txt).getDate() : null
                    return currentDate !== previousDate
                }).slice(0, 5) // get only 5 next days

                setNextDaysData(filteredData)

                // const mappedData = filteredData?.map((item: any) => {
                //     const date = item.dt_txt
                //     const temp = item.main.temp
                //     const temp_min = item.main.temp_min
                //     const temp_max = item.main.temp_max

                //     return {
                //         dt_txt: date,
                //         temp: temp,
                //         temp_min: temp_min,
                //         temp_max: temp_max,
                //         weather: item.weather.map((w: any) => ({
                //             description: w.description,
                //             icon: w.icon
                //         }))
                //     }
                // })

                // setNextDaysData(mappedData)
            })
            .catch(error => console.error("Unable to obtain the weather via request:", error))
    }

    useEffect(() => {
        const initialLocation = 'São José do Rio Preto'
        handleGetWeatherForecast(initialLocation)
        handleGetWeatherForecastNextFiveDays(initialLocation)
    }, [])

    useEffect(() => {
        console.log(favorites)
    }, [favorites])

    return (
        <SafeAreaView style={styles.container}>     
            <WeatherGradient weatherForecastData={weatherForecastData} isDaytime={isDaytime} />

            <View style={{
                zIndex: 1,
                height: 80,
                width: '100%',
                backgroundColor: '#444DF4',
            }}>
                <View style={{
                    position: 'absolute', 
                    alignSelf: 'center', 
                    zIndex: 1, 
                    width: '100%', 
                    flex: 1,
                    marginTop: 20,
                    // marginTop: 72,
                    paddingHorizontal: 16,
                }}>
                    <GooglePlacesAutocomplete
                        placeholder="Digite o nome de uma cidade"
                        fetchDetails={true}
                        onPress={(data, details = null) => {
                            if (details) {
                                handleGetWeatherForecast(data.description)
                                handleGetWeatherForecastNextFiveDays(data.description)
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
                            style={{ flex: 1 }}
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
                        </View>

                        <View style={styles.weatherInfoWrapper}>
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

                        <View style={styles.nextFiveDaysContainer}>
                            <FlatList
                                data={nextDaysData}
                                horizontal
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item }) => (
                                    <WeatherCard weatherData={item} />
                                )}
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{
                                    paddingHorizontal: 0,
                                }}
                                style={{ paddingHorizontal: 32 }}
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
    weatherInfoWrapper: {
        flex: 1,
        padding: 32,
    },
    weatherInfoHeader: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
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
    },
    nextFiveDaysContainer: {
        paddingVertical: 32,
    },
})
