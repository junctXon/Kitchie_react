// app/(tabs)/stockscreen.tsx
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../../styles/stockscreen.styles";

import { getIngredientImage, INGREDIENT_KEYS } from "../../src/ingredientImages";

type Ingredient = {
  id: string;
  name: string;
  quantity: string;
  unit?: string;
};

const STORAGE_KEY = "kitchie.ingredients.v1";

// helpers
const normalize = (s: string) => s.trim().toLowerCase();

const parseNumber = (v: unknown) => {
  const n = Number(String(v ?? "").replace(",", ".").trim());
  return Number.isFinite(n) ? n : 0;
};

const formatNumber = (n: number) => {
  if (!Number.isFinite(n)) return "0";
  const rounded = Math.round(n * 100) / 100;
  return Number.isInteger(rounded) ? String(rounded) : String(rounded);
};

const toTitle = (s: string) => {
  return s
    .trim()
    .split(" ")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w))
    .join(" ");
};

const StockScreen: FC = () => {
  const router = useRouter();

  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [selectedItem, setSelectedItem] = useState<Ingredient | null>(null);

  const [editName, setEditName] = useState("");
  const [editQuantity, setEditQuantity] = useState("");
  const [editUnit, setEditUnit] = useState("");

  const [modalVisible, setModalVisible] = useState(false);

  // Autocomplete state
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIngredientKey, setSelectedIngredientKey] = useState<string | null>(null);

  // ✅ LOAD whenever screen is focused (so Recipes can update inventory and this will reflect it)
  useFocusEffect(
    useCallback(() => {
      let alive = true;

      (async () => {
        try {
          const raw = await AsyncStorage.getItem(STORAGE_KEY);
          if (!alive) return;

          const data: Ingredient[] = raw ? JSON.parse(raw) : [];
          setIngredients(Array.isArray(data) ? data : []);
        } catch (e) {
          console.warn("Failed to load ingredients", e);
          if (!alive) return;
          setIngredients([]);
        }
      })();

      return () => {
        alive = false;
      };
    }, [])
  );

  // SAVE whenever ingredients changes
  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(ingredients));
      } catch (e) {
        console.warn("Failed to save ingredients", e);
      }
    })();
  }, [ingredients]);

  // Autocomplete suggestions
  const ingredientSuggestions = useMemo(() => {
    const q = normalize(editName);
    if (!q) return [];
    return INGREDIENT_KEYS.filter((k) => k.includes(q)).slice(0, 6);
  }, [editName]);

  const openEdit = (item: Ingredient) => {
    setSelectedItem(item);
    setEditName(item.name);
    setEditQuantity(item.quantity);
    setEditUnit(item.unit || "x");
    setSelectedIngredientKey(item.name);
    setShowSuggestions(false);
    setModalVisible(true);
  };

  const closeEdit = () => {
    setModalVisible(false);
    setSelectedItem(null);
    setEditName("");
    setEditQuantity("");
    setEditUnit("");
    setSelectedIngredientKey(null);
    setShowSuggestions(false);
  };

  const openAdd = () => {
    setSelectedItem(null);
    setEditName("");
    setEditQuantity("");
    setEditUnit("x");
    setSelectedIngredientKey(null);
    setShowSuggestions(false);
    setModalVisible(true);
  };

  const isEditMode = !!selectedItem;

  // ✅ Add: merge duplicates by (normalized name + unit) instead of creating another record
  const addIngredient = () => {
    const candidate = selectedIngredientKey ?? normalize(editName);

    // Force selection from coded options
    if (!INGREDIENT_KEYS.includes(candidate)) {
      Alert.alert("Pick from the list", "Please select an ingredient from suggestions.");
      return;
    }

    const unitRaw = (editUnit.trim() || "x").toLowerCase();
    const qtyToAdd = parseNumber(editQuantity);

    if (qtyToAdd <= 0) {
      Alert.alert("Invalid quantity", "Please enter a valid quantity.");
      return;
    }

    const nameKey = normalize(candidate);

    setIngredients((prev) => {
      const existingIndex = prev.findIndex(
        (ing) =>
          normalize(ing.name) === nameKey && (ing.unit?.toLowerCase() || "x") === unitRaw
      );

      if (existingIndex !== -1) {
        const existing = prev[existingIndex];
        const existingQty = parseNumber(existing.quantity);
        const nextQty = existingQty + qtyToAdd;

        const updated: Ingredient = {
          ...existing,
          quantity: formatNumber(nextQty),
          unit: unitRaw,
        };

        const copy = [...prev];
        copy[existingIndex] = updated;
        return copy;
      }

      const newItem: Ingredient = {
        id: Date.now().toString(),
        name: candidate,
        quantity: formatNumber(qtyToAdd),
        unit: unitRaw,
      };

      return [...prev, newItem];
    });

    closeEdit();
  };

  const saveEdit = () => {
    if (!selectedItem) return;

    const candidate = selectedIngredientKey ?? normalize(editName);

    // Force selection from coded options
    if (!INGREDIENT_KEYS.includes(candidate)) {
      Alert.alert("Pick from the list", "Please select an ingredient from suggestions.");
      return;
    }

    setIngredients((prev) =>
      prev.map((ing) =>
        ing.id === selectedItem.id
          ? {
              ...ing,
              name: candidate,
              quantity: editQuantity.trim() || ing.quantity,
              unit: (editUnit.trim() || "x").toLowerCase(),
            }
          : ing
      )
    );

    closeEdit();
  };

  const deleteIngredient = () => {
    if (!selectedItem) return;
    setIngredients((prev) => prev.filter((ing) => ing.id !== selectedItem.id));
    closeEdit();
  };

  const renderItem = ({ item }: { item: Ingredient }) => {
    return (
      <TouchableOpacity
        style={styles.itemCard}
        activeOpacity={0.8}
        onPress={() => openEdit(item)}
      >
        <View style={styles.itemLeftRow}>
          <Image source={getIngredientImage(item.name)} style={styles.itemImage} />
          <View style={styles.itemRightText}>
            <Text style={styles.itemSub}>
              {item.quantity} {item.unit}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.iconButton}
            activeOpacity={0.8}
          >
            <Ionicons name="chevron-back" size={24} color="#f29f9b" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Inventory</Text>

          <TouchableOpacity onPress={openAdd} style={styles.iconButton} activeOpacity={0.8}>
            <Ionicons name="add" size={24} color="#f29f9b" />
          </TouchableOpacity>
        </View>

        <Text style={styles.subtitle}>Look at our assortment of deliciousness.</Text>

        <FlatList
          data={ingredients}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          numColumns={4}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.subtitle}>No ingredients yet. Tap + to add one.</Text>
          }
        />

        {/* MODAL */}
        <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={closeEdit}>
          <Pressable style={styles.modalBackdrop} onPress={closeEdit}>
            <View />
          </Pressable>

          <View style={styles.invModalCard}>
            <View style={styles.createHeaderRow}>
              <Text style={styles.createTitle}>
                {isEditMode ? "Edit Ingredient" : "Add Ingredient"}
              </Text>

              <TouchableOpacity onPress={closeEdit} style={styles.sheetClose} activeOpacity={0.8}>
                <Ionicons name="close" size={22} color="#b7747c" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <Text style={styles.createLabel}>Name</Text>
              <TextInput
                value={editName}
                onChangeText={(t) => {
                  setEditName(t);
                  setSelectedIngredientKey(null);
                  setShowSuggestions(true);
                }}
                style={styles.createInput}
                placeholder="Search ingredient..."
                placeholderTextColor="#e0c4c4"
                autoCapitalize="none"
                autoCorrect={false}
                onFocus={() => setShowSuggestions(true)}
              />

              {/* Suggestions dropdown */}
              {showSuggestions && ingredientSuggestions.length > 0 && (
                <View style={styles.suggestionBox}>
                  {ingredientSuggestions.map((k) => (
                    <TouchableOpacity
                      key={k}
                      style={styles.suggestionItem}
                      activeOpacity={0.85}
                      onPress={() => {
                        setEditName(toTitle(k));
                        setSelectedIngredientKey(k);
                        setShowSuggestions(false);
                      }}
                    >
                      <Text style={styles.suggestionText}>{toTitle(k)}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              <Text style={[styles.createLabel, { marginTop: 12 }]}>Quantity</Text>
              <TextInput
                value={editQuantity}
                onChangeText={setEditQuantity}
                style={styles.createInput}
                placeholder="Amount"
                placeholderTextColor="#e0c4c4"
                keyboardType="numeric"
                onFocus={() => setShowSuggestions(false)}
              />

              <Text style={[styles.createLabel, { marginTop: 12 }]}>Unit</Text>
              <TextInput
                value={editUnit}
                onChangeText={setEditUnit}
                style={styles.createInput}
                placeholder="x"
                placeholderTextColor="#e0c4c4"
                autoCapitalize="none"
                autoCorrect={false}
                onFocus={() => setShowSuggestions(false)}
              />

              <View style={styles.modalButtonsRow}>
                {isEditMode ? (
                  <TouchableOpacity
                    style={[styles.modalButton, styles.modalButtonDanger]}
                    onPress={deleteIngredient}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.modalButtonDangerText}>Delete</Text>
                  </TouchableOpacity>
                ) : (
                  <View />
                )}

                <View style={styles.modalButtonsRight}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.modalButtonSecondary]}
                    onPress={closeEdit}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.modalButtonSecondaryText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.modalButton, styles.modalButtonPrimary]}
                    onPress={isEditMode ? saveEdit : addIngredient}
                    activeOpacity={0.9}
                  >
                    <Text style={styles.modalButtonPrimaryText}>
                      {isEditMode ? "Save" : "Add"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default StockScreen;
