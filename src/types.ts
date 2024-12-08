import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";

export type RootStackParamList = {
  Home: { city: string };
  Favorites: undefined;
};

export type NavigationProps<RouteName extends keyof RootStackParamList> = {
  navigation: NativeStackNavigationProp<RootStackParamList, RouteName>;
  route?: RouteProp<RootStackParamList, RouteName>;
};
