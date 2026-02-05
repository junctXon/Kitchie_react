// styles/recipescreen.styles.ts
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  /* =========================================================
     Screen shell
  ========================================================= */
  safeArea: {
    flex: 1,
    backgroundColor: "#fff5f0",
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },

  /* =========================================================
     Header
  ========================================================= */
  headerRow: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  backButton: {
    position: "absolute",
    left: 0,
    padding: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#f29f9b",
    letterSpacing: 0.3,
  },
  addButton: {
    position: "absolute",
    right: 0,
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.65)",
    alignItems: "center",
    justifyContent: "center",
  },

  /* =========================================================
     Search bar
  ========================================================= */
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 50,
    backgroundColor: "rgba(255,255,255,0.75)",
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    height: 50,
    color: "#b7747c",
    fontWeight: "600",
    fontSize: 16,
  },

  /* =========================================================
     Recipe list
  ========================================================= */
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 24,
    gap: 12,
  },

  /* =========================================================
     Recipe Card Container (collapsible)
  ========================================================= */
  recipeCardContainer: {
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.65)",
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
  },
  recipeCardContainerExpanded: {
    borderColor: "#f29f9b",
    shadowColor: "#f29f9b",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },

  /* =========================================================
     Recipe Header (the clickable part)
  ========================================================= */
  recipeHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    paddingRight: 16,
    gap: 12,
    backgroundColor: "rgba(242,159,155,0.25)",
    borderRadius: 20,
  },
  recipeHeaderExpanded: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  dishImageWrap: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  dishEmoji: {
    fontSize: 32,
  },
  recipeHeaderText: {
    flex: 1,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#b7747c",
  },
  recipeSubtitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#e8918c",
    marginTop: 2,
  },

  /* =========================================================
     Expanded Content
  ========================================================= */
  expandedContent: {
    padding: 16,
    paddingTop: 8,
  },

  /* =========================================================
     Section Headers (Pantry / Needed)
  ========================================================= */
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: "#f29f9b",
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: "rgba(242,159,155,0.15)",
    borderRadius: 999,
  },
  sectionTitleNeeded: {
    fontSize: 14,
    fontWeight: "900",
    color: "#c9a0a5",
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: "rgba(201,160,165,0.12)",
    borderRadius: 999,
  },
  sectionDivider: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(242,159,155,0.25)",
    marginLeft: 12,
  },
  sectionDividerNeeded: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(201,160,165,0.2)",
    marginLeft: 12,
  },

  /* =========================================================
     Ingredient Rows
  ========================================================= */
  ingredientRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 8,
    backgroundColor: "rgba(255,255,255,0.5)",
    borderRadius: 14,
    marginBottom: 8,
  },
  ingredientRowNeeded: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 8,
    backgroundColor: "rgba(220,215,215,0.4)",
    borderRadius: 14,
    marginBottom: 8,
  },
  ingredientImageWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.8)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  ingredientImageWrapNeeded: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.5)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  ingredientImage: {
    width: 28,
    height: 28,
  },
  ingredientImageMuted: {
    opacity: 0.45,
  },
  ingredientName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "800",
    color: "#b7747c",
  },
  ingredientNameNeeded: {
    flex: 1,
    fontSize: 16,
    fontWeight: "800",
    color: "#b7747c",
    opacity: 0.6,
  },
  ingredientQty: {
    fontSize: 15,
    fontWeight: "800",
    color: "#c98b92",
    marginRight: 8,
  },
  ingredientQtyNeeded: {
    fontSize: 15,
    fontWeight: "800",
    color: "#c98b92",
    opacity: 0.6,
    marginRight: 8,
  },

  /* =========================================================
     Missing Message
  ========================================================= */
  missingMessage: {
    fontSize: 13,
    fontWeight: "700",
    color: "#b7747c",
    opacity: 0.8,
    textAlign: "left",
    marginTop: 8,
    marginBottom: 16,
    paddingHorizontal: 4,
  },

  /* =========================================================
     Action Buttons Row
  ========================================================= */
  actionButtonsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    marginTop: 8,
  },
  actionButton: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#e8918c",
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonDelete: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#d97777",
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonCart: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#c9a0a5",
    alignItems: "center",
    justifyContent: "center",
  },

  /* =========================================================
     Shopping dropdown (for missing ingredients)
  ========================================================= */
  shoppingDropdown: {
    alignSelf: "flex-start",
    marginBottom: 8,
    marginTop: -4,
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
     Empty states
  ========================================================= */
  emptyBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  emptyTitle: {
    color: "#b7747c",
    fontWeight: "900",
    fontSize: 18,
  },
  emptySub: {
    marginTop: 8,
    color: "#b7747c",
    opacity: 0.8,
    fontWeight: "700",
    fontSize: 15,
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

  /* =========================================================
     Legacy styles (kept for compatibility if needed)
  ========================================================= */
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.65)",
    alignItems: "center",
    justifyContent: "center",
  },
  panel: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.55)",
    padding: 12,
  },
  panelTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#b7747c",
    marginBottom: 10,
  },
});
