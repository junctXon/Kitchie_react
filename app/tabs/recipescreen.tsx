// app/(tabs)/recipescreen.tsx

/* =========================================================
   Imports
========================================================= */
import { Feather, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { FC, useCallback, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  LayoutAnimation,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getIngredientAsset, INGREDIENT_KEYS } from "../../src/ingredientImages";
import { styles } from "../../styles/recipescreen.styles";

/* =========================================================
   Enable LayoutAnimation on Android
========================================================= */
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

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
     Navigation
  ------------------------------ */
  const router = useRouter();

  /* -----------------------------
     Core data state
  ------------------------------ */
  const [pantry, setPantry] = useState<PantryIngredient[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [query, setQuery] = useState("");

  /* -----------------------------
     Expanded recipe ID for collapsible
  ------------------------------ */
  const [expandedRecipeId, setExpandedRecipeId] = useState<string | null>(null);

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
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);

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
  ========================================================= */
  useFocusEffect(
    useCallback(() => {
      let alive = true;

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
     Get ingredients with has/missing status for a recipe
  ------------------------------ */
  const getRecipeIngredients = useCallback(
    (recipe: Recipe) => {
      return recipe.ingredients.map((ri) => {
        const key = normalize(ri.name);
        const haveQty = pantryQtyMap.get(key) ?? 0;
        const needQty = ri.quantity ?? 1;
        const hasIt = haveQty >= needQty && haveQty > 0;

        return { ...ri, key, hasIt, haveQty, needQty };
      });
    },
    [pantryQtyMap]
  );

  /* -----------------------------
     Get missing ingredients message for a recipe
  ------------------------------ */
  const getMissingMessage = useCallback(
    (recipe: Recipe) => {
      const ingredients = getRecipeIngredients(recipe);
      const missing = ingredients.filter((i) => !i.hasIt);
      if (missing.length === 0) return null;
      const names = missing.map((m) => toTitle(m.name)).join(" and ");
      return `Collect more ${names} to make ${toTitle(recipe.title)}!`;
    },
    [getRecipeIngredients]
  );

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

  const openEditModal = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setNewTitle(recipe.title);
    setNewIngredients(recipe.ingredients ?? []);
    setDraftIngName("");
    setDraftIngQty("");
    setDraftDishImageKey(recipe.imageKey ?? "cake");
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
      setExpandedRecipeId(recipe.id);
      setCreateOpen(false);
    } catch (e) {
      console.warn("Failed to save recipe", e);
      Alert.alert("Error", "Could not save the recipe.");
    }
  };

  const saveEditedRecipe = async () => {
    if (!editingRecipe) return;

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
        ...editingRecipe,
        title,
        imageKey: draftDishImageKey,
        ingredients: newIngredients,
      };

      const next = recipes.map((r) => (r.id === editingRecipe.id ? updated : r));
      await AsyncStorage.setItem(RECIPES_KEY, JSON.stringify(next));

      setRecipes(next);
      setEditOpen(false);
      setEditingRecipe(null);
    } catch (e) {
      console.warn("Failed to edit recipe", e);
      Alert.alert("Error", "Could not update the recipe.");
    }
  };

  const deleteRecipe = async (recipe: Recipe) => {
    Alert.alert("Delete recipe?", `Delete "${toTitle(recipe.title)}"? This can't be undone.`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const next = recipes.filter((r) => r.id !== recipe.id);
            await AsyncStorage.setItem(RECIPES_KEY, JSON.stringify(next));
            setRecipes(next);
            if (expandedRecipeId === recipe.id) {
              setExpandedRecipeId(null);
            }
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

  const toggleExpand = (recipeId: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedRecipeId(expandedRecipeId === recipeId ? null : recipeId);
    setShoppingDropdownKey(null);
  };

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

  const finishCookingConfirmed = async (recipe: Recipe) => {
    try {
      const pantryRaw = await AsyncStorage.getItem(PANTRY_KEY);
      const pantryNow: PantryIngredient[] = pantryRaw ? JSON.parse(pantryRaw) : [];

      const indexByName = new Map<string, number>();
      pantryNow.forEach((p, idx) => indexByName.set(normalize(p.name), idx));

      const nextPantry = [...pantryNow];

      for (const ri of recipe.ingredients) {
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

  const finishCooking = (recipe: Recipe) => {
    const ingredients = getRecipeIngredients(recipe);
    const missing = ingredients.filter((x) => !x.hasIt);
    if (missing.length > 0) {
      Alert.alert("Missing ingredients", `You're missing: ${missing.map((m) => toTitle(m.name)).join(", ")}`);
      return;
    }

    Alert.alert("Finish cooking?", "This will deduct the required ingredients from your inventory.", [
      { text: "Cancel", style: "cancel" },
      { text: "Finish", style: "default", onPress: () => void finishCookingConfirmed(recipe) },
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
     Add all missing ingredients for a recipe to Shopping List
  ========================================================= */
  const addAllMissingToShoppingList = async (recipe: Recipe) => {
    const ingredients = getRecipeIngredients(recipe);
    const missingIngredients = ingredients.filter((x) => !x.hasIt);
    
    if (missingIngredients.length === 0) {
      Alert.alert("No missing ingredients", "All ingredients are in stock!");
      return;
    }

    Alert.alert(
      "Add to Shopping List?",
      `Would you like to add all ${missingIngredients.length} missing ingredient${missingIngredients.length > 1 ? 's' : ''} to your shopping list?`,
      [
        { text: "No", style: "cancel" },
        { 
          text: "Yes", 
          style: "default", 
          onPress: async () => {
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
          }
        },
      ]
    );
  };

  /* =========================================================
     Render Recipe Card
  ========================================================= */
  const renderRecipeCard = ({ item }: { item: Recipe }) => {
    const isExpanded = expandedRecipeId === item.id;
    const ingredients = getRecipeIngredients(item);
    const pantryIngredients = ingredients.filter((i) => i.hasIt);
    const neededIngredients = ingredients.filter((i) => !i.hasIt);
    const missingMessage = getMissingMessage(item);

    return (
      <View style={styles.recipeCardContainer}>
        {/* Recipe Header - Always visible */}
        <TouchableOpacity
          style={[styles.recipeHeader, isExpanded && styles.recipeHeaderExpanded]}
          activeOpacity={0.85}
          onPress={() => toggleExpand(item.id)}
        >
          <View style={styles.dishImageWrap}>
            <Text style={styles.dishEmoji}>{dishEmoji(item.imageKey)}</Text>
          </View>
          <View style={styles.recipeHeaderText}>
            <Text style={styles.recipeTitle}>{toTitle(item.title)}</Text>
            <Text style={styles.recipeSubtitle}>Ingredients</Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={24}
            color="#f29f9b"
            style={isExpanded && { transform: [{ rotate: "90deg" }] }}
          />
        </TouchableOpacity>

        {/* Expanded Content */}
        {isExpanded && (
          <View style={styles.expandedContent}>
            {/* Pantry Section */}
            {pantryIngredients.length > 0 && (
              <>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Pantry</Text>
                  <View style={styles.sectionDivider} />
                </View>
                {pantryIngredients.map((ing) => {
                  const asset = getIngredientAsset(ing.name);
                  return (
                    <View key={ing.key} style={styles.ingredientRow}>
                      <View style={styles.ingredientImageWrap}>
                        <Image
                          source={asset.source}
                          style={[styles.ingredientImage, asset.style]}
                          contentFit="contain"
                        />
                      </View>
                      <Text style={styles.ingredientName}>{toTitle(ing.name)}</Text>
                      <Text style={styles.ingredientQty}>x{ing.needQty}</Text>
                      <Ionicons name="chevron-forward" size={18} color="#d4b5b8" />
                    </View>
                  );
                })}
              </>
            )}

            {/* Needed Section */}
            {neededIngredients.length > 0 && (
              <>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitleNeeded}>Needed</Text>
                  <View style={styles.sectionDividerNeeded} />
                </View>
                {neededIngredients.map((ing) => {
                  const asset = getIngredientAsset(ing.name);
                  const showDropdown = shoppingDropdownKey === ing.key;

                  return (
                    <View key={ing.key}>
                      <TouchableOpacity
                        style={styles.ingredientRowNeeded}
                        activeOpacity={0.7}
                        onPress={() => handleIngredientPress(ing)}
                      >
                        <View style={styles.ingredientImageWrapNeeded}>
                          <Image
                            source={asset.source}
                            style={[styles.ingredientImage, asset.style, styles.ingredientImageMuted]}
                            contentFit="contain"
                          />
                        </View>
                        <Text style={styles.ingredientNameNeeded}>{toTitle(ing.name)}</Text>
                        <Text style={styles.ingredientQtyNeeded}>x{ing.needQty}</Text>
                        <Ionicons name="chevron-forward" size={18} color="#d4b5b8" />
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
                            <Text style={styles.shoppingDropdownText}>+</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  );
                })}
              </>
            )}

            {/* Missing message */}
            {missingMessage && (
              <Text style={styles.missingMessage}>{missingMessage}</Text>
            )}

            {/* Action Buttons */}
            <View style={styles.actionButtonsRow}>
              <TouchableOpacity
                style={styles.actionButton}
                activeOpacity={0.85}
                onPress={() => finishCooking(item)}
              >
                <Ionicons name="flame" size={20} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                activeOpacity={0.85}
                onPress={() => openEditModal(item)}
              >
                <Ionicons name="pencil" size={20} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButtonDelete}
                activeOpacity={0.85}
                onPress={() => deleteRecipe(item)}
              >
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButtonCart}
                activeOpacity={0.85}
                onPress={() => addAllMissingToShoppingList(item)}
              >
                <Ionicons name="cart" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  };

  /* =========================================================
     Render
  ========================================================= */
  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        {/* ===================== HEADER ===================== */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color="#f29f9b" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Recipes</Text>

          <TouchableOpacity onPress={openCreateModal} style={styles.addButton} activeOpacity={0.8}>
            <Ionicons name="add" size={24} color="#f29f9b" />
          </TouchableOpacity>
        </View>

        {/* ===================== SEARCH BAR ===================== */}
        <View style={styles.searchBar}>
          <Feather name="search" size={20} color="#d4b5b8" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search recipes..."
            placeholderTextColor="#d4b5b8"
            style={styles.searchInput}
          />
        </View>

        {/* ===================== RECIPE LIST ===================== */}
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
            renderItem={renderRecipeCard}
          />
        )}

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

function parseQty(q: unknown) {
  const s = String(q ?? "");
  const m = s.match(/(\d+(\.\d+)?)/);
  return m ? Number(m[1]) : 0;
}
