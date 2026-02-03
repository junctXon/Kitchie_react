// styles/recipescreen.styles.ts
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  /* =========================================================
     Screen shell
  ========================================================= */
  safeArea: {
    flex: 1,
    backgroundColor: "#ffe9dc",
  },
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 6,
    paddingBottom: 10,
  },

  /* =========================================================
     Header
  ========================================================= */
  headerRow: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 6,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#f29f9b",
    letterSpacing: 0.2,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.65)",
    alignItems: "center",
    justifyContent: "center",
  },

  /* =========================================================
     Split layout (left list + right details)
  ========================================================= */
  splitWrap: {
    flex: 1,
    flexDirection: "row",
    gap: 12,
  },
  splitWrapNarrow: {
    flexDirection: "column",
  },

  panel: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.55)",
    padding: 12,
  },
  leftPanel: {
    flex: 1,
  },
  rightPanel: {
    flex: 1,
  },
  panelTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#b7747c",
    marginBottom: 10,
  },

  /* =========================================================
     Search bar
  ========================================================= */
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 42,
    backgroundColor: "rgba(255,255,255,0.75)",
  },
  searchInput: {
    flex: 1,
    height: 42,
    color: "#b7747c",
    fontWeight: "700",
  },

  /* =========================================================
     Recipe list (left panel)
  ========================================================= */
  list: {
    flex: 1,
    marginTop: 10,
  },
  listContent: {
    paddingBottom: 16,
    gap: 10,
  },
  recipeCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.70)",
    borderWidth: 2,
    borderColor: "transparent",
  },
  recipeCardSelected: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderColor: "#f29f9b",
    shadowColor: "#f29f9b",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  recipeIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: "rgba(242,159,155,0.20)",
    alignItems: "center",
    justifyContent: "center",
  },
  recipeIconEmoji: {
    fontSize: 18,
  },
  recipeTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: "900",
    color: "#b7747c",
  },

  /* =========================================================
     Empty states (no recipes / no selection)
  ========================================================= */
  emptyBox: {
    marginTop: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  emptyTitle: {
    color: "#b7747c",
    fontWeight: "900",
    fontSize: 16,
  },
  emptySub: {
    marginTop: 6,
    color: "#b7747c",
    opacity: 0.8,
    fontWeight: "700",
  },

  rightEmpty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  rightEmptyTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#b7747c",
  },
  rightEmptySub: {
    marginTop: 6,
    color: "#b7747c",
    opacity: 0.8,
    fontWeight: "700",
    textAlign: "center",
  },

  /* =========================================================
     Right header row + filter chips
  ========================================================= */
  rightHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 8,
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.65)",
    color: "#b7747c",
    fontWeight: "900",
    fontSize: 12,
  },
  filterChipActive: {
    backgroundColor: "rgba(242,159,155,0.28)",
  },

  /* =========================================================
     Ingredients card (right panel list)
  ========================================================= */
  ingredientsCard: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.78)",
    padding: 10,
    marginBottom: 10,
  },
  ingredientRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 8,
  },
  ingredientImageWrap: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: "rgba(242,159,155,0.12)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  ingredientImageBase: {
    width: 26,
    height: 26,
  },
  ingredientText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "900",
    color: "#b7747c",
  },
  ingredientAmount: {
    color: "#c98b92",
    fontWeight: "900",
  },

  /* -----------------------------
     Missing / muted styling
  ------------------------------ */
  missingIngredientImage: {
    opacity: 0.35,
  },
  mutedText: {
    opacity: 0.55,
  },

  /* =========================================================
     Shopping dropdown (for missing ingredients)
  ========================================================= */
  shoppingDropdown: {
    alignSelf: "flex-start",
    marginLeft: 44,
    marginBottom: 8,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.92)",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(242,159,155,0.25)",
  },
  shoppingDropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  shoppingDropdownText: {
    color: "#b7747c",
    fontWeight: "800",
    fontSize: 13,
  },

  /* =========================================================
     Primary actions (right panel)
  ========================================================= */
  startButton: {
    height: 44,
    borderRadius: 999,
    backgroundColor: "#f29f9b",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 10,
  },
  startButtonText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 14,
  },

  /* =========================================================
     Secondary actions (Edit / Delete)
  ========================================================= */
  editButton: {
    height: 44,
    borderRadius: 14,
    backgroundColor: "#e8918c",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 10,
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 14,
  },

  deleteButton: {
    height: 42,
    borderRadius: 14,
    backgroundColor: "#b7747c",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 14,
  },

  /* =========================================================
     Modals (Create / Edit shared styling)
  ========================================================= */
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  createModalCard: {
    position: "absolute",
    left: 12,
    right: 12,
    top: 90,
    bottom: 40,
    borderRadius: 18,
    backgroundColor: "#ffe9dc",
    padding: 14,
  },

  /* -----------------------------
     Modal header (title + close)
  ------------------------------ */
  createHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  createTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#b7747c",
  },
  sheetClose: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.65)",
    alignItems: "center",
    justifyContent: "center",
  },

  /* -----------------------------
     Modal form controls
  ------------------------------ */
  createLabel: {
    fontSize: 13,
    fontWeight: "900",
    color: "#b7747c",
    marginBottom: 6,
  },
  createInput: {
    height: 42,
    borderRadius: 14,
    paddingHorizontal: 12,
    backgroundColor: "rgba(255,255,255,0.75)",
    color: "#b7747c",
    fontWeight: "800",
  },

  /* -----------------------------
     Add ingredient row + button
  ------------------------------ */
  addIngRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  addIngButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#f29f9b",
    alignItems: "center",
    justifyContent: "center",
  },

  /* -----------------------------
     Ingredient suggestions dropdown
  ------------------------------ */
  suggestionBox: {
    marginTop: 8,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.92)",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(183,116,124,0.18)",
  },
  suggestionItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(183,116,124,0.10)",
  },
  suggestionText: {
    color: "#b7747c",
    fontWeight: "900",
  },

  /* -----------------------------
     Draft ingredient chips (preview)
  ------------------------------ */
  hintText: {
    marginTop: 10,
    color: "#b7747c",
    opacity: 0.85,
    fontWeight: "700",
  },
  ingChipRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.65)",
    marginBottom: 8,
  },
  ingChipText: {
    color: "#b7747c",
    fontWeight: "900",
  },

  /* -----------------------------
     Dish image picker grid
  ------------------------------ */
  dishPickerRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 6,
  },
  dishPick: {
    width: "31%",
    minWidth: 92,
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: "rgba(255,255,255,0.65)",
    alignItems: "center",
    justifyContent: "center",
  },
  dishPickActive: {
    backgroundColor: "rgba(242,159,155,0.25)",
  },
  dishPickEmoji: {
    fontSize: 18,
    marginBottom: 4,
  },
  dishPickLabel: {
    color: "#b7747c",
    fontWeight: "900",
    fontSize: 12,
  },

  /* -----------------------------
     Save button (create/edit)
  ------------------------------ */
  saveButton: {
    marginTop: 14,
    height: 46,
    borderRadius: 999,
    backgroundColor: "#f29f9b",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  saveButtonText: {
    color: "#ffe9dc",
    fontWeight: "900",
    fontSize: 14,
  },
});
