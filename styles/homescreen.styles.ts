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
    zIndex: 10, // Brings the ingredients forward
    elevation: 10, // Android requires this?
    left: 40,
    bottom: 20,
  },

ingredientSpriteBase: {
  // optional: keeps sprites neat
},

  cabinetRow: {
    marginTop: 18,
    flexDirection: "row",
  },
  cabinetLeft: {
    flex: 1,
    height: 80,
    backgroundColor: "transparent",
  },
  cabinetRight: {
    width: "100%",
    height: 90,
    backgroundColor: "#f9c9a1",
    borderRadius: 18,
    padding: 10,
    justifyContent: "space-between",
  },
  cabinetDrawer: {
    height: 24,
    borderRadius: 12,
    backgroundColor: "#f7b58e",
  },
  cabinetDoor: {
    height: 34,
    borderRadius: 12,
    backgroundColor: "#f7b58e",
  },

});

