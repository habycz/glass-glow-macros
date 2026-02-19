# GlassMacro Setup Guide

## Getting Started with Google Gemini API

GlassMacro now uses Google's Gemini AI to automatically scan and analyze nutrition labels from photos.

### 1. Get Your API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### 2. Configure the App

1. Open GlassMacro in your browser
2. Click the **Settings** gear icon (⚙️) in the top right corner
3. Paste your API key in the input field
4. Click "Save Key"

Your API key is stored locally in your browser and never sent anywhere except directly to Google's Gemini API.

### 3. Start Scanning

1. Click the **pink camera button** at the bottom of the screen
2. Take a photo of a nutrition label or select one from your device
3. Wait while Gemini analyzes the label (usually 2-5 seconds)
4. Enter how many grams you consumed
5. Review the calculated macros
6. Click "Log Food" to add it to your daily total

### Features

- **Real Nutrition Scanning**: Uses Gemini 1.5 Flash to read nutrition labels
- **Automatic Calculation**: Calculates macros based on serving size
- **Demo Mode**: Use demo data if you don't want to scan
- **Persistent Storage**: Your API key is saved locally
- **Animated Progress**: Beautiful animations show your daily progress
- **Food Log**: Track all meals throughout the day

### API Usage Notes

- The Gemini 1.5 Flash model is free for up to 15 requests per minute
- Each scan uses approximately 1 request
- For more information, visit [Google AI Pricing](https://ai.google.dev/pricing)

### Troubleshooting

**"API key not found"**
- Make sure you've added your API key in Settings

**"Failed to analyze image"**
- Ensure the nutrition label is clearly visible
- Try taking a photo with better lighting
- Use the demo data option as a fallback

**Incorrect macro values**
- The AI reads "per 100g" values from labels
- Make sure the label shows nutrition per 100g
- You can manually adjust by using demo mode and entering custom values
