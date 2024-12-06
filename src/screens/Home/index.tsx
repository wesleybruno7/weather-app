import { useEffect, useState } from 'react'
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { GOOGLE_API_KEY, WEATHER_API_KEY } from '@env'

import 'react-native-get-random-values'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Ionicons } from '@expo/vector-icons'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'


import WeatherInfo from '../../components/WeatherInfo'
import WeatherGradient from '../../components/WeatherGradient'

export function Home() {      
    const initialDataAux = {
        name: 'São José do Rio Preto',
        coordinates: {
            lat: -20.8197, 
            lon: -49.3794,
        }
    }

    const [isDaytime, setIsDaytime] = useState<boolean>(true)

    const [currentTemp, setCurrentTemp] = useState(21)
    const [minTemp, setMinTemp] = useState(18)
    const [maxTemp, setMaxTemp] = useState(31)
    const [weatherId, setWeatherId] = useState<number>(800)
    
    const [searchText, setSearchText] = useState<string>('')
    const [currentCity, setCurrentCity] = useState<string>(initialDataAux.name)
    const [coordinates, setCoordinates] = useState<{ lat: number, lon: number } | null>(initialDataAux.coordinates)

    type MyFavorites = {
        name: string
        lat: number,
        lon: number,
    }

    const [myFavorites, setMyFavorites] = useState<MyFavorites[]>([])

    function cityIsInFavorites(): boolean {
        return myFavorites.some(item => item.name === currentCity)
    }

    function toggleFavorite() {
        const city = {
            name: currentCity,
            lat: coordinates?.lat || 0,
            lon: coordinates?.lon || 0,
        };
    
        if (cityIsInFavorites()) {
            setMyFavorites(prevFavorites => prevFavorites.filter(item => item.name !== currentCity));
        } else {
            setMyFavorites(prevFavorites => [...prevFavorites, city]);
        }
    }

    async function saveFavorites(favorites: MyFavorites[]) {
        try {
            const jsonValue = JSON.stringify(favorites);
            await AsyncStorage.setItem('@myFavorites', jsonValue);
        } catch (e) {
            console.error("Erro ao salvar favoritos:", e);
        }
    }

    async function loadFavorites() {
        try {
            const jsonValue = await AsyncStorage.getItem('@myFavorites');
            return jsonValue != null ? JSON.parse(jsonValue) : [];
        } catch (e) {
            console.error("Erro ao carregar favoritos:", e);
            return [];
        }
    }

    useEffect(() => {
        async function fetchFavorites() {
            const loadedFavorites = await loadFavorites();
            setMyFavorites(loadedFavorites);
        }
    
        fetchFavorites();
    }, []);
    
    useEffect(() => {
        saveFavorites(myFavorites);
    }, [myFavorites]);

    // const kelvinToCelsius = (kelvin: number) => kelvin - 273.15 // convert to celsius
    // const kelvinToFahrenheit = (kelvin: number) => (kelvin - 273.15) * 9/5 + 32 // convert to fahrenheit

    function handleFetchDataFromOpenWeatherApi(coordinates: {lat: number, lon: number}) {
        fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${WEATHER_API_KEY}`)
            .then(response => response.json())
            .then(data => {console.log(data)
                if (data.name) {
                    setCurrentCity(data.name)
                }

                if (data.weather && data.weather[0]) {
                    const weatherId = data.weather[0].id
                    // const weatherIcon = data.weather[0].icon

                    setWeatherId(weatherId)
                }

                if (data.main) {
                    const temp = data.main.temp  - 273.15
                    const min = data.main.temp  - 273.15                       
                    const max = data.main.temp_max  - 273.15
                    
                    setCurrentTemp(temp)
                    setMinTemp(min)
                    setMaxTemp(max)
                }

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
        if (coordinates) {
            handleFetchDataFromOpenWeatherApi(coordinates)
        }
    }, [coordinates])
    

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <WeatherGradient weatherId={weatherId} isDaytime={isDaytime} />
            
            <View style={styles.container}>
                <View style={styles.containerSearch}>
                    <GooglePlacesAutocomplete
                        placeholder="Digite o nome de uma cidade"
                        fetchDetails={true}
                        onPress={(data, details = null) => {
                            if (details) {
                                setCurrentCity(data.description)
                                setCoordinates({
                                    lat: details.geometry.location.lat,
                                    lon: details.geometry.location.lng, // longitude on this attribute is "lng" and not "lon"
                                })
                                setSearchText('')
                            }
                        }}
                        currentLocationLabel={currentCity}
                        query={{
                            key: GOOGLE_API_KEY,
                            language: 'pt',
                            types: 'geocode',
                        }}
                        styles={{
                            textInput: {
                                height: 44,
                                borderColor: '#ddd',
                                borderWidth: 1,
                                borderRadius: 5,
                                paddingHorizontal: 10,
                            },
                        }}
                        textInputProps={{
                            value: searchText,
                            onChangeText: (text: string) => setSearchText(text),
                        }}
                    />
                </View>

                <View style={styles.content}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', /*backgroundColor: 'pink'*/ }}>
                        <TouchableOpacity onPress={()=>{}} style={{ margin: 16, justifyContent: 'center', alignItems: 'center', gap: 8, flexDirection: 'row' }}>
                            <Ionicons 
                                name="settings-outline"
                                style={{
                                    fontSize: 32,
                                    color: "#FFF",
                                }} 
                            />

                            <View>
                                <Text style={styles.textButton}>Gerenciar</Text>
                                <Text style={styles.textButton}>Favoritos</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={toggleFavorite} style={{  margin: 16, justifyContent: 'center', alignItems: 'center', gap: 8, flexDirection: 'row' }}>
                            <Ionicons 
                                name={cityIsInFavorites() ? "heart" : "heart-outline"} 
                                style={{
                                    fontSize: 32,
                                    color: cityIsInFavorites() ? '#F00': '#FFF',
                                }} 
                            />

                            <View>
                                <Text style={styles.textButton}>Salvar no</Text>
                                <Text style={styles.textButton}>Favoritos</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.containerWeatherInfo}>
                        <View style={styles.header}>
                            <Ionicons name="location-outline" style={styles.locationIcon} />
                            <Text style={styles.locationText}>{currentCity}</Text>
                        </View>

                        <WeatherInfo 
                            weatherId={weatherId}
                            currentTemp={currentTemp}
                            minTemp={minTemp}
                            maxTemp={maxTemp}
                            isDaytime={isDaytime}
                        />
                    </View>

                    

                    <View style={styles.containerNextFiveDays}>
                        <Text>Test</Text>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        marginTop: 32,
        paddingTop: 32,
        zIndex: 1,
        gap: 16,
    },
    containerSearch: {
        position: 'absolute', 
        alignSelf: 'center', 
        zIndex: 1, 
        width: '100%', 
        flex: 1
    },
    content: {
        flex: 1, 
        marginTop: 25, 
        marginBottom: 15, 
        backgroundColor: 'green'
    },
    containerWeatherInfo: {
        flex: 3, 
        alignItems: 'center', 
        justifyContent: 'center',
    },
    containerNextFiveDays: {
        flex: 1, 
        backgroundColor: 'purple'
    },


    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        gap: 8,
    },
    locationIcon: {
        fontSize: 24,
        color: '#FFF'
    },
    locationText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF'
    },

    textButton: {
        color: '#FFF',
        fontSize: 10
    }
})
