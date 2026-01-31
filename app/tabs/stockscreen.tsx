import { Feather, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { FC, useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../../styles/stockscreen.styles";

import { getIngredientImage } from "../../src/ingredientImages";

type Ingredient = {
  id: string;
  name: string;
  quantity: string;
  unit?: string;
};

const STORAGE_KEY = "kitchie.ingredients.v1"; // User data - unique to device

const StockScreen: FC = () => {
  const router = useRouter();

  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [selectedItem, setSelectedItem] = useState<Ingredient | null>(null);
  const [editName, setEditName] = useState("");
  const [editQuantity, setEditQuantity] = useState("");
  const [editUnit, setEditUnit] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  //  LOAD once on mount
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setIngredients(JSON.parse(raw));
      } catch (e) {
        console.warn("Failed to load ingredients", e);
      }
    })();
  }, []);

  //  SAVE whenever ingredients changes
  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(ingredients));
      } catch (e) {
        console.warn("Failed to save ingredients", e);
      }
    })();
  }, [ingredients]);

  const openEdit = (item: Ingredient) => {
    setSelectedItem(item);
    setEditName(item.name);
    setEditQuantity(item.quantity);
    setEditUnit(item.unit || "");
    setModalVisible(true);
  };

  const closeEdit = () => {
    setModalVisible(false);
    setSelectedItem(null);
    setEditName("");
    setEditQuantity("");
    setEditUnit("");
  };

  const openAdd = () => {
    setSelectedItem(null);
    setEditName("");
    setEditQuantity("");
    setEditUnit("x");
    setModalVisible(true);
  };

  const isEditMode = !!selectedItem;

  const addIngredient = () => {
    const name = editName.trim();
    const qty = editQuantity.trim();

    if (!name || !qty) return;

    const newItem: Ingredient = {
      id: Date.now().toString(),
      name,
      quantity: qty,
      unit: editUnit.trim() || "x",
    };

    setIngredients((prev) => [...prev, newItem]);
    closeEdit();
  };

  const saveEdit = () => {
    if (!selectedItem) return;

    setIngredients((prev) =>
      prev.map((ing) =>
        ing.id === selectedItem.id
          ? {
              ...ing,
              name: editName.trim() || ing.name,
              quantity: editQuantity.trim() || ing.quantity,
              unit: editUnit.trim() || "x",
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
    const imageSource = getIngredientImage(item.name);

    return (
      <TouchableOpacity
        style={styles.itemCard}
        activeOpacity={0.8}
        onPress={() => openEdit(item)}
      >
        <View style={styles.itemLeftRow}>
          <Image source={imageSource} style={styles.itemImage} />
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
          <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
            <Ionicons name="chevron-back" size={24} color="#f29f9b" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Inventory</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity onPress={openAdd} style={styles.iconButton}>
              <Feather name="plus" size={22} color="#f29f9b" />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.subtitle}>Look at our assortment of deliciousness.</Text>

        <FlatList
          data={ingredients}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          numColumns={4}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.subtitle}>
              No ingredients yet. Tap + to add one.
            </Text>
          }
        />

        {/* MODAL */}
        <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={closeEdit}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>
                {isEditMode ? "Edit Ingredient" : "Add Ingredient"}
              </Text>

              <Text style={styles.modalLabel}>Name</Text>
              <TextInput
                value={editName}
                onChangeText={setEditName}
                style={styles.input}
                placeholder="What goodies?"
                placeholderTextColor="#cfa9a5"
              />

              <Text style={styles.modalLabel}>Quantity</Text>
              <TextInput
                value={editQuantity}
                onChangeText={setEditQuantity}
                style={styles.input}
                placeholder="Amount"
                placeholderTextColor="#cfa9a5"
                keyboardType="numeric"
              />

              <View style={styles.modalButtonsRow}>
                {isEditMode && (
                  <TouchableOpacity
                    style={[styles.modalButton, styles.modalButtonDanger]}
                    onPress={deleteIngredient}
                  >
                    <Text style={styles.modalButtonDangerText}>Delete</Text>
                  </TouchableOpacity>
                )}

                <View style={styles.modalButtonsRight}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.modalButtonSecondary]}
                    onPress={closeEdit}
                  >
                    <Text style={styles.modalButtonSecondaryText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.modalButton, styles.modalButtonPrimary]}
                    onPress={isEditMode ? saveEdit : addIngredient}
                  >
                    <Text style={styles.modalButtonPrimaryText}>
                      {isEditMode ? "Save" : "Add"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default StockScreen;
