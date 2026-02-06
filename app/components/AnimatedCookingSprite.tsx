import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";

const AnimatedCookingSprite = () => {
  const [currentFrame, setCurrentFrame] = useState(0);

  const frames = [
    require("../../assets/images/sprite/sprite_cooking3.png"),
    require("../../assets/images/sprite/sprite_cooking4.png"),
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % frames.length);
    }, 500); // Change frame every 500ms (adjust for desired speed)

    return () => clearInterval(interval);
  }, []);

  return (
    <Image
      source={frames[currentFrame]}
      style={styles.sprite}
      contentFit="contain"
    />
  );
};

const styles = StyleSheet.create({
  sprite: {
    width: 300,
    height: 300,
  },
});

export default AnimatedCookingSprite;
