import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff5f0",
  },
  headerRow: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  // Logo Image
  logoImage: {
    height: 40,
    width: 140,
  },
  headerIcons: {
    flexDirection: "row",
    gap: 12,
  },

  iconButton: {
    padding: 6,
  },


  // Kitchen
  kitchenArea: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    justifyContent: "flex-end",
    paddingBottom: 10,
  },

  // Current Grocery Items (View)
  produce: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 2,
    position: "absolute",
    zIndex: 10,
    elevation: 10,
    left: 40,
    bottom: 20,
  },

  ingredientSpriteBase: {
    // optional: keeps sprites neat
  },

  // Animated cooking sprite
  cookingSprite: {
    position: "absolute",
    zIndex: 5,
    elevation: 5,
    left: "50%",
    top: "35%",
    transform: [{ translateX: -125 }, { translateY: 100 }],
  },

});