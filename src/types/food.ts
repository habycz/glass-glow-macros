export interface FoodEntry {
  id: string;
  name: string;
  grams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Macros {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

// Mock nutrition data per 100g (simulating a scanned label)
export const MOCK_NUTRITION_PER_100G: Macros = {
  calories: 200,
  protein: 13,
  carbs: 23,
  fat: 5,
};

export const MOCK_FOOD_NAME = "Grilled Chicken & Rice";

export function calculateMacros(grams: number): Macros {
  const ratio = grams / 100;
  return {
    calories: Math.round(MOCK_NUTRITION_PER_100G.calories * ratio),
    protein: Math.round(MOCK_NUTRITION_PER_100G.protein * ratio),
    carbs: Math.round(MOCK_NUTRITION_PER_100G.carbs * ratio),
    fat: Math.round(MOCK_NUTRITION_PER_100G.fat * ratio),
  };
}
