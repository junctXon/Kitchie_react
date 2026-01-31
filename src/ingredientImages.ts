export const defaultIngredientImage = require("../assets/images/default.png");

const ingredientImages: Record<string, any> = {
  milk: require("../assets/images/Milk.png"),
  carrot: require("../assets/images/Carrot.png"),
  "soy sauce": require("../assets/images/Soy_sauce.png"),
  egg: require("../assets/images/Egg.png"),
};

export function normalizeIngredientName(name: string) {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

export function getIngredientImage(name: string) {
  const key = normalizeIngredientName(name);
  return ingredientImages[key] || defaultIngredientImage;
}