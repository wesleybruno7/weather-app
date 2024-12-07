import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import WeatherIcon from './WeatherIcon'

import { MyFavorites } from '../hooks/useFavorites'

interface WeatherProps {
    weatherForecastData: MyFavorites['data']
    isDaytime: boolean
}

export function WeatherInfo({ weatherForecastData, isDaytime }: WeatherProps) {

    const [weatherId, setWeatherId] = useState<number>(800)

    const [currentTemp, setCurrentTemp] = useState<number>(0)
    const [minTemp, setMinTemp] = useState<number>(0)
    const [maxTemp, setMaxTemp] = useState<number>(0)

    useEffect(() => {
        setWeatherId(weatherForecastData?.id || 800)
        setCurrentTemp(weatherForecastData?.main?.temp || 0)
        setMinTemp(weatherForecastData?.main?.temp_min || 0)
        setMaxTemp(weatherForecastData?.main?.temp_max || 0)
    }, [weatherForecastData])

    return (
        <View style={styles.container}>
            <View>
                <WeatherIcon weatherId={weatherId} isDaytime={isDaytime} size={120} />
            </View>

            <View style={styles.tempContainer}>
                <Text style={[styles.tempText, styles.tempTitle]}>
                    { Math.trunc(currentTemp) }ºC
                </Text>

                <View style={styles.tempTextContainer}>
                    <Text style={styles.labelText}>
                        Máxima.: <Text style={styles.tempText}>{ Math.ceil(maxTemp) }ºC</Text>
                    </Text>
                    <Text style={styles.labelText}>
                        Mínima: <Text style={styles.tempText}>{ Math.floor(minTemp) }ºC</Text>
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
        height: 350,
    },
    tempContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    tempTitle: {
        fontSize: 64,
    },
    tempTextContainer: {
        alignItems: 'center',
        padding: 10,
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
