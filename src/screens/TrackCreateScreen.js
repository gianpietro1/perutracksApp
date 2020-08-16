//import "../_mockLocation";
import React, { useContext, useCallback } from "react";
import {
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { Card } from "react-native-elements";
import { useIsFocused } from "@react-navigation/native";
import { Context as LocationContext } from "../context/LocationContext";
import Map from "../components/Map";
import useLocation from "../hooks/useLocation";
import TrackForm from "../components/TrackForm";

const TrackCreateScreen = ({ navigation }) => {
  const isFocused = useIsFocused();

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

  const goBack = () => {
    navigation.pop();
  };

  const [err] = useLocation(isFocused || recording, callback);

  return (
    <KeyboardAvoidingView
      style={{ flexDirection: "column" }}
      behavior={Platform.OS === "ios" ? "padding" : null}
      enabled
      keyboardVerticalOffset={100}
    >
      <Card>
        <ScrollView
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
        >
          <Map />
          {err ? <Text>Please enable location services.</Text> : null}
          <TrackForm goBack={goBack} />
        </ScrollView>
      </Card>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({});

export default TrackCreateScreen;
