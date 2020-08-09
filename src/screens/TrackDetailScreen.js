//import "../_mockLocation";
import React, { useContext, useCallback } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { Card, Button, ListItem } from "react-native-elements";
import useLocation from "../hooks/useLocation";
import { Context as TrackContext } from "../context/TrackContext";
import { Context as LocationContext } from "../context/LocationContext";

import MapView, { Circle, Polyline, Marker } from "react-native-maps";

const TrackDetailScreen = ({ route, navigation }) => {
  const { state } = useContext(TrackContext);
  const {
    state: { recording, currentLocation, locations, deltaFactor },
    addLocation,
    startRecording,
    stopRecording,
    reset,
  } = useContext(LocationContext);
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

  const callback = useCallback(
    (location) => {
      addLocation(location, recording);
    },
    [recording]
  );
  const [err] = useLocation(recording, callback);

  const renderLandmarks = () => {
    return (
      <>
        <View style={styles.dividerView}>
          <Text style={styles.dividerText}>PUNTOS DE INTERÉS</Text>
        </View>
        {track.landmarks.map((item) => {
          return (
            <ListItem
              key={item.coords.latitude * Math.random()}
              title={item.name}
              subtitle={`Lat: ${item.coords.latitude.toFixed(
                4
              )}, Long: ${item.coords.longitude.toFixed(4)}`}
              subtitleStyle={{ color: "grey", fontSize: 12 }}
              bottomDivider
            />
          );
        })}
      </>
    );
  };

  return (
    <Card>
      <ScrollView
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
      >
        <MapView
          style={styles.map}
          initialRegion={{
            ...initialCoords,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          region={{
            ...(currentLocation ? currentLocation.coords : midPoint),
            latitudeDelta: latidudeDelta * deltaFactor,
            longitudeDelta: longitudeDelta * deltaFactor,
          }}
        >
          <Marker
            coordinate={initialCoords}
            image={require("../../assets/startArrow.png")}
          />
          <Marker
            coordinate={lastCoords}
            image={require("../../assets/finishFlag.png")}
          />
          <Polyline
            coordinates={track.locations.map((loc) => loc.coords)}
            strokeColor="blue"
            strokeWidth={3}
          />
          {currentLocation ? (
            <Circle
              center={currentLocation.coords}
              radius={30}
              strokeColor="rgba(158,158,255, 1.0)"
              fillColor="rgba(158,158,255, 0.5)"
            />
          ) : null}
          <Polyline
            coordinates={locations.map((loc) => loc.coords)}
            strokeColor="green"
            strokeWidth={3}
          />
          {track.landmarks
            ? track.landmarks.map((marker) => (
                <Marker
                  key={marker.name}
                  coordinate={marker.coords}
                  title={marker.name}
                />
              ))
            : null}
        </MapView>

        {recording ? (
          <Button
            buttonStyle={styles.buttonStop}
            title="Parar"
            onPress={() => {
              stopRecording();
              reset();
            }}
          />
        ) : (
          <Button
            containerStyle={styles.button}
            title="Iniciar"
            onPress={() => {
              startRecording();
            }}
          />
        )}
        <Text style={styles.description}>{track.description}</Text>
        {track.landmarks.length ? renderLandmarks() : null}
      </ScrollView>
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
  buttonStop: {
    marginVertical: 10,
    backgroundColor: "#dc3545",
  },
  dividerText: {
    fontSize: 12,
    color: "#3f3f3f",
    textAlign: "center",
  },
  dividerView: {
    marginTop: 15,
    backgroundColor: "#eaeaea",
    borderRadius: 10,
    padding: 5,
  },
});

export default TrackDetailScreen;
