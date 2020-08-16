import React, { useContext, useEffect } from "react";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import { Context as TrackContext } from "../context/TrackContext";
import LandmarkEditForm from "../components/LandmarkEditForm";

const LandmarkEditScreen = ({ route, navigation }) => {
  const { state, editLandmark, deleteTrackImage } = useContext(TrackContext);
  const { trackId, landmarkId } = route.params;

  const track = state.find((t) => t._id === trackId);
  const landmark = track.landmarks.find((l) => l._id === landmarkId);

  const getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };

  useEffect(() => {
    getPermissionAsync();
  }, []);

  return (
    <LandmarkEditForm
      initialValues={{
        name: landmark.name,
        description: landmark.description,
        image: landmark.image,
      }}
      deleteImage={(oldImage) => deleteTrackImage(oldImage)}
      cancel={() => navigation.pop()}
      submit={(landmarkObject) => {
        editLandmark(landmarkId, landmarkObject, track, () => {
          navigation.pop();
        });
      }}
    />
  );
};

export default LandmarkEditScreen;
