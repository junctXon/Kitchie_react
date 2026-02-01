// app/(tabs)/recipescreen.tsx
import { Feather, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { FC, useCallback, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  getIngredientAsset,
  INGREDIENT_KEYS, // ✅ make sure you exported this from src/ingredientImages.ts
} from "../../src/ingredientImages";
import { styles } from "../../styles/recipescreen.styles";

type PantryIngredient = {
  id: string;
  name: string;
  quantity: string;
  unit?: string;
};

type RecipeIngredient = {
  name: string;
  quantity?: number;
  unit?: string;
};

type Recipe = {
  id: string;
  title: string;
  imageKey?: string;
  ingredients: RecipeIngredient[];
};

const PANTRY_KEY = "kitchie.ingredients.v1";
const RECIPES_KEY = "kitchie.recipes.v1";

const normalize = (s: string) => s.trim().toLowerCase();

const DISH_IMAGE_CHOICES = [
  { key: "cake", emoji: "🍰", label: "Cake" },
  { key: "eggs", emoji: "🍳", label: "Eggs" },
  { key: "noodles", emoji: "🍜", label: "Noodles" },
  { key: "salad", emoji: "🥗", label: "Salad" },
  { key: "pizza", emoji: "🍕", label: "Pizza" },
  { key: "bento", emoji: "🍱", label: "Bento" },
];

const RecipeScreen: FC = () => {
  const router = useRouter();

  const [pantry, setPantry] = useState<PantryIngredient[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [query, setQuery] = useState("");

  // recipe details sheet
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [filterMode, setFilterMode] = useState<"all" | "missing">("all");

  // create recipe modal
  const [createOpen, setCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newIngredients, setNewIngredients] = useState<RecipeIngredient[]>([]);
  const [draftIngName, setDraftIngName] = useState("");
  const [draftIngQty, setDraftIngQty] = useState("");
  const [draftDishImageKey, setDraftDishImageKey] = useState<string>("cake");

  // ✅ autocomplete state
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIngredientKey, setSelectedIngredientKey] = useState<string | null>(null);

  // load pantry + recipes
  useFocusEffect(
    useCallback(() => {
      let alive = true;

      (async () => {
        try {
          const [pantryRaw, recipesRaw] = await Promise.all([
            AsyncStorage.getItem(PANTRY_KEY),
            AsyncStorage.getItem(RECIPES_KEY),
          ]);

          if (!alive) return;

          setPantry(pantryRaw ? JSON.parse(pantryRaw) : []);
          setRecipes(recipesRaw ? JSON.parse(recipesRaw) : []);
        } catch (e) {
          console.warn("Failed to load pantry/recipes", e);
          if (!alive) return;
          setPantry([]);
          setRecipes([]);
        }
      })();

      return () => {
        alive = false;
      };
    }, [])
  );

  // map pantry name -> qty
  const pantryQtyMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of pantry) {
      const key = normalize(item.name);
      const qty = parseQty(item.quantity);
      map.set(key, qty);
    }
    return map;
  }, [pantry]);

  // search recipes
  const filteredRecipes = useMemo(() => {
    const q = normalize(query);
    if (!q) return recipes;
    return recipes.filter((r) => normalize(r.title).includes(q));
  }, [query, recipes]);

  // bottom sheet ingredient list (with has/missing)
  const sheetIngredients = useMemo(() => {
    if (!selectedRecipe) return [];

    const list = selectedRecipe.ingredients.map((ri) => {
      const key = normalize(ri.name);
      const haveQty = pantryQtyMap.get(key) ?? 0;
      const needQty = ri.quantity ?? 1;
      const hasIt = haveQty >= needQty && haveQty > 0;

      return { ...ri, key, hasIt, haveQty, needQty };
    });

    return filterMode === "missing" ? list.filter((x) => !x.hasIt) : list;
  }, [selectedRecipe, pantryQtyMap, filterMode]);

  // ✅ autocomplete suggestions (from INGREDIENT_KEYS)
  const ingredientSuggestions = useMemo(() => {
    const q = normalize(draftIngName);
    if (!q) return [];
    return INGREDIENT_KEYS.filter((k) => k.includes(q)).slice(0, 6);
  }, [draftIngName]);

  const openCreateModal = () => {
    setNewTitle("");
    setNewIngredients([]);
    setDraftIngName("");
    setDraftIngQty("");
    setDraftDishImageKey("cake");

    setSelectedIngredientKey(null);
    setShowSuggestions(false);

    setCreateOpen(true);
  };

  const addDraftIngredient = () => {
    const candidate = selectedIngredientKey ?? normalize(draftIngName);

    // ✅ FORCE selection from coded options
    if (!INGREDIENT_KEYS.includes(candidate)) {
      Alert.alert("Pick from the list", "Please select an ingredient from suggestions.");
      return;
    }

    const qtyNum = Number(draftIngQty);
    const quantity = Number.isFinite(qtyNum) && qtyNum > 0 ? qtyNum : 1;

    setNewIngredients((prev) => [...prev, { name: candidate, quantity }]);

    setDraftIngName("");
    setDraftIngQty("");
    setSelectedIngredientKey(null);
    setShowSuggestions(false);
  };

  const removeIngredientAt = (idx: number) => {
    setNewIngredients((prev) => prev.filter((_, i) => i !== idx));
  };

  const saveRecipe = async () => {
    const title = newTitle.trim();

    if (!title) {
      Alert.alert("Missing name", "Please enter a dish name.");
      return;
    }
    if (newIngredients.length === 0) {
      Alert.alert("No ingredients", "Add at least 1 ingredient.");
      return;
    }

    const recipe: Recipe = {
      id: `${Date.now()}`,
      title,
      imageKey: draftDishImageKey,
      ingredients: newIngredients,
    };

    try {
      const next = [recipe, ...recipes];
      await AsyncStorage.setItem(RECIPES_KEY, JSON.stringify(next));
      setRecipes(next);
      setCreateOpen(false);
    } catch (e) {
      console.warn("Failed to save recipe", e);
      Alert.alert("Error", "Could not save the recipe.");
    }
  };

  const deleteSelectedRecipe = async () => {
    if (!selectedRecipe) return;

    Alert.alert(
      "Delete recipe?",
      `Delete "${selectedRecipe.title}"? This can’t be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const next = recipes.filter((r) => r.id !== selectedRecipe.id);
              await AsyncStorage.setItem(RECIPES_KEY, JSON.stringify(next));
              setRecipes(next);
              setSelectedRecipe(null); // close sheet
            } catch (e) {
              console.warn("Failed to delete recipe", e);
              Alert.alert("Error", "Could not delete the recipe.");
            }
          },
        },
      ]
    );
  };

  const dishEmoji = (imageKey?: string) =>
    DISH_IMAGE_CHOICES.find((x) => x.key === imageKey)?.emoji ?? "🍽️";

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
            <Ionicons name="chevron-back" size={24} color="#f29f9b" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Recipes</Text>

          <TouchableOpacity onPress={openCreateModal} style={styles.iconButton} activeOpacity={0.8}>
            <Ionicons name="add" size={24} color="#f29f9b" />
          </TouchableOpacity>
        </View>

        {/* SEARCH */}
        <View style={styles.searchBar}>
          <Feather name="search" size={18} color="#b7747c" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search recipes"
            placeholderTextColor="#b7747c"
            style={styles.searchInput}
          />
        </View>

        {/* LIST */}
        {recipes.length === 0 ? (
          <View style={{ paddingTop: 24, alignItems: "center" }}>
            <Text style={{ color: "#b7747c", fontWeight: "700", fontSize: 16 }}>
              No recipes yet
            </Text>
            <Text style={{ marginTop: 6, color: "#b7747c", opacity: 0.8 }}>
              Tap + to create one.
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredRecipes}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.recipeCard}
                onPress={() => {
                  setSelectedRecipe(item);
                  setFilterMode("all");
                }}
              >
                <View style={styles.recipeIconWrap}>
                  <Text style={styles.recipeIconEmoji}>{dishEmoji(item.imageKey)}</Text>
                </View>
                <Text style={styles.recipeTitle}>{item.title}</Text>
              </TouchableOpacity>
            )}
          />
        )}

        {/* RECIPE DETAILS SHEET */}
        <Modal
          visible={!!selectedRecipe}
          transparent
          animationType="slide"
          onRequestClose={() => setSelectedRecipe(null)}
        >
          <Pressable style={styles.modalBackdrop} onPress={() => setSelectedRecipe(null)}>
            <View />
          </Pressable>

          <View style={styles.sheet}>
            <View style={styles.sheetHandle} />

            <View style={styles.sheetHeaderRow}>
              <Text style={styles.sheetTitle}>{selectedRecipe?.title} Recipe</Text>

              <TouchableOpacity
                onPress={() => setSelectedRecipe(null)}
                style={styles.sheetClose}
                activeOpacity={0.8}
              >
                <Ionicons name="close" size={22} color="#b7747c" />
              </TouchableOpacity>
            </View>

            <View style={styles.filterRow}>
              <Text style={styles.filterLabel}>Filter Ingredients:</Text>

              <TouchableOpacity onPress={() => setFilterMode("all")} activeOpacity={0.8}>
                <Text style={[styles.filterOption, filterMode === "all" && styles.filterActive]}>
                  [All]
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setFilterMode("missing")} activeOpacity={0.8}>
                <Text
                  style={[styles.filterOption, filterMode === "missing" && styles.filterActive]}
                >
                  [Missing]
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.ingredientGrid}>
              {sheetIngredients.map((ing) => {
                const asset = getIngredientAsset(ing.name);
                return (
                  <View key={ing.key} style={styles.ingredientTile}>
                    <View style={styles.ingredientImageWrap}>
                      <Image
                        source={asset.source}
                        style={[
                          styles.ingredientImageBase,
                          asset.style,
                          !ing.hasIt && styles.missingIngredientImage,
                        ]}
                        contentFit="contain"
                      />
                      {!ing.hasIt && (
                        <View style={styles.missingOverlay}>
                          <Text style={styles.missingOverlayText}>Missing</Text>
                        </View>
                      )}
                    </View>

                    <Text style={[styles.ingredientName, !ing.hasIt && styles.mutedText]}>
                      {toTitle(ing.name)}
                    </Text>
                    <Text style={[styles.ingredientQty, !ing.hasIt && styles.mutedText]}>
                      {formatNeed(ing.needQty, ing.unit)}
                    </Text>
                  </View>
                );
              })}
            </View>

            {/* ✅ DELETE BUTTON */}
            <TouchableOpacity
              onPress={deleteSelectedRecipe}
              style={styles.deleteButton}
              activeOpacity={0.9}
            >
              <Ionicons name="trash-outline" size={18} color="#ffe9dc" />
              <Text style={styles.deleteButtonText}>Delete recipe</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        {/* CREATE RECIPE MODAL */}
        <Modal
          visible={createOpen}
          transparent
          animationType="fade"
          onRequestClose={() => setCreateOpen(false)}
        >
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => {
              setShowSuggestions(false);
              setCreateOpen(false);
            }}
          >
            <View />
          </Pressable>

          <View style={styles.createModalCard}>
            <View style={styles.createHeaderRow}>
              <Text style={styles.createTitle}>Create Recipe</Text>

              <TouchableOpacity
                onPress={() => {
                  setShowSuggestions(false);
                  setCreateOpen(false);
                }}
                style={styles.sheetClose}
                activeOpacity={0.8}
              >
                <Ionicons name="close" size={22} color="#b7747c" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Dish name */}
              <Text style={styles.createLabel}>Dish name</Text>
              <TextInput
                value={newTitle}
                onChangeText={setNewTitle}
                placeholder="e.g. Carrot Cake"
                placeholderTextColor="#b7747c"
                style={styles.createInput}
              />

              {/* Ingredients */}
              <Text style={[styles.createLabel, { marginTop: 14 }]}>Required ingredients</Text>

              <View style={styles.addIngRow}>
                <TextInput
                  value={draftIngName}
                  onChangeText={(t) => {
                    setDraftIngName(t);
                    setSelectedIngredientKey(null);
                    setShowSuggestions(true);
                  }}
                  placeholder="Ingredient name"
                  placeholderTextColor="#b7747c"
                  style={[styles.createInput, { flex: 1 }]}
                  autoCorrect={false}
                  autoCapitalize="none"
                  onFocus={() => setShowSuggestions(true)}
                />

                <TextInput
                  value={draftIngQty}
                  onChangeText={setDraftIngQty}
                  placeholder="qty"
                  placeholderTextColor="#b7747c"
                  keyboardType="numeric"
                  style={[styles.createInput, { width: 80 }]}
                />

                <TouchableOpacity onPress={addDraftIngredient} style={styles.addIngButton}>
                  <Ionicons name="add" size={18} color="#ffe9dc" />
                </TouchableOpacity>
              </View>

              {/* ✅ AUTOCOMPLETE DROPDOWN */}
              {showSuggestions && ingredientSuggestions.length > 0 && (
                <View style={styles.suggestionBox}>
                  {ingredientSuggestions.map((k) => (
                    <TouchableOpacity
                      key={k}
                      style={styles.suggestionItem}
                      activeOpacity={0.85}
                      onPress={() => {
                        setDraftIngName(k);
                        setSelectedIngredientKey(k);
                        setShowSuggestions(false);
                      }}
                    >
                      <Text style={styles.suggestionText}>{toTitle(k)}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {newIngredients.length === 0 ? (
                <Text style={styles.hintText}>Add ingredients above.</Text>
              ) : (
                <View style={{ marginTop: 8 }}>
                  {newIngredients.map((ing, idx) => (
                    <View key={`${ing.name}-${idx}`} style={styles.ingChipRow}>
                      <Text style={styles.ingChipText}>
                        {toTitle(ing.name)} {ing.quantity ? `x${ing.quantity}` : ""}
                      </Text>
                      <TouchableOpacity onPress={() => removeIngredientAt(idx)} activeOpacity={0.8}>
                        <Ionicons name="trash-outline" size={18} color="#b7747c" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}

              {/* Dish image picker (v1) */}
              <Text style={[styles.createLabel, { marginTop: 14 }]}>Dish image</Text>

              <View style={styles.dishPickerRow}>
                {DISH_IMAGE_CHOICES.map((opt) => {
                  const selected = opt.key === draftDishImageKey;
                  return (
                    <TouchableOpacity
                      key={opt.key}
                      onPress={() => setDraftDishImageKey(opt.key)}
                      style={[styles.dishPick, selected && styles.dishPickActive]}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.dishPickEmoji}>{opt.emoji}</Text>
                      <Text style={styles.dishPickLabel}>{opt.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <TouchableOpacity onPress={saveRecipe} style={styles.saveButton} activeOpacity={0.9}>
                <Text style={styles.saveButtonText}>Save Recipe</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default RecipeScreen;

// helpers
function toTitle(s: string) {
  return s
    .trim()
    .split(" ")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w))
    .join(" ");
}

function formatNeed(qty: number, unit?: string) {
  if (!qty) return "";
  if (!unit) return `x${qty}`;
  return `${qty} ${unit}`;
}

function parseQty(q: unknown) {
  // handles "5", "5x", "5 x", "x5" etc
  const s = String(q ?? "");
  const m = s.match(/(\d+(\.\d+)?)/);
  return m ? Number(m[1]) : 0;
}
