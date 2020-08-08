import React, { useContext } from "react";
import { StyleSheet, Text } from "react-native";
import { Card, Button } from "react-native-elements";

import { Context as TrackContext } from "../context/TrackContext";
import MapView, { Polyline } from "react-native-maps";

const TrackDetailScreen = ({ route, navigation }) => {
  const { state } = useContext(TrackContext);
  const { _id } = route.params;

  const track = state.find((t) => t._id === _id);
  const initialCoords = track.locations[0].coords;
  const lastCoords = track.locations[track.locations.length - 1].coords;

  const latidudeDelta = Math.abs(
    Math.max(lastCoords.latitude, initialCoords.latitude) -
      Math.min(lastCoords.latitude, initialCoords.latitude)
  );

  const longitudeDelta = Math.abs(
    Math.max(lastCoords.longitude, initialCoords.longitude) -
      Math.min(lastCoords.longitude, initialCoords.longitude)
  );

  const midPointLat = (lastCoords.latitude + initialCoords.latitude) / 2;
  const midPointLong = (lastCoords.longitude + initialCoords.longitude) / 2;

  const midPoint = {
    accuracy: 0,
    altitude: 0,
    heading: -1,
    latitude: midPointLat,
    longitude: midPointLong,
    speed: 0,
  };

  return (
    <Card>
      <MapView
        style={styles.map}
        initialRegion={{
          ...initialCoords,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        region={{
          ...midPoint,
          latitudeDelta: latidudeDelta * 3,
          longitudeDelta: longitudeDelta * 3,
        }}
      >
        <Polyline coordinates={track.locations.map((loc) => loc.coords)} />
      </MapView>
      <Button containerStyle={styles.button} title={"Iniciar"}></Button>
      <Text style={styles.description}>{track.description}</Text>
    </Card>
  );
};

const styles = StyleSheet.create({
  map: {
    height: 300,
  },
  description: {
    color: "#3f3f3f",
  },
  button: {
    marginVertical: 10,
  },
});

export default TrackDetailScreen;
