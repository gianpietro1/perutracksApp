import React, { useContext, useState } from "react";
import { View, StyleSheet, Text, Alert } from "react-native";
import { Input, Button, ListItem, Image } from "react-native-elements";
import { MaterialCommunityIcons } from "@expo/vector-icons";
// import * as ImagePicker from "expo-image-picker";
import Spacer from "./Spacer";
import { Context as LocationContext } from "../context/LocationContext";
import useSaveTrack from "../hooks/useSaveTrack";

const TrackForm = ({ goBack }) => {
  const {
    state: { name, recording, locations, landmarks, currentLocation },
    startRecording,
    stopRecording,
    changeName,
    addLandmark,
    reset,
  } = useContext(LocationContext);

  const [saveTrack] = useSaveTrack();

  const [landmarkName, setLandmarkName] = useState();
  const [landmarkDescription, setLandmarkDescription] = useState();
  // const [landmarkImage, setLandmarkImage] = useState(null);

  const storeLandmark = () => {
    addLandmark(
      currentLocation,
      landmarkName,
      landmarkDescription
      // landmarkImage
    );
    setLandmarkName("");
    setLandmarkDescription("");
  };

  // const pickImage = async () => {
  //   try {
  //     let result = await ImagePicker.launchImageLibraryAsync({
  //       mediaTypes: ImagePicker.MediaTypeOptions.All,
  //       allowsEditing: true,
  //       aspect: [4, 4],
  //       quality: 1,
  //     });
  //     if (!result.cancelled) {
  //       setLandmarkImage(result.uri);
  //     }
  //   } catch (E) {
  //     console.log(E);
  //   }
  // };

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

  const renderLandmarkForm = () => {
    return (
      <>
        <View style={styles.dividerView}>
          <Text style={styles.dividerText}>NUEVO PUNTO DE INTERÉS</Text>
        </View>
        <View style={styles.landmarkInputView}>
          <Input
            placeholder="Nombre"
            onChangeText={setLandmarkName}
            value={landmarkName}
            inputStyle={styles.landmarkInputStyle}
          />
          <Input
            placeholder="Descripción"
            onChangeText={setLandmarkDescription}
            value={landmarkDescription}
            inputStyle={styles.landmarkInputStyle}
          />
          <Button
            icon={
              <MaterialCommunityIcons
                name="map-marker-plus"
                size={20}
                color="black"
              />
            }
            title="Añadir punto de interés"
            titleStyle={{ color: "black", fontSize: 14, marginLeft: 4 }}
            buttonStyle={styles.landmarkButton}
            onPress={landmarkName ? storeLandmark : () => {}}
          ></Button>
        </View>
        {/* <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            padding: 10,
          }}
        >
          {landmarkImage ? (
            <Image
              source={{ uri: landmarkImage }}
              style={{ width: 200, height: 200 }}
            />
          ) : null}
          <Button
            title="Escoger Nueva Foto"
            onPress={pickImage}
            style={{ margin: 5 }}
          />
        </View> */}
      </>
    );
  };

  const renderDecisionButtons = () => {
    return (
      <>
        <Button
          buttonStyle={{ backgroundColor: "purple", marginVertical: 10 }}
          title="Guardar Ruta"
          onPress={saveTrack}
        />
        <Button
          buttonStyle={{ backgroundColor: "#dc3545", marginVertical: 10 }}
          title="Cancelar"
          onPress={resetAll}
        />
      </>
    );
  };

  const resetAll = () => {
    Alert.alert(
      "Cancelar Grabación de Ruta",
      "se borrarán todos los puntos ¿estás seguro?",
      [
        {
          text: "Sí",
          onPress: () => {
            reset();
            goBack();
          },
        },
        { text: "No", onPress: () => null, style: "cancel" },
      ],
      {
        cancelable: true,
      }
    );
  };

  return (
    <>
      <Input
        placeholder="Nombre de ruta"
        onChangeText={changeName}
        value={name}
      />
      {recording ? (
        <>
          <Button
            buttonStyle={{ backgroundColor: "#dc3545", marginBottom: 10 }}
            title="Pausar / Terminar"
            onPress={stopRecording}
          />
          {renderLandmarkForm()}
        </>
      ) : (
        <Button title="(re)Iniciar Ruta" onPress={startRecording} />
      )}
      {!recording && locations.length ? renderDecisionButtons() : null}
      <Spacer />
      {landmarks.length ? renderLandmarks() : null}
    </>
  );
};

const styles = StyleSheet.create({
  landmarkInputView: {
    flexDirection: "column",
    alignItems: "baseline",
    justifyContent: "space-around",
    flex: 1,
    marginHorizontal: 10,
  },
  landmarkInputStyle: {
    fontSize: 16,
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
    marginTop: 5,
    backgroundColor: "#eaeaea",
    borderRadius: 10,
    padding: 5,
  },
  landmarkButton: {
    backgroundColor: "white",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 20,
  },
});

export default TrackForm;
