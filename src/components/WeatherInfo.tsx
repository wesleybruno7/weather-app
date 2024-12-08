import React from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'

interface Props {
    data: any
}

export function WeatherInfo({ data }: Props) {
    const temp = data?.main?.temp
    const temp_min = data?.main?.temp_min
    const temp_max = data?.main?.temp_max

    const icon = data?.weather[0]?.icon
    const description = data?.weather[0]?.description

    function capitalizeWords(description: string) {
        return description?.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }

    return (
        <View style={styles.container}>
            <Image
                style={styles.icon}
                source={{ uri: `https://openweathermap.org/img/wn/${icon}@4x.png` }}
            />

            <View style={styles.tempTextContainer}>
                <Text style={styles.tempText}>{capitalizeWords(description)}</Text>
            </View>

            <View style={styles.tempContainer}>
                <Text style={[styles.tempText, styles.tempTitle]}>
                    { Math.trunc(temp) }ºC
                </Text>

                <View style={styles.tempTextContainer}>
                    <Text style={styles.labelText}>
                        Máxima.: <Text style={styles.tempText}>{ Math.ceil(temp_max) }ºC</Text>
                    </Text>
                    <Text style={styles.labelText}>
                        Mínima: <Text style={styles.tempText}>{ Math.floor(temp_min) }ºC</Text>
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
        padding: 32,
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

    icon: {
        width: 120,
        height: 120,
    },
})

export default WeatherInfo
