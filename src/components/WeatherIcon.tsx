import React from 'react'
import ClearDay from '../assets/01d.svg'
import ClearNight from '../assets/01n.svg'
import FewCloudsDay from '../assets/02d.svg'
import FewCloudsNight from '../assets/02n.svg'
import ScatteredCloudsDay from '../assets/03.svg'
import ScatteredCloudsNight from '../assets/03.svg'
import BrokenCloudsDay from '../assets/04.svg'
import BrokenCloudsNight from '../assets/04.svg'
import ShowerRainDay from '../assets/09d.svg'
import ShowerRainNight from '../assets/09n.svg'
import RainDay from '../assets/10d.svg'
import RainNight from '../assets/10n.svg'
import ThunderstormDay from '../assets/11d.svg'
import ThunderstormNight from '../assets/11n.svg'
import SnowDay from '../assets/13d.svg'
import SnowNight from '../assets/13n.svg'
import MistDay from '../assets/50d.svg'
import MistNight from '../assets/50n.svg'

type WeatherIconProps = {
    weatherId: number
    isDaytime: boolean
}

type WeatherCondition = 
    | 'clear'
    | 'few clouds'
    | 'scattered clouds'
    | 'broken clouds'
    | 'shower rain'
    | 'rain'
    | 'thunderstorm'
    | 'snow'
    | 'mist'
    | 'drizzle'

const weatherIdToIcon: { [key: number]: WeatherCondition } = {
    200: 'thunderstorm', 201: 'thunderstorm', 202: 'thunderstorm', 210: 'thunderstorm', 211: 'thunderstorm', 212: 'thunderstorm', 221: 'thunderstorm', 230: 'thunderstorm', 231: 'thunderstorm', 232: 'thunderstorm',
    300: 'drizzle', 301: 'drizzle', 302: 'drizzle', 310: 'drizzle', 311: 'drizzle', 312: 'drizzle', 313: 'drizzle', 314: 'drizzle', 321: 'drizzle',
    500: 'rain', 501: 'rain', 502: 'rain', 503: 'rain', 504: 'rain', 511: 'snow', 520: 'drizzle', 521: 'drizzle', 522: 'drizzle', 531: 'drizzle',
    600: 'snow', 601: 'snow', 602: 'snow', 611: 'snow', 612: 'snow', 613: 'snow', 615: 'snow', 616: 'snow', 620: 'snow', 621: 'snow', 622: 'snow',
    701: 'mist', 711: 'mist', 721: 'mist', 731: 'mist', 741: 'mist', 751: 'mist', 761: 'mist', 762: 'mist', 771: 'mist', 781: 'mist',
    800: 'clear',
    801: 'few clouds', 802: 'scattered clouds', 803: 'broken clouds', 804: 'broken clouds'
}

export function WeatherIcon({ weatherId, isDaytime }: WeatherIconProps) {
    const weatherCondition = weatherIdToIcon[weatherId]

    switch (weatherCondition) {
        case 'clear':
            return isDaytime ? <ClearDay /> : <ClearNight />
        case 'few clouds':
            return isDaytime ? <FewCloudsDay /> : <FewCloudsNight />
        case 'scattered clouds':
            return isDaytime ? <ScatteredCloudsDay /> : <ScatteredCloudsNight />
        case 'broken clouds':
            return isDaytime ? <BrokenCloudsDay /> : <BrokenCloudsNight />
        case 'shower rain':
            return isDaytime ? <ShowerRainDay /> : <ShowerRainNight />
        case 'rain':
            return isDaytime ? <RainDay /> : <RainNight />
        case 'thunderstorm':
            return isDaytime ? <ThunderstormDay /> : <ThunderstormNight />
        case 'snow':
            return isDaytime ? <SnowDay /> : <SnowNight />
        case 'mist':
            return isDaytime ? <MistDay /> : <MistNight />
        case 'drizzle':
            return isDaytime ? <ShowerRainDay /> : <ShowerRainNight />
        default:
            return isDaytime ? <ClearDay /> : <ClearNight />
            // return null
    }
}

export default WeatherIcon
