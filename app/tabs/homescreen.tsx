import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { FC, useCallback, useState } from "react";
import { ImageBackground, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getIngredientAsset } from "../../src/ingredientImages";
import { styles } from "../../styles/homescreen.styles";
import WiggleImage from "../components/WiggleImage";

type Ingredient = {
  id: string;
  name: string;
  quantity: string;
  unit?: string;
};

const STORAGE_KEY = "kitchie.ingredients.v1";

const HomeScreen: FC = () => {
  const router = useRouter();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  useFocusEffect(
    useCallback(() => {
      let alive = true;

      (async () => {
        try {
          const raw = await AsyncStorage.getItem(STORAGE_KEY);
          if (raw && alive) {
            setIngredients(JSON.parse(raw));
          } else if (alive) {
            setIngredients([]);
          }
        } catch (e) {
          console.warn("Failed to load pantry", e);
        }
      })();

      return () => {
        alive = false;
      };
    }, [])
  );

  return (
    <ImageBackground
      source={require("../../assets/images/background_home.png")}
      style={styles.background_home}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        {/* HEADER */}
        <View style={styles.headerRow}>
          <Image
            source={require("../../assets/images/Kitchie_logo.png")}
            style={styles.logoImage}
          />

          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton}>
              <Feather name="settings" size={22} color="#f29f9b" />
            </TouchableOpacity>
          </View>
        </View>

        {/* KITCHEN AREA */}
        <View style={styles.kitchenArea}>
          {/* Middle shelf */}
          <View style={styles.produce}>
            {ingredients.map((item) => {
            const asset = getIngredientAsset(item.name);
            return (
              <WiggleImage
                key={item.id}
                source={asset.source}
                style={[styles.ingredientSpriteBase, asset.style]}
              />
            );
          })}
        </View>
        
          {/* Cabinet base */}
          <View style={styles.cabinetRow}>
            <View style={styles.cabinetLeft} />
            <View style={styles.cabinetRight}>
              <View style={styles.cabinetDrawer} />
              <View style={styles.cabinetDoor} />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default HomeScreen;
