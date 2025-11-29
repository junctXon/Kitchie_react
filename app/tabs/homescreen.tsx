import { Feather, Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { FC } from "react";
import {
  TouchableOpacity,
  View
} from "react-native";
import WiggleImage from "../components/WiggleImage";
import { styles } from "./homescreen.styles";


const HomeScreen: FC = () => {
  return (
    <View style={styles.container}>
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
          <WiggleImage source={require("../../assets/images/Milk.png")}
            style={styles.milkBottle}/>
          <WiggleImage source={require("../../assets/images/Carrot.png")}
            style={styles.carrot}/>
          <WiggleImage source={require("../../assets/images/Soy_sauce.png")}
            style={styles.soySauce}/>
          <WiggleImage source={require("../../assets/images/Egg.png")}
            style={styles.egg}/>
        </View>
        {/* Cabinet base (just background block to mimic counter) */}
        <View style={styles.cabinetRow}>
          <View style={styles.cabinetLeft} />
          <View style={styles.cabinetRight}>
            <View style={styles.cabinetDrawer} />
            <View style={styles.cabinetDoor} />
          </View>
        </View>
      </View>

      {/* BOTTOM TABS */}
      <View style={styles.tabBarWrapper}>
        <View style={styles.tabBar}>
          <TabButton
            icon={<Ionicons name="home" size={26} color="#ffe9dc" />}
            active
          />
          <TabButton
            icon={<Feather name="edit-3" size={24} color="#ffe9dc" />}
          />
          <TabButton
            icon={<Feather name="shopping-cart" size={24} color="#ffe9dc" />}
          />
          <TabButton
            icon={<Feather name="search" size={24} color="#ffe9dc" />}
          />
        </View>
      </View>
    </View>
  );
};

type TabButtonProps = {
  icon: React.ReactNode;
  active?: boolean;
};

const TabButton: FC<TabButtonProps> = ({ icon, active }) => {
  return (
    <TouchableOpacity
      style={[
        styles.tabButton,
        active && styles.tabButtonActive,
      ]}
      activeOpacity={0.8}
    >
      {icon}
    </TouchableOpacity>
  );
};

export default HomeScreen;

