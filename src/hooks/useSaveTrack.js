import { useContext } from "react";
import { Context as TrackContext } from "../context/TrackContext";
import { Context as LocationContext } from "../context/LocationContext";

export default () => {
  const { createTrack } = useContext(TrackContext);
  const {
    state: { name, locations },
    reset,
  } = useContext(LocationContext);

  const saveTrack = async () => {
    // this function was moved to await so we can run the cleanup when it actually finishes
    await createTrack(name, locations);
    reset();
    //navigate("TrackList");
  };

  return [saveTrack];
};
