// app/(tabs)/_layout.tsx
import { Feather, Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          display: "none", // hide default bar, use our custom one
        },
      }}
      tabBar={({ state, navigation }) => (
        <View style={styles.tabBarWrapper}>
          <View style={styles.tabBar}>
            {state.routes.map((route, index) => {
              const isFocused = state.index === index;

              let icon = null;

              if (route.name === "homescreen") {
                icon = (
                  <Ionicons name="home" size={26} color="#ffe9dc" />
                );
              } 
              else if (route.name === "stockscreen") {
                icon = (
                  <Feather name="edit-3" size={24} color="#ffe9dc" />
                );
              } 
              else if (route.name === "recipescreen") {
                icon = (
                  <Ionicons name="restaurant" size={26} color="#ffe9dc" />
                );
              }
              else if (route.name === "shoppingscreen") {
                icon = (
                  <Ionicons name="cart" size={26} color="#ffe9dc" />
                );
              }

              const onPress = () => {
                if (!isFocused) {
                  navigation.navigate(route.name);
                }
              };

              return (
                <TouchableOpacity
                  key={route.key}
                  style={[
                    styles.tabButton,
                    isFocused && styles.tabButtonActive,
                  ]}
                  activeOpacity={0.8}
                  onPress={onPress}
                >
                  {icon}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}
    >
      <Tabs.Screen name="homescreen" options={{ title: "Home" }} />
      <Tabs.Screen name="stockscreen" options={{ title: "Inventory" }} />
      <Tabs.Screen name="recipescreen" options={{ title: "Recipes" }} />
      <Tabs.Screen name="shoppingscreen" options={{ title: "Shopping" }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarWrapper: {
    paddingHorizontal: 16,
    paddingBottom: 28,
    paddingTop: 12,
    backgroundColor: "#f7b7a356",
  },
  tabBar: {
    flexDirection: "row",
    height: 60,
    backgroundColor: "#b7747c",
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "space-around",
  },
  tabButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
  },
  tabButtonActive: {
    backgroundColor: "rgba(255, 233, 220, 0.25)",
  },
});
