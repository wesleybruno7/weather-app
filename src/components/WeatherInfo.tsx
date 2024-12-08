import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import { weatherDataCity, WeatherDataList } from '../types/openWeatherMap'

interface Props {
    data: {
        list: WeatherDataList[],
        city: weatherDataCity,
    } | null
}

export function WeatherInfo({ data }: Props) {   
    const city = data?.city

    const temp = data?.list[0].main.temp
    const temp_min = data?.list[0].main.temp_min
    const temp_max = data?.list[0].main.temp_max

    const icon = data?.list[0].weather[0].icon
    const description = data?.list[0].weather[0].description

    let formattedDate = ''

    if (data?.list[0].dt) {
        const date = new Date(data?.list[0].dt * 1000)
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        formattedDate = `${day}/${month}/${year}`;
    }

    function capitalizeWords(description: string | undefined) {
        let result = ''

        if (description) {
            result = description?.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
        }
        
        return result
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Ionicons name="location-outline" style={styles.headerIcon} />

                <Text style={styles.headerText}>
                    {city?.name}
                </Text>
            </View>
            
            <View style={styles.tempTextContainer}>
                <Image
                    style={styles.icon}
                    source={{ uri: `https://openweathermap.org/img/wn/${icon}@4x.png` }}
                />
                
                <Text style={[styles.tempTextMedium, styles.fontItalic]}>{capitalizeWords(description)}</Text>

                {
                    formattedDate &&
                    <Text style={styles.tempTextDate}>{ formattedDate }</Text>       
                }
            </View>

            <View style={styles.tempTextMediumContainer}>
                {
                    temp && 
                    <Text style={styles.tempTextLarge}>
                        { Math.trunc(temp) }ºC
                    </Text>
                }
                
                {
                    temp_max &&
                    <Text style={styles.tempTextSmall}>
                        Máxima.: <Text style={styles.tempTextMedium}>{ Math.ceil(temp_max) }ºC</Text>
                    </Text>
                }
                {
                    temp_min &&
                    <Text style={styles.tempTextSmall}>
                        Mínima: <Text style={styles.tempTextMedium}>{ Math.floor(temp_min) }ºC</Text>
                    </Text>                
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
    },
    headerIcon: {
        fontSize: 24,
        color: '#FFF'
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
        paddingRight: 8,
    },

    tempTextMediumContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    tempTextContainer: {
        alignItems: 'center',
        padding: 10,
    },
    tempTextLarge: {
        fontSize: 72,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    tempTextMedium: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    tempTextSmall: {
        fontSize: 12,
        color: '#FFFFFF',
    },

    icon: {
        width: 100,
        height: 100,
    },
    fontItalic: {
        fontStyle: 'italic'
    },
    tempTextDate: {
        fontSize: 20,
        color: '#FFFFFF',
    }
})

export default WeatherInfo
