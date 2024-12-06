import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface MyFavorites {
  name: string;
  coordinates: {
    lat: number;
    lon: number;
  };
}

async function saveFavorites(favorites: MyFavorites[]) {
  try {
    const jsonValue = JSON.stringify(favorites);
    await AsyncStorage.setItem("@myFavorites", jsonValue);
  } catch (e) {
    console.error("Error saving favorites:", e);
  }
}

async function loadFavorites(): Promise<MyFavorites[]> {
  try {
    const jsonValue = await AsyncStorage.getItem("@myFavorites");
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

  return { favorites, addFavorite, removeFavorite, cityIsInFavorites };
}
