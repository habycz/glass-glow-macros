

export interface NutritionData {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

// 1. Paste your GROQ API Key here (or keep using the localStorage input in your UI)
// If you want to hardcode it to test, put it inside the quotes below.
const DEFAULT_API_KEY = "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"; 

export async function analyzeNutritionLabel(base64Image: string, userApiKey?: string): Promise<NutritionData> {
  const apiKey = userApiKey || DEFAULT_API_KEY;
  
  if (!apiKey) {
    throw new Error("API Key is missing. Please enter your Groq API Key in settings.");
  }

  // We strip the header if it exists to get just the raw base64
  const cleanBase64 = base64Image.replace(/^data:image\/(png|jpg|jpeg|webp);base64,/, "");

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama-3.2-90b-vision-preview", // High-intelligence vision model
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this nutrition label. Return a raw JSON object with these exact keys: calories, protein, carbs, fat. Values must be numbers. If the label shows 'per 100g', use those values. Do not include markdown formatting like ```json."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${cleanBase64}`
              }
            }
          ]
        }
      ],
      temperature: 0.1,
      response_format: { type: "json_object" } // Enforces strict JSON return
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq API Error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  
  try {
    const content = data.choices[0].message.content;
    const parsed = JSON.parse(content);
    return {
      calories: Number(parsed.calories || 0),
      protein: Number(parsed.protein || 0),
      carbs: Number(parsed.carbs || 0),
      fat: Number(parsed.fat || 0)
    };
  } catch (e) {
    console.error("Failed to parse Groq response:", data);
    throw new Error("Failed to read nutrition data from the image.");
  }
}
