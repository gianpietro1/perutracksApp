import React, { useContext, useCallback } from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-elements";
import { Context as LocationContext } from "../context/LocationContext";
import Map from "../components/Map";
import useLocation from "../hooks/useLocation";
import TrackForm from "../components/TrackForm";
import { FontAwesome } from "@expo/vector-icons";

const TrackCreateScreen = ({ isFocused }) => {
  const {
    state: { recording },
    addLocation,
  } = useContext(LocationContext);
  const callback = useCallback(
    (location) => {
      addLocation(location, recording);
    },
    [recording]
  );
  const [err] = useLocation(isFocused || recording, callback);
  console.log(err);
  return (
    <View>
      <Map />
      {err ? <Text>Please enable location services.</Text> : null}
      <TrackForm />
    </View>
  );
};

const styles = StyleSheet.create({});

export default TrackCreateScreen;