// WeatherInfo.tsx
import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import WeatherIcon from './WeatherIcon'

type WeatherProps = {
    weather: 'clear' | 'cloudy' | 'rainy' | 'snowing' | 'storm' | 'wind' | 'drizzling' | 'overcast'
    currentTemp: number
    minTemp: number
    maxTemp: number
    isDaytime: boolean
}

export function WeatherInfo({ weather, currentTemp, minTemp, maxTemp, isDaytime }: WeatherProps) {
    return (
        <View style={styles.container}>
            <View>
                <WeatherIcon weather={weather} isDaytime={isDaytime} />
            </View>

            <View style={styles.tempContainer}>
                <Text style={[styles.tempText, styles.tempTitle]}>
                    {currentTemp}ºC
                </Text>

                <View style={styles.tempTextContainer}>
                    <Text style={styles.labelText}>
                        Máxima.: <Text style={styles.tempText}>{maxTemp}ºC</Text>
                    </Text>
                    <Text style={styles.labelText}>
                        Mínima: <Text style={styles.tempText}>{minTemp}ºC</Text>
                    </Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    tempContainer: {
        justifyContent: 'center',
    },
    tempTitle: {
        fontSize: 80,
    },
    tempTextContainer: {
        alignItems: 'center',
        padding: 10,
        gap: 8,
    },
    labelText: {
        fontSize: 14,
        color: '#FFFFFF',
    },
    tempText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
})

export default WeatherInfo
