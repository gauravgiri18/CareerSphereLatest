import { AlertCircle } from "lucide-react";
import { isGeminiConfigured } from "@/lib/gemini";

export function AiConfigBanner() {
  if (isGeminiConfigured()) return null;

  return (
    <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
      <AlertCircle className="h-5 w-5 shrink-0 text-amber-400 mt-0.5" />
      <div>
        <p className="text-amber-200 font-medium">AI features need a Gemini API key</p>
        <p className="text-amber-200/70 text-sm mt-1">
          Add{" "}
          <code className="text-amber-100 bg-black/30 px-1 rounded">
            GEMINI_API_KEY=your_key
          </code>{" "}
          to <code className="text-amber-100">.env.local</code> (not only{" "}
          <code className="text-amber-100">.env</code>), then restart{" "}
          <code className="text-amber-100">npm run dev</code>. Get a free key at{" "}
          <a
            href="https://aistudio.google.com/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-amber-100"
          >
            Google AI Studio
          </a>
          . Saving resumes and viewing history still works without it.
        </p>
      </div>
    </div>
  );
}
