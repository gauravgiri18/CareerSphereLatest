import { GoogleGenerativeAI } from "@google/generative-ai";

/** Models to try in order (first available wins) */
const MODELS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash-lite",
  "gemini-2.0-flash",
] as const;

export function isGeminiConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY?.trim());
}

function formatGeminiError(err: unknown): string {
  const message = err instanceof Error ? err.message : String(err);

  if (message.includes("429") || message.includes("quota")) {
    return (
      "Gemini API quota exceeded. Wait a minute and try again, or enable billing / " +
      "a new API key at https://aistudio.google.com/apikey"
    );
  }
  if (message.includes("404") || message.includes("not found")) {
    return "Gemini model unavailable. Please try again in a moment.";
  }
  if (message.includes("API_KEY_INVALID") || message.includes("403")) {
    return "Invalid GEMINI_API_KEY. Create a new key at https://aistudio.google.com/apikey";
  }

  return message || "Gemini request failed";
}

export async function generateGeminiContent(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is missing. Add it to .env.local (not only .env) and restart npm run dev."
    );
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const errors: string[] = [];

  for (const modelName of MODELS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      if (text?.trim()) return text;
    } catch (err) {
      errors.push(`${modelName}: ${formatGeminiError(err)}`);
    }
  }

  throw new Error(errors[0] ?? "Gemini returned an empty response");
}

/** @deprecated Use generateGeminiContent instead */
export function getGeminiModel() {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing in .env.local");
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: MODELS[0] });
}
