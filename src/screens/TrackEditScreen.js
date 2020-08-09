import React, { useContext, useEffect } from "react";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import { Context as TrackContext } from "../context/TrackContext";
import TrackEditForm from "../components/TrackEditForm";

const TrackEditScreen = ({ route, navigation }) => {
  const { state, editTrack, deleteTrackImage } = useContext(TrackContext);
  const { _id } = route.params;

  const track = state.find((t) => t._id === _id);

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
    <TrackEditForm
      initialValues={{
        name: track.name,
        shortDescription: track.shortDescription,
        description: track.description,
        image: track.image,
        video: track.video,
      }}
      deleteImage={(oldImage) => deleteTrackImage(oldImage)}
      cancel={() => navigation.pop()}
      submit={(trackObject) =>
        editTrack(_id, trackObject, () => {
          navigation.pop();
        })
      }
    />
  );
};

export default TrackEditScreen;
