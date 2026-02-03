export const defaultIngredientImage = require("../assets/images/default.png");

type IngredientStyle = {
  width: number;
  height: number;
  borderRadius?: number;
};

type IngredientAsset = {
  source: any;
  style: IngredientStyle;
};

const defaultStyle: IngredientStyle = {
  width: 40,
  height: 40,
  borderRadius: 8,
};

const ingredientAssets: Record<string, IngredientAsset> = {
  milk: {
    source: require("../assets/images/Milk.png"),
    style: { width: 40, height: 45 },
  },
  carrot: {
    source: require("../assets/images/Carrot.png"),
    style: { width: 28, height: 64, borderRadius: 14 },
  },
  "soy sauce": {
    source: require("../assets/images/Soy_sauce.png"),
    style: { width: 36, height: 64, borderRadius: 24 },
  },
  egg: {
    source: require("../assets/images/Egg.png"),
    style: { width: 50, height: 60, borderRadius: 30 },
  },
    "bok choy": {
    source: require("../assets/images/Bok_choy.png"),
    style: { width: 50, height: 60, borderRadius: 30 },
  },
};

export function normalizeIngredientName(name: string) {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

// HomeScreen uses this (source + style)
export function getIngredientAsset(name: string): IngredientAsset {
  const key = normalizeIngredientName(name);
  return ingredientAssets[key] ?? { source: defaultIngredientImage, style: defaultStyle };
}

// StockScreen uses this (source only)
export function getIngredientImage(name: string) {
  return getIngredientAsset(name).source;
}

// at bottom of src/ingredientImages.ts
export const INGREDIENT_KEYS = Object.keys(ingredientAssets);

