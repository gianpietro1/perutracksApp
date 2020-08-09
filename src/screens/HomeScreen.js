import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Button } from "react-native-elements";
import portada from "../../assets/portada.png";

const HomeScreen = ({ navigation }) => {
  return (
    <>
      <Image
        style={{ ...styles.imageBackground, opacity: 0.8 }}
        source={portada}
      />
      <View style={styles.view}>
        <Text style={styles.text}>PeruTracks</Text>
        <Button
          title={"Arrancar"}
          buttonStyle={styles.button}
          onPress={() => {
            navigation.navigate("Tracks");
          }}
        ></Button>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  view: {
    justifyContent: "center",
    flex: 1,
    alignItems: "center",
  },
  text: {
    fontSize: 50,
    fontWeight: "bold",
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    marginTop: 50,
  },
  imageBackground: {
    resizeMode: "cover",
    position: "absolute",
  },
  button: {
    marginTop: 20,
    width: 100,
    borderRadius: 10,
  },
});

export default HomeScreen;
