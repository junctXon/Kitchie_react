import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  /* =========================
   * LAYOUT / SCREEN
   * ========================= */
  safeArea: {
    flex: 1,
    backgroundColor: "#fff5f0",
  },
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 6,
    paddingBottom: 10,
  },

  /* =========================
  * HEADER (MATCH RECIPESCREEN EXACTLY)
  * ========================= */
  headerRow: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 6,
    marginBottom: 10,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.65)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#f29f9b",
    letterSpacing: 0.2,
  },

  /* =========================
   * TEXT
   * ========================= */
  subtitle: {
    fontSize: 14,
    color: "#b7867c",
    marginBottom: 12,
  },

  /* =========================
   * GRID / LIST
   * ========================= */
  listContent: {
    paddingVertical: 4,
  },
  row: {
    flex: 1,
    justifyContent: "space-between",
    marginBottom: 8,
  },

  /* =========================
   * INGREDIENT CARD
   * ========================= */
  itemCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 2,
    backgroundColor: "rgba(255,255,255,0.55)",
    borderRadius: 25,
    marginBottom: 8,
    marginHorizontal: 4,
    justifyContent: "space-between",
  },
  itemLeftRow: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
  },
  itemImage: {
    width: 32,
    height: 32,
    borderRadius: 8,
    marginRight: 8,
  },
  itemRightText: {
    flexDirection: "column",
  },
  itemSub: {
    fontSize: 13,
    color: "#b7867c",
    marginTop: 2,
  },

  /* =========================
   * MODAL
   * ========================= */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modalCard: {
    width: "100%",
    borderRadius: 24,
    backgroundColor: "#fff7f1",
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#f2876d",
    marginBottom: 12,
  },
  modalLabel: {
    fontSize: 13,
    color: "#b7867c",
    marginTop: 8,
    marginBottom: 4,
  },
  input: {
    borderRadius: 14,
    backgroundColor: "#ffe6d5",
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: "#7a4d45",
  },

  /* =========================
   * MODAL (MATCH RECIPE MODAL)
   * ========================= */
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  invModalCard: {
    position: "absolute",
    left: 12,
    right: 12,
    top: 120,
    maxHeight: "70%",
    borderRadius: 18,
    backgroundColor: "#ffe9dc",
    padding: 14,
  },

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

  /* =========================
   * INGREDIENT SUGGESTIONS
   * ========================= */
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

  /* =========================
   * MODAL BUTTONS
   * ========================= */
  modalButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    marginBottom: 10,
    alignItems: "center",
  },
  modalButtonsRight: {
    flexDirection: "row",
    gap: 10,
  },
  modalButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
  },

  modalButtonSecondary: {
    backgroundColor: "rgba(255,255,255,0.65)",
  },
  modalButtonPrimary: {
    backgroundColor: "#f29f9b",
  },
  modalButtonDanger: {
    backgroundColor: "#ff6b6b",
  },

  modalButtonSecondaryText: {
    color: "#b7747c",
    fontWeight: "900",
  },
  modalButtonPrimaryText: {
    color: "#ffe9dc",
    fontWeight: "900",
  },
  modalButtonDangerText: {
    color: "#fff",
    fontWeight: "900",
  },
});
