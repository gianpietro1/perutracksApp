import { useContext } from "react";
import { NavigationContext } from "@react-navigation/native";
import { Context as TrackContext } from "../context/TrackContext";
import { Context as LocationContext } from "../context/LocationContext";

export default () => {
  const navigation = useContext(NavigationContext);
  const { createTrack } = useContext(TrackContext);
  const {
    state: { name, locations, landmarks },
    reset,
  } = useContext(LocationContext);

  const saveTrack = async () => {
    // this function was moved to await so we can run the cleanup when it actually finishes
    await createTrack(name, locations, landmarks);
    reset();
    navigation.navigate("Tracks");
  };

  return [saveTrack];
};
