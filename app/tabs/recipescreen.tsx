// app/(tabs)/recipescreen.tsx

/* =========================================================
   Imports
========================================================= */
import { Feather, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getIngredientAsset, INGREDIENT_KEYS } from "../../src/ingredientImages";
import { styles } from "../../styles/recipescreen.styles";

/* =========================================================
   Types
========================================================= */
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

type ShoppingItem = {
  id: string;
  name: string;
  quantity: string;
  unit?: string;
  checked?: boolean;
};

/* =========================================================
   Storage keys + small helpers/constants
========================================================= */
const PANTRY_KEY = "kitchie.ingredients.v1";
const RECIPES_KEY = "kitchie.recipes.v1";
const SHOPPING_KEY = "kitchie.shopping.v1";

const normalize = (s: string) => s.trim().toLowerCase();

const DISH_IMAGE_CHOICES = [
  { key: "cake", emoji: "🍰", label: "Cake" },
  { key: "eggs", emoji: "🍳", label: "Eggs" },
  { key: "noodles", emoji: "🍜", label: "Noodles" },
  { key: "salad", emoji: "🥗", label: "Salad" },
  { key: "pizza", emoji: "🍕", label: "Pizza" },
  { key: "bento", emoji: "🍱", label: "Bento" },
];

/* =========================================================
   Component
========================================================= */
const RecipeScreen: FC = () => {
  /* -----------------------------
     Navigation + layout (responsive)
  ------------------------------ */
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isNarrow = width < 380;

  /* -----------------------------
     Core data state
  ------------------------------ */
  const [pantry, setPantry] = useState<PantryIngredient[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [query, setQuery] = useState("");

  /* -----------------------------
     Selection + filtering state
  ------------------------------ */
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [filterMode, setFilterMode] = useState<"all" | "missing">("all");

  /* -----------------------------
     Create modal state (draft fields)
  ------------------------------ */
  const [createOpen, setCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newIngredients, setNewIngredients] = useState<RecipeIngredient[]>([]);
  const [draftIngName, setDraftIngName] = useState("");
  const [draftIngQty, setDraftIngQty] = useState("");
  const [draftDishImageKey, setDraftDishImageKey] = useState<string>("cake");

  /* -----------------------------
     Edit modal state (reuses draft fields)
  ------------------------------ */
  const [editOpen, setEditOpen] = useState(false);

  /* -----------------------------
     Autocomplete state
  ------------------------------ */
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIngredientKey, setSelectedIngredientKey] = useState<string | null>(null);

  /* -----------------------------
     Shopping list dropdown state
  ------------------------------ */
  const [shoppingDropdownKey, setShoppingDropdownKey] = useState<string | null>(null);

  /* =========================================================
     Data loading (pantry + recipes)
     - Runs when tab/screen is focused
     - Resets filter to "all" on focus
  ========================================================= */
  useFocusEffect(
    useCallback(() => {
      let alive = true;

      // Reset filter to "all" whenever screen is focused
      setFilterMode("all");
      setShoppingDropdownKey(null);

      (async () => {
        try {
          const [pantryRaw, recipesRaw] = await Promise.all([
            AsyncStorage.getItem(PANTRY_KEY),
            AsyncStorage.getItem(RECIPES_KEY),
          ]);

          if (!alive) return;

          const pantryData: PantryIngredient[] = pantryRaw ? JSON.parse(pantryRaw) : [];
          const recipeData: Recipe[] = recipesRaw ? JSON.parse(recipesRaw) : [];

          setPantry(pantryData);
          setRecipes(recipeData);
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

  /* =========================================================
     Selection safety
     - Auto-select first recipe when list loads
     - If selected recipe gets deleted, select next
  ========================================================= */
  useEffect(() => {
    if (!selectedRecipe && recipes.length > 0) {
      setSelectedRecipe(recipes[0]);
      setFilterMode("all");
    }

    if (selectedRecipe && recipes.length > 0) {
      const stillExists = recipes.some((r) => r.id === selectedRecipe.id);
      if (!stillExists) {
        setSelectedRecipe(recipes[0] ?? null);
        setFilterMode("all");
      }
    }

    if (recipes.length === 0) setSelectedRecipe(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipes]);

  /* =========================================================
     Derived data (memoized)
  ========================================================= */

  /* -----------------------------
     Pantry name -> numeric qty map
  ------------------------------ */
  const pantryQtyMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of pantry) {
      const key = normalize(item.name);
      const qty = parseQty(item.quantity);
      map.set(key, qty);
    }
    return map;
  }, [pantry]);

  /* -----------------------------
     Recipe search filtering
  ------------------------------ */
  const filteredRecipes = useMemo(() => {
    const q = normalize(query);
    if (!q) return recipes;
    return recipes.filter((r) => normalize(r.title).includes(q));
  }, [query, recipes]);

  /* -----------------------------
     Ingredients panel list:
     - calculates has/missing based on pantry vs needed qty
     - applies filterMode (all vs missing)
  ------------------------------ */
  const panelIngredients = useMemo(() => {
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

  /* -----------------------------
     Autocomplete suggestions (ingredient keys)
  ------------------------------ */
  const ingredientSuggestions = useMemo(() => {
    const q = normalize(draftIngName);
    if (!q) return [];
    return INGREDIENT_KEYS.filter((k) => k.includes(q)).slice(0, 6);
  }, [draftIngName]);

  /* =========================================================
     Draft helpers (create/edit)
  ========================================================= */
  const resetRecipeDraft = () => {
    setNewTitle("");
    setNewIngredients([]);
    setDraftIngName("");
    setDraftIngQty("");
    setDraftDishImageKey("cake");
    setSelectedIngredientKey(null);
    setShowSuggestions(false);
  };

  const openCreateModal = () => {
    resetRecipeDraft();
    setCreateOpen(true);
  };

  const openEditModal = () => {
    if (!selectedRecipe) return;

    // Preload draft fields from selected recipe
    setNewTitle(selectedRecipe.title);
    setNewIngredients(selectedRecipe.ingredients ?? []);
    setDraftIngName("");
    setDraftIngQty("");
    setDraftDishImageKey(selectedRecipe.imageKey ?? "cake");
    setSelectedIngredientKey(null);
    setShowSuggestions(false);
    setEditOpen(true);
  };

  const addDraftIngredient = () => {
    const candidate = selectedIngredientKey ?? normalize(draftIngName);

    // Force selection from coded options
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

  /* =========================================================
     CRUD: Save new recipe / Save edited recipe / Delete recipe
  ========================================================= */
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
      setSelectedRecipe(recipe);
      setFilterMode("all");
      setCreateOpen(false);
    } catch (e) {
      console.warn("Failed to save recipe", e);
      Alert.alert("Error", "Could not save the recipe.");
    }
  };

  const saveEditedRecipe = async () => {
    if (!selectedRecipe) return;

    const title = newTitle.trim();
    if (!title) {
      Alert.alert("Missing name", "Please enter a dish name.");
      return;
    }
    if (newIngredients.length === 0) {
      Alert.alert("No ingredients", "Add at least 1 ingredient.");
      return;
    }

    try {
      const updated: Recipe = {
        ...selectedRecipe,
        title,
        imageKey: draftDishImageKey,
        ingredients: newIngredients,
      };

      const next = recipes.map((r) => (r.id === selectedRecipe.id ? updated : r));
      await AsyncStorage.setItem(RECIPES_KEY, JSON.stringify(next));

      setRecipes(next);
      setSelectedRecipe(updated);
      setFilterMode("all");
      setEditOpen(false);
    } catch (e) {
      console.warn("Failed to edit recipe", e);
      Alert.alert("Error", "Could not update the recipe.");
    }
  };

  const deleteSelectedRecipe = async () => {
    if (!selectedRecipe) return;

    Alert.alert("Delete recipe?", `Delete "${toTitle(selectedRecipe.title)}"? This can't be undone.`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const next = recipes.filter((r) => r.id !== selectedRecipe.id);
            await AsyncStorage.setItem(RECIPES_KEY, JSON.stringify(next));
            setRecipes(next);
          } catch (e) {
            console.warn("Failed to delete recipe", e);
            Alert.alert("Error", "Could not delete the recipe.");
          }
        },
      },
    ]);
  };

  /* =========================================================
     UI helpers
  ========================================================= */
  const dishEmoji = (imageKey?: string) =>
    DISH_IMAGE_CHOICES.find((x) => x.key === imageKey)?.emoji ?? "🍽️";

  /* =========================================================
     Finish Cooking (deduct ingredients from pantry)
  ========================================================= */
  const parseNumber = (v: unknown) => {
    const n = Number(String(v ?? "").replace(",", ".").trim());
    return Number.isFinite(n) ? n : 0;
  };

  const formatNumber = (n: number) => {
    const rounded = Math.round(n * 100) / 100;
    return Number.isInteger(rounded) ? String(rounded) : String(rounded);
  };

  const finishCookingConfirmed = async () => {
    if (!selectedRecipe) return;

    try {
      const pantryRaw = await AsyncStorage.getItem(PANTRY_KEY);
      const pantryNow: PantryIngredient[] = pantryRaw ? JSON.parse(pantryRaw) : [];

      const indexByName = new Map<string, number>();
      pantryNow.forEach((p, idx) => indexByName.set(normalize(p.name), idx));

      const nextPantry = [...pantryNow];

      for (const ri of selectedRecipe.ingredients) {
        const key = normalize(ri.name);
        const need = ri.quantity ?? 1;

        const idx = indexByName.get(key);
        const have = idx !== undefined ? parseNumber(nextPantry[idx].quantity) : 0;

        if (have < need) {
          Alert.alert(
            "Not enough ingredients",
            `You don't have enough ${toTitle(ri.name)}.\nNeed: x${need}\nHave: x${have}`
          );
          return;
        }

        const remaining = have - need;

        if (remaining <= 0) {
          nextPantry.splice(idx!, 1);

          // rebuild indices after splice
          indexByName.clear();
          nextPantry.forEach((p, i) => indexByName.set(normalize(p.name), i));
        } else {
          nextPantry[idx!] = { ...nextPantry[idx!], quantity: formatNumber(remaining) };
        }
      }

      await AsyncStorage.setItem(PANTRY_KEY, JSON.stringify(nextPantry));
      setPantry(nextPantry);

      Alert.alert("Done!", "Inventory updated ✅");
    } catch (e) {
      console.warn("Finish cooking failed", e);
      Alert.alert("Error", "Could not update inventory.");
    }
  };

  const finishCooking = () => {
    if (!selectedRecipe) return;

    const missing = panelIngredients.filter((x) => !x.hasIt);
    if (missing.length > 0) {
      Alert.alert("Missing ingredients", `You're missing: ${missing.map((m) => toTitle(m.name)).join(", ")}`);
      return;
    }

    Alert.alert("Finish cooking?", "This will deduct the required ingredients from your inventory.", [
      { text: "Cancel", style: "cancel" },
      { text: "Finish", style: "default", onPress: () => void finishCookingConfirmed() },
    ]);
  };

  /* =========================================================
     Add to Shopping List
  ========================================================= */
  const addToShoppingList = async (ingredient: { name: string; needQty: number; unit?: string }, skipConfirm = false) => {
    try {
      const raw = await AsyncStorage.getItem(SHOPPING_KEY);
      const shoppingList: ShoppingItem[] = raw ? JSON.parse(raw) : [];

      const nameKey = normalize(ingredient.name);
      const unitRaw = (ingredient.unit || "x").toLowerCase();

      // Check if already exists
      const existingIndex = shoppingList.findIndex(
        (item) =>
          normalize(item.name) === nameKey && (item.unit?.toLowerCase() || "x") === unitRaw
      );

      // If exists and we haven't confirmed yet, ask user
      if (existingIndex !== -1 && !skipConfirm) {
        const existing = shoppingList[existingIndex];
        Alert.alert(
          "Already in list",
          `You already have ${existing.quantity} ${existing.unit} of ${toTitle(ingredient.name)} in your Shopping List. Add ${ingredient.needQty} more?`,
          [
            { text: "No", style: "cancel", onPress: () => setShoppingDropdownKey(null) },
            { text: "Yes", style: "default", onPress: () => addToShoppingList(ingredient, true) },
          ]
        );
        return;
      }

      if (existingIndex !== -1) {
        // Update quantity
        const existing = shoppingList[existingIndex];
        const existingQty = parseNumber(existing.quantity);
        const nextQty = existingQty + ingredient.needQty;

        shoppingList[existingIndex] = {
          ...existing,
          quantity: formatNumber(nextQty),
        };
      } else {
        // Add new item
        const newItem: ShoppingItem = {
          id: Date.now().toString(),
          name: ingredient.name,
          quantity: formatNumber(ingredient.needQty),
          unit: unitRaw,
          checked: false,
        };
        shoppingList.push(newItem);
      }

      await AsyncStorage.setItem(SHOPPING_KEY, JSON.stringify(shoppingList));
      setShoppingDropdownKey(null);
      Alert.alert("Added!", `${toTitle(ingredient.name)} added to shopping list.`);
    } catch (e) {
      console.warn("Failed to add to shopping list", e);
      Alert.alert("Error", "Could not add to shopping list.");
    }
  };

  const handleIngredientPress = (ing: { key: string; hasIt: boolean; name: string; needQty: number; unit?: string }) => {
    if (!ing.hasIt) {
      // Toggle dropdown for missing ingredients
      setShoppingDropdownKey(shoppingDropdownKey === ing.key ? null : ing.key);
    }
  };

  /* =========================================================
     Add all missing ingredients to Shopping List
  ========================================================= */
  const addAllMissingToShoppingList = async () => {
    const missingIngredients = panelIngredients.filter((x) => !x.hasIt);
    
    if (missingIngredients.length === 0) {
      Alert.alert("No missing ingredients", "All ingredients are in stock!");
      return;
    }

    try {
      const raw = await AsyncStorage.getItem(SHOPPING_KEY);
      let shoppingList: ShoppingItem[] = raw ? JSON.parse(raw) : [];

      for (const ingredient of missingIngredients) {
        const nameKey = normalize(ingredient.name);
        const unitRaw = (ingredient.unit || "x").toLowerCase();

        const existingIndex = shoppingList.findIndex(
          (item) =>
            normalize(item.name) === nameKey && (item.unit?.toLowerCase() || "x") === unitRaw
        );

        if (existingIndex !== -1) {
          // Update quantity
          const existing = shoppingList[existingIndex];
          const existingQty = parseNumber(existing.quantity);
          const nextQty = existingQty + ingredient.needQty;

          shoppingList[existingIndex] = {
            ...existing,
            quantity: formatNumber(nextQty),
          };
        } else {
          // Add new item
          const newItem: ShoppingItem = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            name: ingredient.name,
            quantity: formatNumber(ingredient.needQty),
            unit: unitRaw,
            checked: false,
          };
          shoppingList.push(newItem);
        }
      }

      await AsyncStorage.setItem(SHOPPING_KEY, JSON.stringify(shoppingList));
      Alert.alert("Added!", `${missingIngredients.length} missing ingredient${missingIngredients.length > 1 ? 's' : ''} added to shopping list.`);
    } catch (e) {
      console.warn("Failed to add all to shopping list", e);
      Alert.alert("Error", "Could not add to shopping list.");
    }
  };

  const handleMissingFilterPress = () => {
    if (filterMode === "missing") {
      // Already in missing mode, ask if user wants to add all to shopping list
      const missingCount = panelIngredients.filter((x) => !x.hasIt).length;
      
      if (missingCount === 0) {
        Alert.alert("No missing ingredients", "All ingredients are in stock!");
        return;
      }

      Alert.alert(
        "Add to Shopping List?",
        `Would you like to add all ${missingCount} missing ingredient${missingCount > 1 ? 's' : ''} to your shopping list?`,
        [
          { text: "No", style: "cancel" },
          { text: "Yes", style: "default", onPress: addAllMissingToShoppingList },
        ]
      );
    } else {
      setFilterMode("missing");
    }
  };

  /* =========================================================
     Render
  ========================================================= */
  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        {/* ===================== HEADER ===================== */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
            <Ionicons name="chevron-back" size={24} color="#f29f9b" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Recipes</Text>

          <TouchableOpacity onPress={openCreateModal} style={styles.iconButton} activeOpacity={0.8}>
            <Ionicons name="add" size={24} color="#f29f9b" />
          </TouchableOpacity>
        </View>

        {/* ===================== SPLIT VIEW ===================== */}
        <View style={[styles.splitWrap, isNarrow && styles.splitWrapNarrow]}>
          {/* ---------- LEFT PANEL: Recipe list + search ---------- */}
          <View style={[styles.panel, styles.leftPanel]}>
            <Text style={styles.panelTitle}>Find a Recipe</Text>

            <View style={styles.searchBar}>
              <Feather name="search" size={18} color="#b7747c" />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search recipes"
                placeholderTextColor="#e0c4c4"
                style={styles.searchInput}
              />
            </View>

            {recipes.length === 0 ? (
              <View style={styles.emptyBox}>
                <Text style={styles.emptyTitle}>No recipes yet</Text>
                <Text style={styles.emptySub}>Tap + to create one.</Text>
              </View>
            ) : (
              <FlatList
                data={filteredRecipes}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                style={styles.list}
                renderItem={({ item }) => {
                  const selected = item.id === selectedRecipe?.id;
                  return (
                    <TouchableOpacity
                      style={[styles.recipeCard, selected && styles.recipeCardSelected]}
                      activeOpacity={0.85}
                      onPress={() => {
                        setSelectedRecipe(item);
                        setFilterMode("all");
                        setShoppingDropdownKey(null);
                      }}
                    >
                      <View style={styles.recipeIconWrap}>
                        <Text style={styles.recipeIconEmoji}>{dishEmoji(item.imageKey)}</Text>
                      </View>

                      <Text style={styles.recipeTitle} numberOfLines={1}>
                        {toTitle(item.title)}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
              />
            )}
          </View>

          {/* ---------- RIGHT PANEL: Selected recipe details ---------- */}
          <View style={[styles.panel, styles.rightPanel]}>
            {!selectedRecipe ? (
              <View style={styles.rightEmpty}>
                <Text style={styles.rightEmptyTitle}>No recipe selected</Text>
                <Text style={styles.rightEmptySub}>Pick a recipe from the list or create one.</Text>
              </View>
            ) : (
              <>
                {/* Title + filter chips */}
                <View style={styles.rightHeaderRow}>
                  <Text style={styles.panelTitle}>{toTitle(selectedRecipe.title)}</Text>

                  <View style={styles.filterRow}>
                    <TouchableOpacity onPress={() => setFilterMode("all")} activeOpacity={0.85}>
                      <Text style={[styles.filterChip, filterMode === "all" && styles.filterChipActive]}>
                        All
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleMissingFilterPress} activeOpacity={0.85}>
                      <Text style={[styles.filterChip, filterMode === "missing" && styles.filterChipActive]}>
                        X
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Ingredient list */}
                <View style={styles.ingredientsCard}>
                  <ScrollView showsVerticalScrollIndicator={false}>
                    {panelIngredients.map((ing) => {
                      const asset = getIngredientAsset(ing.name);
                      const muted = !ing.hasIt;
                      const showDropdown = shoppingDropdownKey === ing.key;

                      return (
                        <View key={ing.key}>
                          <TouchableOpacity
                            style={styles.ingredientRow}
                            activeOpacity={muted ? 0.7 : 1}
                            onPress={() => handleIngredientPress(ing)}
                          >
                            <View style={styles.ingredientImageWrap}>
                              <Image
                                source={asset.source}
                                style={[
                                  styles.ingredientImageBase,
                                  asset.style,
                                  muted && styles.missingIngredientImage,
                                ]}
                                contentFit="contain"
                              />
                            </View>

                            <Text style={[styles.ingredientText, muted && styles.mutedText]}>
                              {toTitle(ing.name)}{" "}
                              <Text style={styles.ingredientAmount}>{formatNeed(ing.needQty, ing.unit)}</Text>
                            </Text>

                            <Ionicons
                              name={ing.hasIt ? "checkmark-circle" : "close-circle"}
                              size={20}
                              color={ing.hasIt ? "#3CB371" : "#C7B1B1"}
                            />
                          </TouchableOpacity>

                          {/* Shopping list dropdown */}
                          {showDropdown && (
                            <View style={styles.shoppingDropdown}>
                              <TouchableOpacity
                                style={styles.shoppingDropdownItem}
                                activeOpacity={0.85}
                                onPress={() => addToShoppingList(ing)}
                              >
                                <Ionicons name="cart-outline" size={16} color="#f29f9b" />
                                <Text style={styles.shoppingDropdownText}>Add to Shopping List</Text>
                              </TouchableOpacity>
                            </View>
                          )}
                        </View>
                      );
                    })}
                  </ScrollView>
                </View>

                {/* Actions */}
                <TouchableOpacity style={styles.startButton} activeOpacity={0.9} onPress={finishCooking}>
                  <Ionicons name="flame" size={18} color="#fff" />
                  <Text style={styles.startButtonText}>Cook!</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.editButton} activeOpacity={0.9} onPress={openEditModal}>
                  <Ionicons name="create-outline" size={18} color="#ffe9dc" />
                  <Text style={styles.editButtonText}>Edit recipe</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={deleteSelectedRecipe} style={styles.deleteButton} activeOpacity={0.9}>
                  <Ionicons name="trash-outline" size={18} color="#ffe9dc" />
                  <Text style={styles.deleteButtonText}>Delete recipe</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        {/* ===================== CREATE RECIPE MODAL ===================== */}
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
              <Text style={styles.createTitle}>New Recipe</Text>

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
                placeholderTextColor="#e0c4c4"
                style={styles.createInput}
              />

              {/* Required ingredients */}
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
                  placeholderTextColor="#e0c4c4"
                  style={[styles.createInput, { flex: 1 }]}
                  autoCorrect={false}
                  autoCapitalize="none"
                  onFocus={() => setShowSuggestions(true)}
                />

                <TextInput
                  value={draftIngQty}
                  onChangeText={setDraftIngQty}
                  placeholder="qty"
                  placeholderTextColor="#e0c4c4"
                  keyboardType="numeric"
                  style={[styles.createInput, { width: 80 }]}
                />

                <TouchableOpacity onPress={addDraftIngredient} style={styles.addIngButton}>
                  <Ionicons name="add" size={18} color="#ffe9dc" />
                </TouchableOpacity>
              </View>

              {/* Suggestions dropdown */}
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

              {/* Draft ingredients preview */}
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

              {/* Dish image picker */}
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

              {/* Save */}
              <TouchableOpacity onPress={saveRecipe} style={styles.saveButton} activeOpacity={0.9}>
                <Text style={styles.saveButtonText}>Save Recipe</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </Modal>

        {/* ===================== EDIT RECIPE MODAL ===================== */}
        <Modal
          visible={editOpen}
          transparent
          animationType="fade"
          onRequestClose={() => setEditOpen(false)}
        >
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => {
              setShowSuggestions(false);
              setEditOpen(false);
            }}
          >
            <View />
          </Pressable>

          <View style={styles.createModalCard}>
            <View style={styles.createHeaderRow}>
              <Text style={styles.createTitle}>Edit Recipe</Text>

              <TouchableOpacity
                onPress={() => {
                  setShowSuggestions(false);
                  setEditOpen(false);
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
                placeholderTextColor="#e0c4c4"
                style={styles.createInput}
              />

              {/* Required ingredients */}
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
                  placeholderTextColor="#e0c4c4"
                  style={[styles.createInput, { flex: 1 }]}
                  autoCorrect={false}
                  autoCapitalize="none"
                  onFocus={() => setShowSuggestions(true)}
                />

                <TextInput
                  value={draftIngQty}
                  onChangeText={setDraftIngQty}
                  placeholder="qty"
                  placeholderTextColor="#e0c4c4"
                  keyboardType="numeric"
                  style={[styles.createInput, { width: 80 }]}
                />

                <TouchableOpacity onPress={addDraftIngredient} style={styles.addIngButton}>
                  <Ionicons name="add" size={18} color="#ffe9dc" />
                </TouchableOpacity>
              </View>

              {/* Suggestions dropdown */}
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

              {/* Draft ingredients preview */}
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

              {/* Dish image picker */}
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

              {/* Save changes */}
              <TouchableOpacity onPress={saveEditedRecipe} style={styles.saveButton} activeOpacity={0.9}>
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default RecipeScreen;

/* =========================================================
   Helpers (pure functions)
========================================================= */
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
  const s = String(q ?? "");
  const m = s.match(/(\d+(\.\d+)?)/);
  return m ? Number(m[1]) : 0;
}
