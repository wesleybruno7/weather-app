import { Ionicons, FontAwesome5 } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import Sun from '../../assets/01d.svg'
import Moon from '../../assets/01n.svg'

import Sun2 from '../../assets/02d.svg'
import Moon2 from '../../assets/02n.svg'

export function Home() {
    type WeatherType = 'sunny' | 'down' | 'rainy' | 'dusk' | 'cold'

    const dynamicGradientWeatherColors: Record<string, readonly [string, string]> = {
        sunny: ['#444DF4', '#87CEFA'],
        down: ['#444DF4', '#FFAB4C'],
        rainy: ['#444DF4', '#2F2F2F'],
        dusk: ['#444DF4', '#FF5E57'],
        cold: ['#444DF4', '#00FFFF'],
    }

    type ChevronIcon = 'chevron-down-outline' | 'chevron-up-outline'
    const dynamicChevronIcon: ChevronIcon[] = ["chevron-down-outline", "chevron-up-outline"]

    const [weather, setWeather] = useState<WeatherType>('cold')
    const [toogleIcon, setToogleIcon] = useState(dynamicChevronIcon[0])

    const currentDate = new Date()
    const currentHour = currentDate.getHours()
    const isDaytime = currentHour >= 6 && currentHour < 18

    return (
        <LinearGradient 
            colors={dynamicGradientWeatherColors[weather]}
            style={styles.container}
        >
            <View style={styles.content}>
                <View style={styles.header}>
                    <Ionicons name="location-outline" style={styles.icon} />
                    <Text>São José do Rio Preto</Text>
                    <Ionicons name={toogleIcon} style={styles.icon} />
                </View> 

                <View>
                    <Text>Bom dia</Text>

                    {
                        isDaytime ? <Sun /> : <Moon />
                    }

                    <Text>21ºC</Text>
                    <Text>Max.: 31ºC</Text>
                    <Text>Min.: 25ºC</Text>
                </View>
            </View>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingTop: 40,
    paddingHorizontal: 35,
    alignContent: 'center'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  icon: {
    color: '#fff',
    fontSize: 32,
  },
  
})
