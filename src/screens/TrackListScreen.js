import React, { useContext, useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  Button,
} from "react-native";
import ShowImage from "../components/ShowImage";
import { Context as TrackContext } from "../context/TrackContext";

const SCREEN_WIDTH = Dimensions.get("window").width;

const TrackListScreen = ({ navigation }) => {
  const { state, fetchTracks } = useContext(TrackContext);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchTracks();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <FlatList
      data={state}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => {
        return (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() =>
              navigation.navigate("TrackDetail", {
                _id: item._id,
                name: item.name,
              })
            }
          >
            <View style={styles.card}>
              <ShowImage
                url={item.image}
                width={SCREEN_WIDTH}
                height={SCREEN_WIDTH}
              />
              <View style={styles.imageText}>
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.subtitle}>{item.shortDescription}</Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  card: {},
  imageText: {
    position: "absolute",
    bottom: 0,
    padding: 10,
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  subtitle: {
    fontSize: 12,
    color: "white",
  },
  buttonEdit: {
    position: "absolute",
    top: 10,
    right: 10,
  },
});

export default TrackListScreen;
