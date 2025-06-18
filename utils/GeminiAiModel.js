const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

// Update Gemini API key to use NEXT_PUBLIC_ prefix for client-side access
const apiKey =
  process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(apiKey);

// Get the generative model instance, specifying "gemini-1.5-flash"
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

// Configure generation parameters for the model
const generationConfig = {
  temperature: 0.7, // Controls randomness: lower for more deterministic, higher for more creative
  topP: 0.95, // Nucleus sampling: filters tokens by cumulative probability
  topK: 64, // Top-k sampling: filters tokens by top k highest probabilities
  maxOutputTokens: 2048, // Maximum number of tokens to generate in the response
  responseMimeType: "application/json", // Requesting JSON output for structured data
};

// Define safety settings to block harmful content
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

export const chatSession = model.startChat({
  generationConfig,
  safetySettings,
});
