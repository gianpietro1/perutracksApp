import * as ImageManipulator from "expo-image-manipulator";
import createDataContext from "./createDataContext";
import trackerApi from "../api/tracker";

const trackReducer = (state, action) => {
  switch (action.type) {
    case "fetch_tracks":
      return action.payload;
    case "edit_track":
      return state.map((track) => {
        return track._id === action.payload._id
          ? Object.assign(track, action.payload)
          : track;
      });
    default:
      return state;
  }
};

const uploadResized = async (image) => {
  // Update image in S3
  const uploadConfigNormal = await trackerApi.get("/upload");
  const imageNew = await ImageManipulator.manipulateAsync(
    image,
    [{ resize: { width: 500 }, format: "jpeg" }],
    {}
  );
  const responseImageNew = await fetch(imageNew.uri);
  const blobImageNew = await responseImageNew.blob();
  await fetch(uploadConfigNormal.data.url, {
    method: "PUT",
    body: blobImageNew,
  });
  return {
    keyNormal: uploadConfigNormal.data.key,
  };
};

const deleteTrackImage = () => async (oldImage) => {
  await trackerApi.delete("/upload", { params: { key: oldImage } });
};

const fetchTracks = (dispatch) => async () => {
  const response = await trackerApi.get("/tracks");
  dispatch({ type: "fetch_tracks", payload: response.data });
};

const createTrack = (dispatch) => async (name, locations, landmarks) => {
  await trackerApi.post("/tracks", { name, locations, landmarks });
};

const editTrack = (dispatch) => async (id, trackObject, callback) => {
  if (trackObject["image"]) {
    // Upload to S3
    const imageUrls = await uploadResized(trackObject["image"]);
    // Update project info in MongoDB
    const imageUrl = imageUrls.keyNormal;
    trackObject["image"] = imageUrl;
  } else {
    delete trackObject["image"];
  }
  const response = await trackerApi.put(`/tracks/${id}`, trackObject);
  dispatch({ type: "edit_track", payload: response.data });
  callback();
};

export const { Provider, Context } = createDataContext(
  trackReducer,
  { fetchTracks, createTrack, editTrack, deleteTrackImage },
  []
);
