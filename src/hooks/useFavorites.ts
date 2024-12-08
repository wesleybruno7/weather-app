import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { weatherDataCity, WeatherDataList } from "../types/openWeatherMap";

export interface MyFavorites {
  list: WeatherDataList[];
  city: weatherDataCity;
}

export const storageName = "@myFavorites";

async function clearFavorites() {
  try {
    await AsyncStorage.removeItem(storageName);
    console.log("Favorites cleared successfully");
  } catch (e) {
    console.error("Error clearing favorites:", e);
  }
}

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

  const reloadFavorites = async () => {
    const loadedFavorites = await loadFavorites();
    setFavorites(loadedFavorites);
  };

  const addFavorite = (favorite: MyFavorites) => {
    setFavorites((prevFavorites) => {
      const newFavorites = [...prevFavorites, favorite];
      saveFavorites(newFavorites);
      return newFavorites;
    });
  };

  const removeFavorite = (name: string) => {
    setFavorites((prevFavorites) => {
      const newFavorites = prevFavorites.filter(
        (item) => item.city.name !== name
      );
      saveFavorites(newFavorites);
      return newFavorites;
    });
  };

  const cityIsInFavorites = (name: string | undefined): boolean => {
    return favorites.some((item) => item?.city?.name === name) || false;
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    cityIsInFavorites,
    reloadFavorites,
  };
}
