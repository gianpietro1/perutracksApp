import React from "react";
import { TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { FontAwesome5 } from "@expo/vector-icons";
import { Provider as TrackProvider } from "./src/context/TrackContext";
import { Provider as LocationProvider } from "./src/context/LocationContext";
import HomeScreen from "./src/screens/HomeScreen";
import TrackListScreen from "./src/screens/TrackListScreen";
import TrackDetailScreen from "./src/screens/TrackDetailScreen";
import TrackCreateScreen from "./src/screens/TrackCreateScreen";

const Main = createStackNavigator();

export default function App() {
  return (
    <LocationProvider>
      <TrackProvider>
        <NavigationContainer>
          <Main.Navigator>
            <Main.Screen
              name="Home"
              component={HomeScreen}
              options={{ headerShown: false }}
            />
            <Main.Screen
              name="Tracks"
              component={TrackListScreen}
              options={({ navigation, route }) => ({
                headerTitle: "Rutas",
                headerRight: () => (
                  <TouchableOpacity
                    style={{ marginRight: 10 }}
                    onPress={() => navigation.navigate("TrackCreate")}
                  >
                    <FontAwesome5 name="plus" size={22} />
                  </TouchableOpacity>
                ),
              })}
            />
            <Main.Screen
              name="TrackDetail"
              component={TrackDetailScreen}
              options={({ route }) => ({ title: route.params.name })}
            />
            <Main.Screen
              name="TrackCreate"
              component={TrackCreateScreen}
              options={{ headerTitle: "Nueva ruta" }}
            />
          </Main.Navigator>
        </NavigationContainer>
      </TrackProvider>
    </LocationProvider>
  );
}
