import React, { useEffect, useRef } from "react";
import { Animated, ImageStyle, StyleProp } from "react-native";

interface Props {
  source: any;
  style?: StyleProp<ImageStyle>;
}

export default function WiggleImage({ source, style }: Props) {
  const animX = useRef(new Animated.Value(0)).current;
  const animY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = () => {
      const delay = 1000 + Math.random() * 4000; // 1–5 sec random delay

      Animated.parallel([
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(animX, {
            toValue: 1,
            duration: 120,
            useNativeDriver: true,
          }),
          Animated.timing(animX, {
            toValue: -1,
            duration: 120,
            useNativeDriver: true,
          }),
          Animated.timing(animX, {
            toValue: 0,
            duration: 120,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(animY, {
            toValue: 1,
            duration: 120,
            useNativeDriver: true,
          }),
          Animated.timing(animY, {
            toValue: -1,
            duration: 120,
            useNativeDriver: true,
          }),
          Animated.timing(animY, {
            toValue: 0,
            duration: 120,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => loop());
    };

    loop();
  }, []);

  const translateX = animX.interpolate({
    inputRange: [-1, 1],
    outputRange: [-0.3, 0.3], // X wiggle amount
  });

  const translateY = animY.interpolate({
    inputRange: [-1, 1],
    outputRange: [-0.8, 0.8], // Y wiggle amount (usually smaller looks cuter)
  });

  return (
    <Animated.Image
      source={source}
      style={[
        style,
        {
          transform: [
            { translateX },
            { translateY },
          ],
        },
      ]}
    />
  );
}
