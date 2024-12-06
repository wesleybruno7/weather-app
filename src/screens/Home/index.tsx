import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useState } from 'react'
import { SafeAreaView, StyleSheet, Text, View } from 'react-native'

import WeatherInfo from '../../components/WeatherInfo'

export function Home() {
    type WeatherType = 'clear' | 'cloudy' | 'rainy' | 'snowing' | 'storm' | 'wind' | 'drizzling' | 'overcast'

    const [weather, setWeather] = useState<WeatherType>('clear')
    const [currentTemp, setCurrentTemp] = useState(21)
    const [minTemp, setMinTemp] = useState(18)
    const [maxTemp, setMaxTemp] = useState(31)

    const currentDate = new Date();
    const currentHour = currentDate.getHours();
    const isDaytime = currentHour >= 6 && currentHour < 18;

    const dynamicGradientWeatherColors: Record<string, readonly [string, string, string]> = isDaytime ? {
        clear: ['#444DF4', '#87CEFA', '#FFFFFF'],
        cloudy: ['#444DF4', '#B0C4DE', '#D3D3D3'],
        rainy: ['#444DF4', '#2F2F2F', '#A9A9A9'],
        snowing: ['#444DF4', '#B0E0E6', '#F0F8FF'],
        storm: ['#444DF4', '#2F4F4F', '#A9A9A9'],
        wind: ['#444DF4', '#6EC1E4', '#B0E57C'],
        drizzling: ['#444DF4', '#A9A9A9', '#D3D3D3'],
        overcast: ['#444DF4', '#808080', '#A9A9A9'],
    } : {
        clear: ['#2C3E50', '#444DF4', '#87CEFA'],
        cloudy: ['#2C3E50', '#444DF4', '#B0C4DE'],
        rainy: ['#2C3E50', '#444DF4', '#2F2F2F'],
        snowing: ['#2C3E50', '#444DF4', '#B0E0E6'],
        storm: ['#2C3E50', '#444DF4', '#2F4F4F'],
        wind: ['#2C3E50', '#444DF4', '#6EC1E4'],
        drizzling: ['#2C3E50', '#444DF4', '#A9A9A9'],
        overcast: ['#2C3E50', '#444DF4', '#808080'],
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <LinearGradient 
                colors={dynamicGradientWeatherColors[weather]}
                style={styles.backgroundGradient}
            />
            
            <View style={styles.container}>
                <View style={styles.header}>
                    <Ionicons name="location-outline" style={styles.locationIcon} />
                    <Text style={styles.locationText}>São José do Rio Preto</Text>
                    <Ionicons name="chevron-down-outline" style={styles.locationIcon} />
                </View>

                <WeatherInfo 
                    weather={weather}
                    currentTemp={currentTemp}
                    minTemp={minTemp}
                    maxTemp={maxTemp}
                    isDaytime={isDaytime}
                />

                <View style={styles.content}>
                    <Text>Test</Text>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    backgroundGradient: {
        ...StyleSheet.absoluteFillObject,
    },
    container: {
        flex: 1,
        paddingHorizontal: 16,
        marginTop: 32,
        paddingTop: 32,
        zIndex: 1,
        gap: 16,
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
    content: {
        flex: 1,
        marginVertical: 16,
        backgroundColor: 'purple',
    },
})
