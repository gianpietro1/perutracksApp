import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Input, Button, Image, Card } from "react-native-elements";
import ShowImage from "./ShowImage";

const LandmarkEditForm = ({ initialValues, submit, cancel, deleteImage }) => {
  const [name, setName] = useState(initialValues.name || "");
  const [description, setDescription] = useState(
    initialValues.description || ""
  );
  const [image, setImage] = useState(initialValues.image || "");
  const [localImage, setLocalImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      });
      if (!result.cancelled) {
        setLocalImage(result.uri);
      }
    } catch (E) {
      console.log(E);
    }
  };

  const checkIfNewImageAndDeleteOld = (localImage) => {
    const oldImage =
      initialValues.image && localImage ? initialValues.image : null;
    if (oldImage) {
      deleteImage(oldImage);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, flexDirection: "column", justifyContent: "flex-start" }}
      behavior={Platform.OS === "ios" ? "padding" : null}
      enabled
      keyboardVerticalOffset={100}
    >
      <Card>
        <ScrollView
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              padding: 10,
            }}
          >
            {localImage ? (
              <Image
                source={{ uri: localImage }}
                style={{ width: 200, height: 200 }}
              />
            ) : (
              <ShowImage url={image} width={200} height={200} />
            )}
            <Button
              title="Escoger Nueva Foto"
              onPress={pickImage}
              style={{ margin: 5 }}
            />
          </View>
          <Input
            label="Nombre"
            value={name}
            onChangeText={setName}
            autoCorrect={false}
          />
          <Input
            label="Descripción"
            value={description}
            onChangeText={setDescription}
            autoCorrect={false}
          />
          <View style={styles.buttons}>
            <View style={styles.button}>
              <Button
                title="Cancelar"
                buttonStyle={styles.buttonLeft}
                onPress={cancel}
              />
            </View>
            <View style={styles.button}>
              <Button
                title="Actualizar"
                buttonStyle={styles.buttonRight}
                loading={isLoading}
                onPress={() => {
                  submit({
                    name,
                    description,
                    image: localImage,
                  });
                  setIsLoading(true);
                  checkIfNewImageAndDeleteOld(localImage);
                }}
              />
            </View>
          </View>
        </ScrollView>
      </Card>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  buttons: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  button: { flex: 1 },
  buttonLeft: { margin: 2, backgroundColor: "#dc3545" },
  buttonRight: { margin: 2, backgroundColor: "#28a745" },
});
export default LandmarkEditForm;
