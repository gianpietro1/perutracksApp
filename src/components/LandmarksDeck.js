import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  Animated,
  StyleSheet,
  PanResponder,
  Dimensions,
  LayoutAnimation,
  UIManager,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { Image } from "react-native-elements";
import ShowImage from "./ShowImage";
import defaultLandmark from "../../assets/landmark.png";

const SCREEN_WIDTH = Dimensions.get("window").width;
const ALMOST_SCREEN_WIDTH = 0.9 * SCREEN_WIDTH;
const SWIPE_THRESHOLD = 0.1 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;

var CustomLayoutAnimation = {
  duration: 400,
  create: {
    type: LayoutAnimation.Types.easeInEaseOut,
    property: LayoutAnimation.Properties.opacity,
  },
  update: {
    type: LayoutAnimation.Types.easeInEaseOut,
  },
};

const LandmarksDeck = ({
  data,
  controlScroll,
  track,
  markerToLandmark,
  landmarkToMarker,
  onSwipeLeft = () => {},
  onSwipeRight = () => {},
}) => {
  if (Platform.OS === "android") {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  const navigation = useNavigation();

  const position = new Animated.ValueXY();
  const [index, setIndex] = useState(0);
  const [landmark, setLandmark] = useState(data[index]);

  useEffect(() => {
    if (markerToLandmark) {
      const currentLandmark = data.find((l) => l._id === markerToLandmark);
      setLandmark(currentLandmark);
    }
  }, [markerToLandmark]);

  // Documentation says that we should assign panResponder to state and use the state,
  // but S.Grinder says it is not necessary at all
  const [panResponderState, setPanResponderState] = useState(panResponder);
  const [positionState, setPosition] = useState(position);

  const panResponder = PanResponder.create({
    onPanResponderGrant: (evt, gesture) => {
      controlScroll(false);
    },
    // touch scope of panResponder
    onStartShouldSetPanResponder: () => true,
    // dragging scope of panResponder
    onPanResponderMove: (event, gesture) => {
      position.setValue({ x: gesture.dx, y: 0 });
    },
    // actions when screen is released
    onPanResponderRelease: (event, gesture) => {
      if (gesture.dx > SWIPE_THRESHOLD) {
        forceSwipe("left");
        position.setValue({ x: 0, y: 0 });
      } else if (gesture.dx < -SWIPE_THRESHOLD) {
        forceSwipe("right");
        position.setValue({ x: 0, y: 0 });
      } else {
        resetPosition();
      }
    },
    onPanResponderTerminate: (evt, gesture) => {
      controlScroll(true);
      resetPosition();
    },
  });

  // not sure if replicates componentWillReceiveProps(nextProps)
  useEffect(() => {
    setIndex(0);
  }, [data]);

  const forceSwipe = (direction) => {
    // timing is less fancy than spring for going straight to the new position
    const x = direction === "right" ? SCREEN_WIDTH : -SCREEN_WIDTH;
    Animated.timing(position, {
      toValue: { x: x * 1.2, y: 0 },
      duration: SWIPE_OUT_DURATION,
      useNativeDriver: false,
    }).start(() => onSwipeComplete(direction));
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
    }).start(() => {
      controlScroll(true);
    });
  };

  const onSwipeComplete = (direction) => {
    if (direction === "left" && index === 0) {
      setIndex(data.length - 1);
    } else if (direction === "right" && index === data.length - 1) {
      setIndex(0);
    } else {
      direction === "right" ? setIndex(index + 1) : setIndex(index - 1);
    }
    setLandmark(data[index]);
    landmarkToMarker(data[index]._id);
    controlScroll(true);
    // alternative to doing it on componentWillUpdate
    LayoutAnimation.configureNext(CustomLayoutAnimation);
  };

  const renderLandmarkCard = () => {
    return (
      <Animated.View
        style={[position.getLayout(), styles.landmarkCard]}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity
          style={{
            bottom: 10,
            right: 10,
            position: "absolute",
            zIndex: 1,
          }}
          onPress={() =>
            navigation.navigate("LandmarkEdit", {
              landmarkId: landmark._id,
              trackId: track._id,
            })
          }
        >
          <Feather name="edit" size={22} color="white" />
        </TouchableOpacity>
        {landmark.image ? (
          <ShowImage
            url={landmark.image}
            width={ALMOST_SCREEN_WIDTH}
            height={ALMOST_SCREEN_WIDTH}
          />
        ) : (
          <Image
            style={{
              width: ALMOST_SCREEN_WIDTH,
              height: ALMOST_SCREEN_WIDTH,
              alignSelf: "center",
            }}
            source={defaultLandmark}
          />
        )}
        <View style={styles.imageText}>
          <Text style={styles.title}>{landmark.name}</Text>
          <Text style={styles.subtitle}>
            [
            {`${landmark.coords.latitude.toFixed(
              4
            )},${landmark.coords.longitude.toFixed(4)}`}
            ] - {landmark.description}
          </Text>
        </View>
      </Animated.View>
    );
  };

  return (
    <>
      <View style={styles.dividerView}>
        <Text style={styles.dividerText}>PUNTOS DE INTERÉS</Text>
      </View>
      {renderLandmarkCard()}
    </>
  );
};

const styles = StyleSheet.create({
  landmarkCard: {
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    marginVertical: 10,
    alignSelf: "center",
  },
  dividerText: {
    fontSize: 12,
    color: "#3f3f3f",
    textAlign: "center",
  },
  dividerView: {
    marginTop: 15,
    backgroundColor: "#eaeaea",
    borderRadius: 10,
    padding: 5,
  },
  imageText: {
    position: "absolute",
    bottom: 0,
    height: 60,
    padding: 10,
    width: ALMOST_SCREEN_WIDTH,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
  },
  subtitle: {
    fontSize: 10,
    color: "white",
  },
});

export default LandmarksDeck;
