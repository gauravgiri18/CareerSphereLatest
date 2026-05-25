import { DemandLevel, MarketOutlook } from "@prisma/client";
import { db } from "@/lib/prisma";
import { generateGeminiContent } from "@/lib/gemini";
import { inngest } from "./client";

interface SalaryRange {
  role: string;
  min: number;
  median: number;
  max: number;
}

interface IndustryInsightData {
  industry: string;
  salaryRanges: SalaryRange[];
  growthRate: number;
  demandLevels: DemandLevel;
  topSkills: string[];
  marketOutlook: MarketOutlook;
  keyTrends: string[];
  recommendedSKills: string[];
}

function parseDemandLevel(value: string): DemandLevel {
  const upper = value.toUpperCase();
  if (upper === "HIGH" || upper === "MEDIUM" || upper === "LOW") {
    return upper as DemandLevel;
  }
  return "MEDIUM";
}

function parseMarketOutlook(value: string): MarketOutlook {
  const upper = value.toUpperCase();
  if (upper === "POSITIVE" || upper === "NEUTRAL" || upper === "NEGATIVE") {
    return upper as MarketOutlook;
  }
  return "NEUTRAL";
}

export const generateIndustryInsights = inngest.createFunction(
  { id: "generate-industry-insights", name: "Generate Industry Insights" },
  { cron: "0 0 * * 0" },
  async () => {
    const users = await db.user.findMany({
      where: { industry: { not: null } },
      select: { industry: true },
      distinct: ["industry"],
    });

    const industries = users
      .map((u) => u.industry)
      .filter((i): i is string => i !== null);

    for (const industry of industries) {
      try {
        const prompt = `Generate comprehensive market data for the "${industry}" industry.
Return ONLY valid JSON with this exact structure:
{
  "industry": "${industry}",
  "salaryRanges": [
    {"role": "Role Name", "min": 50000, "median": 75000, "max": 100000}
  ],
  "growthRate": 7.5,
  "demandLevels": "HIGH",
  "topSkills": ["skill1", "skill2"],
  "marketOutlook": "POSITIVE",
  "keyTrends": ["trend1", "trend2"],
  "recommendedSKills": ["skill1", "skill2"]
}

CRITICAL RULES:
- demandLevels must be exactly "HIGH", "MEDIUM", or "LOW" (uppercase)
- marketOutlook must be exactly "POSITIVE", "NEUTRAL", or "NEGATIVE" (uppercase)
- Field name is "recommendedSKills" with capital K
- Include at least 5 salary ranges for different roles
- growthRate is a number (percentage)`;

        const text = await generateGeminiContent(prompt);
        const jsonMatch = text.match(/\{[\s\S]*\}/);

        if (!jsonMatch) continue;

        const parsed = JSON.parse(jsonMatch[0]) as IndustryInsightData;

        const nextUpdate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        await db.industryInsight.upsert({
          where: { industry },
          create: {
            industry,
            salaryRanges: parsed.salaryRanges as object[],
            growthRate: parsed.growthRate,
            demandLevels: parseDemandLevel(String(parsed.demandLevels)),
            topSkills: parsed.topSkills,
            marketOutlook: parseMarketOutlook(String(parsed.marketOutlook)),
            keyTrends: parsed.keyTrends,
            recommendedSKills: parsed.recommendedSKills,
            lastUpdated: new Date(),
            nextUpdate,
          },
          update: {
            salaryRanges: parsed.salaryRanges as object[],
            growthRate: parsed.growthRate,
            demandLevels: parseDemandLevel(String(parsed.demandLevels)),
            topSkills: parsed.topSkills,
            marketOutlook: parseMarketOutlook(String(parsed.marketOutlook)),
            keyTrends: parsed.keyTrends,
            recommendedSKills: parsed.recommendedSKills,
            lastUpdated: new Date(),
            nextUpdate,
          },
        });
      } catch (error) {
        console.error(`Failed to update insights for ${industry}:`, error);
      }
    }

    return { updated: industries.length };
  }
);
