//import "../_mockLocation";
import React, { useContext, useCallback, useState, useRef } from "react";
import { StyleSheet, Text, Dimensions, ScrollView, View } from "react-native";
import { Card, Button, Image } from "react-native-elements";
import MapView, { Circle, Polyline, Marker } from "react-native-maps";
import LandmarksDeck from "../components/LandmarksDeck";
import useLocation from "../hooks/useLocation";
import { Context as TrackContext } from "../context/TrackContext";
import { Context as LocationContext } from "../context/LocationContext";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const TrackDetailScreen = ({ route, navigation }) => {
  const [scroll, setScroll] = useState(true);
  const [selectedMarker, setSelectedMarker] = useState(null);
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

  const controlScroll = (value) => {
    value === true ? setScroll(true) : setScroll(false);
  };

  const landmarkToMarker = (landmarkId) => {
    setSelectedMarker(landmarkId);
  };

  const scrollRef = useRef();
  const markerRef = useRef();

  return (
    <View style={styles.trackView}>
      <ScrollView
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
        scrollEnabled={scroll}
        ref={scrollRef}
        onScrollEndDrag={({ nativeEvent }) => {
          nativeEvent.contentOffset.y >= SCREEN_WIDTH / 1.5
            ? scrollRef.current.scrollToEnd({
                animated: true,
              })
            : null;
        }}
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
                  key={marker._id}
                  coordinate={marker.coords}
                  title={marker.name}
                  pinColor={marker._id !== selectedMarker ? "red" : "green"}
                  ref={markerRef}
                  onPress={() => {
                    setSelectedMarker(marker._id);
                  }}
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
        <Text style={styles.description} selectable>
          {track.description}
        </Text>
        {track.landmarks.length ? (
          <LandmarksDeck
            data={track.landmarks}
            controlScroll={controlScroll}
            track={track}
            markerToLandmark={selectedMarker}
            landmarkToMarker={landmarkToMarker}
          />
        ) : null}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  trackView: {
    padding: 20,
    backgroundColor: "white",
    flex: 1,
  },
  map: {
    width: 0.9 * SCREEN_WIDTH,
    height: 0.9 * SCREEN_WIDTH,
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
  landmarkView: {
    height: 250,
  },
});

export default TrackDetailScreen;
