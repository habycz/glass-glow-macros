import { GoogleGenerativeAI } from "@google/generative-ai";

interface NutritionData {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

const SYSTEM_PROMPT = "Analyze this nutrition label image. Return a raw JSON object (no markdown, no code block) with these exact keys: calories, protein, carbs, fat. All values should be numbers. If the label shows 'per 100g', use those values. Example response: {\"calories\": 200, \"protein\": 10, \"carbs\": 30, \"fat\": 8}";

export async function analyzeNutritionLabel(base64Image: string, apiKey: string): Promise<NutritionData> {
  if (!apiKey) {
    throw new Error("API key is required");
  }

  const client = new GoogleGenerativeAI(apiKey);
  const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });

  const base64Data = base64Image.includes("base64,")
    ? base64Image.split("base64,")[1]
    : base64Image;

  try {
    const response = await model.generateContent([
      SYSTEM_PROMPT,
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Data,
        },
      },
    ]);

    const textResponse = response.response.text();

    const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not extract JSON from response");
    }

    const nutritionData: NutritionData = JSON.parse(jsonMatch[0]);

    if (
      typeof nutritionData.calories !== "number" ||
      typeof nutritionData.protein !== "number" ||
      typeof nutritionData.carbs !== "number" ||
      typeof nutritionData.fat !== "number"
    ) {
      throw new Error("Invalid nutrition data format");
    }

    return {
      calories: Math.round(nutritionData.calories),
      protein: Math.round(nutritionData.protein),
      carbs: Math.round(nutritionData.carbs),
      fat: Math.round(nutritionData.fat),
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to analyze nutrition label");
  }
}

export function saveApiKey(apiKey: string): void {
  localStorage.setItem("gemini_api_key", apiKey);
}

export function getApiKey(): string | null {
  return localStorage.getItem("gemini_api_key");
}

export function clearApiKey(): void {
  localStorage.removeItem("gemini_api_key");
}
