interface NutritionData {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

const GEMINI_API_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";

const SYSTEM_PROMPT = "Analyze this nutrition label image. Return a raw JSON object (no markdown) with these exact keys: calories, protein, carbs, fat. All values should be numbers. If the label shows 'per 100g', use those values.";

export async function analyzeNutritionLabel(base64Image: string, apiKey: string): Promise<NutritionData> {
  if (!apiKey) {
    throw new Error("API key is required");
  }

  const base64Data = base64Image.includes('base64,')
    ? base64Image.split('base64,')[1]
    : base64Image;

  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: SYSTEM_PROMPT
          },
          {
            inline_data: {
              mime_type: "image/jpeg",
              data: base64Data
            }
          }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.4,
      maxOutputTokens: 256,
    }
  };

  try {
    const response = await fetch(`${GEMINI_API_ENDPOINT}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `API request failed: ${response.status}`);
    }

    const data = await response.json();

    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error("Invalid response format from Gemini API");
    }

    const textResponse = data.candidates[0].content.parts[0].text;

    const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not extract JSON from response");
    }

    const nutritionData: NutritionData = JSON.parse(jsonMatch[0]);

    if (
      typeof nutritionData.calories !== 'number' ||
      typeof nutritionData.protein !== 'number' ||
      typeof nutritionData.carbs !== 'number' ||
      typeof nutritionData.fat !== 'number'
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
