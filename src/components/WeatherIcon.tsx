import React from 'react'
import Overcast from '../assets/overcast.svg'
import MoonCloudy from '../assets/moon-cloudy.svg'
import MoonDrizzling from '../assets/moon-drizzling.svg'
import MoonRaining from '../assets/moon-raining.svg'
import MoonSnowing from '../assets/moon-snowing.svg'
import MoonStorm from '../assets/moon-storm.svg'
import MoonWind from '../assets/moon-wind.svg'
import Moon from '../assets/moon.svg'
import SunCloudy from '../assets/sun-cloudy.svg'
import SunDrizzling from '../assets/sun-drizzling.svg'
import SunRaining from '../assets/sun-raining.svg'
import SunSnowing from '../assets/sun-snowing.svg'
import SunStorm from '../assets/sun-storm.svg'
import SunWind from '../assets/sun-wind.svg'
import Sun from '../assets/sun.svg'

type WeatherIconProps = {
    weather: 'clear' | 'cloudy' | 'rainy' | 'snowing' | 'storm' | 'wind' | 'drizzling' | 'overcast'
    isDaytime: boolean
}

export function WeatherIcon({ weather, isDaytime }: WeatherIconProps) {
    if (isDaytime) {
        switch (weather) {
            case 'clear':
                return <Sun />
            case 'cloudy':
                return <SunCloudy />
            case 'rainy':
                return <SunRaining />
            case 'snowing':
                return <SunSnowing />
            case 'storm':
                return <SunStorm />
            case 'wind':
                return <SunWind />
            case 'drizzling':
                return <SunDrizzling />
            case 'overcast':
                return <Overcast />
            default:
                return null
        }
    } else {
        switch (weather) {
            case 'clear':
                return <Moon />
            case 'cloudy':
                return <MoonCloudy />
            case 'rainy':
                return <MoonRaining />
            case 'snowing':
                return <MoonSnowing />
            case 'storm':
                return <MoonStorm />
            case 'wind':
                return <MoonWind />
            case 'drizzling':
                return <MoonDrizzling />
            case 'overcast':
                return <Overcast />
            default:
                return null
        }
    }
}

export default WeatherIcon
