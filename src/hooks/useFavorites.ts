import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface MyFavorites {
  name: string;
  data: {
    base: string;
    clouds: {
      all: number;
    };
    cod: number;
    coord: {
      lat: number;
      lon: number;
    };
    dt: number;
    id: number;
    main: {
      feels_like: number;
      grnd_level: number;
      humidity: number;
      pressure: number;
      sea_level: number;
      temp: number;
      temp_max: number;
      temp_min: number;
    };
    name: string;
    sys: {
      country: string;
      sunrise: number;
      sunset: number;
    };
    timezone: number;
    visibility: number;
    weather: {
      description: string;
      icon: string;
      id: number;
      main: string;
    }[];
    wind: {
      deg: number;
      gust: number;
      speed: number;
    };
  } | null;
}

export const storageName = "@myFavorites";

async function saveFavorites(favorites: MyFavorites[]) {
  try {
    const jsonValue = JSON.stringify(favorites);
    await AsyncStorage.setItem(storageName, jsonValue);
  } catch (e) {
    console.error("Error saving favorites:", e);
  }
}

async function loadFavorites(): Promise<MyFavorites[]> {
  try {
    const jsonValue = await AsyncStorage.getItem(storageName);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error("Error loading favorites:", e);
    return [];
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<MyFavorites[]>([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      const loadedFavorites = await loadFavorites();
      setFavorites(loadedFavorites);
    };

    fetchFavorites();
  }, []);

  const addFavorite = (favorite: MyFavorites) => {
    setFavorites((prevFavorites) => {
      const newFavorites = [...prevFavorites, favorite];
      saveFavorites(newFavorites);
      return newFavorites;
    });
  };

  const removeFavorite = (name: string) => {
    setFavorites((prevFavorites) => {
      const newFavorites = prevFavorites.filter((item) => item.name !== name);
      saveFavorites(newFavorites);
      return newFavorites;
    });
  };

  const cityIsInFavorites = (name: string): boolean => {
    return favorites.some((item) => item.name === name);
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    cityIsInFavorites,
  };
}
