import React from 'react'
import { View, Text, StyleSheet, Image, Platform } from 'react-native'
import { WeatherDataList } from '../types/openWeatherMap'

interface Props {
  data: WeatherDataList
}

export function WeatherCard({ data }: Props) {
    const description = data?.weather[0].description
    const icon = data?.weather[0].icon

    const temp = data?.main.temp
    const temp_min = data?.main.temp_min
    const temp_max = data?.main.temp_max
    const feels_like = data?.main.feels_like
    const humidity = data?.main.humidity
    const pressure = data?.main.pressure   

    const date = new Date(data?.dt * 1000)
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    const formattedDate = `${day}/${month}/${year}`;

    function capitalizeWords(description: string) {
      return description.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }

    return (
        <View style={styles.card}>
            <Image
                style={styles.icon}
                source={{ uri: `https://openweathermap.org/img/wn/${icon}@2x.png` }}
            />

            <Text style={styles.description}>{capitalizeWords(description)}</Text>

            <Text style={styles.textLarge}>{`${Math.trunc(temp)}°C`}</Text>

            <Text style={styles.textMedium}>{formattedDate}</Text>

            <View style={{ flexDirection: 'row', columnGap: 16, flexWrap: 'wrap' }}>
                <Text style={styles.textSmallBold}>
                    <Text style={styles.textSmall}>Min: </Text>{Math.floor(temp_min)}°C
                </Text>

                <Text style={styles.textSmallBold}>
                    <Text style={styles.textSmall}>Max: </Text>{Math.ceil(temp_max)}°C
                </Text>

                {/* Sensação térmica */}
                <Text style={styles.textSmallBold}>
                    <Text style={styles.textSmall}>ST: </Text>{Math.trunc(feels_like)}°C
                </Text>

                {/* Umidade relativa do ar */}
                <Text style={styles.textSmallBold}>
                    <Text style={styles.textSmall}>UR: </Text>{humidity}%
                </Text>

                {/* Pressão atmosférica ao nível do mar */}
                <Text style={styles.textSmallBold}>
                    <Text style={styles.textSmall}>PNM: </Text>{pressure} hPa
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF66',
        padding: 16,
        borderRadius: 10,
        width: 170,
        marginRight: 16,
    },
    textLarge: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    textMedium: {
        fontSize: 14,
    },
    textSmall: {
        fontSize: 10,
        fontWeight: 'normal',
    },
    textSmallBold: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 14,
        fontStyle: 'italic',
    },
    icon: {
        width: 40,
        height: 40,
    },
})
