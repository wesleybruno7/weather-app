import React from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'

interface Props {
  weatherData: any
}

export function WeatherCard({ weatherData }: Props) {

  console.log('weatherData =>', weatherData)

    const { dt_txt, weather } = weatherData
    const { temp, temp_min, temp_max } = weatherData.main
    const { description, icon } = weather[0]

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

            <Text style={styles.title}>{dt_txt.split(' ')[0]}</Text>

            <Text style={styles.temp}>{`Temp: ${Math.trunc(temp)}°C`}</Text>
            
            <View style={{ flexDirection: 'row', gap: 16 }}>
              <Text style={styles.temp}>{`Min: ${Math.floor(temp_min)}°C`}</Text>
              <Text style={styles.temp}>{`Max: ${Math.ceil(temp_max)}°C`}</Text>
            </View>
            
            <Text style={styles.temp}>{`Max: ${temp_max}°C`}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF66',
        padding: 16,
        marginVertical: 10,
        borderRadius: 10,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        width: 200,
        // height: 200,
        marginRight: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    temp: {
        fontSize: 12,
    },
    description: {
        fontSize: 14,
        fontStyle: 'italic',
    },
    icon: {
        width: 60,
        height: 60,
    },
})
