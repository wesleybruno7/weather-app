import React, { useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { MyFavorites } from '../hooks/useFavorites'

interface WeatherGradient {
    weatherForecastData: MyFavorites['data']
    isDaytime: boolean
}

export function WeatherGradient({ weatherForecastData, isDaytime }: WeatherGradient) {
    const [weatherId, setWeatherId] = useState<number>(800)
    const [currentGradientColor, setCurrentGradientColor] = useState<[string, string]>(['#444DF4', '##B0C4DE'])

    const weatherIdToColors = (id: number, isDaytime: boolean): [string, string] => {
        const baseColor = '#444DF4'
        
        let color
    
        switch (id) {
            case 200: case 201: case 202: case 210: case 211: case 212: case 221: case 230: case 231: case 232: // Thunderstorm
                color = isDaytime ? '#2F4F4F' : '#1C1C1C'
                break
            case 300: case 301: case 302: case 310: case 311: case 312: case 313: case 314: case 321: // Drizzle
                color = isDaytime ? '#A9A9A9' : '#696969'
                break
            case 500: case 501: case 502: case 503: case 504: // Rain
                color = isDaytime ? '#2F2F2F' : '#1C1C1C'
                break
            case 511: // Freezing Rain
                color = isDaytime ? '#B0E0E6' : '#A9A9A9'
                break
            case 520: case 521: case 522: case 531: // Shower Rain
                color = isDaytime ? '#A9A9A9' : '#696969'
                break
            case 600: case 601: case 602: case 611: case 612: case 613: case 615: case 616: case 620: case 621: case 622: // Snow
                color = isDaytime ? '#B0E0E6' : '#A9A9A9'
                break
            case 701: case 711: case 721: case 731: case 741: case 751: case 761: case 762: case 771: case 781: // Atmosphere
                color = isDaytime ? '#B0C4DE' : '#696969'
                break
            case 800: // Clear
                color = isDaytime ? '#87CEFA' : '#1C1C1C'
                break
            case 801: // Few Clouds
                color = isDaytime ? '#B0C4DE' : '#696969'
                break
            case 802: // Scattered Clouds
                color = isDaytime ? '#B0C4DE' : '#696969'
                break
            case 803: case 804: // Broken Clouds
                color = isDaytime ? '#B0C4DE' : '#696969'
                break
            default:
                color = '#B0C4DE'
                break
        }
    
        return [baseColor, color]
    }

    useEffect(() => {
        const id = weatherForecastData?.id || 800
        setWeatherId(id)

        const newGradientColor = weatherIdToColors(id, isDaytime)
        setCurrentGradientColor(newGradientColor)
    }, [weatherId, isDaytime])

    return (
        <LinearGradient 
            colors={currentGradientColor}
            style={styles.gradient}
        />
    )
}

const styles = StyleSheet.create({
    gradient: {
        ...StyleSheet.absoluteFillObject,
    },
})

export default WeatherGradient
