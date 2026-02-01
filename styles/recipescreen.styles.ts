import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  /* =========================
   * LAYOUT / SCREEN
   * ========================= */
  safeArea: {
    flex: 1,
    backgroundColor: "#ffe9dc",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
  },

  /* =========================
   * HEADER
   * ========================= */
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffd9c9",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "700",
    color: "#f2876d",
  },
  headerRightSpacer: {
    width: 36,
  },

  /* =========================
   * SEARCH
   * ========================= */
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#ffd9c9",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 14,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#6b4b52",
    paddingVertical: 0,
  },

  /* =========================
   * RECIPE LIST
   * ========================= */
  listContent: {
    paddingBottom: 140,
  },
  recipeCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderRadius: 18,
    padding: 14,
    backgroundColor: "#ffd9c9",
    marginBottom: 12,
  },
  recipeIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f7b7a3",
  },
  recipeIconEmoji: {
    fontSize: 26,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2a1d1f",
  },

  /* =========================
   * MODAL / BOTTOM SHEET
   * ========================= */
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.18)",
  },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    backgroundColor: "#ffe9dc",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 24,
  },
  sheetHandle: {
    alignSelf: "center",
    width: 52,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#e0a89d",
    marginBottom: 10,
  },
  sheetHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  sheetTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#2a1d1f",
  },
  sheetClose: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffd9c9",
  },

  /* =========================
   * FILTER
   * ========================= */
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2a1d1f",
  },
  filterOption: {
    fontSize: 14,
    fontWeight: "600",
    color: "#f2876d",
  },
  filterActive: {
    textDecorationLine: "underline",
  },

  /* =========================
   * INGREDIENT GRID
   * ========================= */
  ingredientGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },
  ingredientTile: {
    width: "22%", // ~4 per row
    alignItems: "center",
  },
  ingredientImageWrap: {
    width: 58,
    height: 58,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  ingredientImageBase: {
    width: 44,
    height: 44,
  },
  ingredientName: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "600",
    color: "#2a1d1f",
    textAlign: "center",
  },
  ingredientQty: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: "600",
    color: "#6b4b52",
    textAlign: "center",
  },

  /* =========================
   * MISSING INGREDIENT STATE
   * ========================= */
  missingIngredientImage: {
    opacity: 0.25,
  },
  mutedText: {
    opacity: 0.45,
  },
  missingOverlay: {
    position: "absolute",
    bottom: -6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.15)",
  },
  missingOverlayText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#fff",
  },
    /* =========================
   * CREATE RECIPE MODAL
   * ========================= */
  createModalCard: {
    position: "absolute",
    left: 20,
    right: 20,
    top: 110,
    maxHeight: "70%",
    borderRadius: 22,
    backgroundColor: "#ffe9dc",
    padding: 16,
  },
  createHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  createTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#2a1d1f",
  },
  createLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2a1d1f",
    marginBottom: 6,
  },
  createInput: {
    backgroundColor: "#ffd9c9",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: "#2a1d1f",
  },
  addIngRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  addIngButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "#b7747c",
    alignItems: "center",
    justifyContent: "center",
  },
  hintText: {
    marginTop: 8,
    color: "#b7747c",
    opacity: 0.8,
  },
  ingChipRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(183,116,124,0.12)",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
  },
  ingChipText: {
    fontWeight: "700",
    color: "#2a1d1f",
  },

  dishPickerRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  dishPick: {
    width: "30%",
    backgroundColor: "#ffd9c9",
    borderRadius: 16,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  dishPickActive: {
    borderWidth: 2,
    borderColor: "#b7747c",
  },
  dishPickEmoji: {
    fontSize: 22,
    marginBottom: 4,
  },
  dishPickLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6b4b52",
  },

  saveButton: {
    marginTop: 16,
    backgroundColor: "#b7747c",
    borderRadius: 18,
    paddingVertical: 12,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#ffe9dc",
    fontWeight: "900",
    fontSize: 16,
  },
  suggestionBox: {
  marginTop: 6,
  backgroundColor: "#ffe9dc",
  borderRadius: 14,
  borderWidth: 1,
  borderColor: "rgba(183,116,124,0.35)",
  overflow: "hidden",
},
suggestionItem: {
  paddingVertical: 10,
  paddingHorizontal: 12,
  backgroundColor: "#ffd9c9",
  borderBottomWidth: 1,
  borderBottomColor: "rgba(183,116,124,0.18)",
},
suggestionText: {
  fontSize: 14,
  fontWeight: "700",
  color: "#2a1d1f",
},
deleteButton: {
  marginTop: 16,
  backgroundColor: "#b7747c",
  borderRadius: 18,
  paddingVertical: 12,
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "row",
  gap: 8,
},
deleteButtonText: {
  color: "#ffe9dc",
  fontWeight: "900",
  fontSize: 16,
},

});
