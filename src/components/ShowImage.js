import React from "react";
import { Image } from "react-native-elements";

const ShowAvatar = ({ url, width, height }) => {
  return (
    <Image
      source={{
        uri: `https://smlv01.s3-sa-east-1.amazonaws.com/${url}`,
      }}
      style={{
        width,
        height,
      }}
    />
  );
};

export default ShowAvatar;
