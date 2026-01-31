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
    marginBottom: 8,
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
  headerRight: {
    width: 36,
    alignItems: "flex-end",
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
    backgroundColor: "#ffd5aeff",
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
   * MODAL BUTTONS
   * ========================= */
  modalButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
    alignItems: "center",
  },
  modalButtonsRight: {
    flexDirection: "row",
    gap: 10, // or use marginLeft on buttons if you prefer
  },
  modalButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
  },

  // Variants
  modalButtonSecondary: {
    backgroundColor: "#ffe6d5",
  },
  modalButtonPrimary: {
    backgroundColor: "#f2876d",
  },
  modalButtonDanger: {
    backgroundColor: "#ff6b6b",
  },

  // Text
  modalButtonSecondaryText: {
    color: "#b7867c",
    fontWeight: "600",
  },
  modalButtonPrimaryText: {
    color: "#ffe9dc",
    fontWeight: "700",
  },
  modalButtonDangerText: {
    color: "#fff",
    fontWeight: "600",
  },
});
