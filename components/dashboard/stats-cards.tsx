"use client";

import type { SerializedIndustryInsight } from "./industry-insights";
import { differenceInDays } from "date-fns";
import { TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface StatsCardsProps {
  insights: SerializedIndustryInsight;
}

function getDemandProgress(level: string): number {
  switch (level) {
    case "HIGH":
      return 90;
    case "MEDIUM":
      return 60;
    case "LOW":
      return 30;
    default:
      return 50;
  }
}

export function StatsCards({ insights }: StatsCardsProps) {
  const daysUntilUpdate = differenceInDays(
    new Date(insights.nextUpdate),
    new Date()
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-white/60 text-sm">Market Outlook</p>
          <TrendingUp className="h-5 w-5 text-green-500" />
        </div>
        <p className="text-2xl font-bold text-white mb-2">
          {insights.marketOutlook}
        </p>
        <p className="text-white/40 text-xs">
          Next update in {Math.max(0, daysUntilUpdate)} days
        </p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <p className="text-white/60 text-sm mb-4">Industry Growth</p>
        <p className="text-2xl font-bold text-white mb-4">
          {insights.growthRate}%
        </p>
        <Progress
          value={Math.min(insights.growthRate * 10, 100)}
          className="bg-white/10 [&>div]:bg-white"
        />
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <p className="text-white/60 text-sm mb-4">Demand Level</p>
        <p className="text-2xl font-bold text-white mb-4">
          {insights.demandLevels}
        </p>
        <Progress
          value={getDemandProgress(insights.demandLevels)}
          className="bg-white/10 [&>div]:bg-white"
        />
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <p className="text-white/60 text-sm mb-4">Top Skills</p>
        <div className="flex flex-wrap gap-2">
          {insights.topSkills.map((skill) => (
            <Badge
              key={skill}
              className="bg-white/10 text-white/80 hover:bg-white/20 border-0"
            >
              {skill}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
