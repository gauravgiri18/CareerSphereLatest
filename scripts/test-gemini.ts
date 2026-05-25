import { config } from "dotenv";
import { resolve } from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";

config({ path: resolve(process.cwd(), ".env.local") });

const MODELS = [
  "gemini-2.5-flash-preview-05-20",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  "gemini-1.5-flash-latest",
  "gemini-1.5-flash",
];

async function main() {
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key) throw new Error("No GEMINI_API_KEY");

  const genAI = new GoogleGenerativeAI(key);

  for (const modelName of MODELS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent('Reply with exactly: ok');
      const text = result.response.text().trim();
      console.log(`OK  ${modelName} -> ${text.slice(0, 40)}`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.log(`FAIL ${modelName} -> ${msg.split("\n")[0].slice(0, 120)}`);
    }
  }
}

main();
