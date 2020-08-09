import React, { useContext, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Input, Button, ListItem } from "react-native-elements";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Spacer from "./Spacer";
import { Context as LocationContext } from "../context/LocationContext";
import useSaveTrack from "../hooks/useSaveTrack";
import { TouchableOpacity } from "react-native-gesture-handler";

const TrackForm = () => {
  const {
    state: { name, recording, locations, landmarks, currentLocation },
    startRecording,
    stopRecording,
    changeName,
    addLandmark,
  } = useContext(LocationContext);

  const [saveTrack] = useSaveTrack();

  const [landmarkName, setLandmarkName] = useState();

  const storeLandmark = () => {
    addLandmark(currentLocation, landmarkName);
    setLandmarkName("");
  };

  const renderLandmarks = () => {
    return (
      <>
        <View style={styles.dividerView}>
          <Text style={styles.dividerText}>PUNTOS DE INTERÉS</Text>
        </View>
        {landmarks.map((item) => {
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
    <>
      <Spacer>
        <Input
          placeholder="Nombre de ruta"
          onChangeText={changeName}
          value={name}
        />
      </Spacer>
      <Spacer>
        {recording ? (
          <>
            <Button
              buttonStyle={{ backgroundColor: "#dc3545" }}
              title="Pausar / Terminar"
              onPress={stopRecording}
            />
            <View style={styles.landmarkInputView}>
              <Input
                placeholder="Nombre"
                onChangeText={setLandmarkName}
                value={landmarkName}
              />
              <TouchableOpacity onPress={storeLandmark}>
                <MaterialCommunityIcons
                  name="map-marker-plus"
                  size={24}
                  color="black"
                />
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <Button title="(re)Iniciar Ruta" onPress={startRecording} />
        )}
      </Spacer>
      <Spacer>
        {!recording && locations.length ? (
          <Button
            buttonStyle={{ backgroundColor: "purple" }}
            title="Guardar Ruta"
            onPress={saveTrack}
          />
        ) : null}
        {landmarks.length ? renderLandmarks() : null}
      </Spacer>
    </>
  );
};

const styles = StyleSheet.create({
  landmarkInputView: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-around",
  },
  landmarkListView: {
    flexDirection: "row",
    alignItems: "baseline",
    marginVertical: 5,
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

export default TrackForm;
