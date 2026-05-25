"use client";

import type { DemandLevel, MarketOutlook } from "@prisma/client";

export type SerializedIndustryInsight = {
  id: string;
  industry: string;
  salaryRanges: unknown[];
  growthRate: number;
  demandLevels: DemandLevel;
  topSkills: string[];
  marketOutlook: MarketOutlook;
  keyTrends: string[];
  recommendedSKills: string[];
  lastUpdated: string | Date;
  nextUpdate: string | Date;
};
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { StatsCards } from "./stats-cards";
import { SalaryChart } from "./salary-chart";

interface IndustryInsightsProps {
  insights: SerializedIndustryInsight;
}

interface SalaryRange {
  role: string;
  min: number;
  median: number;
  max: number;
}

export function IndustryInsights({ insights }: IndustryInsightsProps) {
  const salaryRanges = insights.salaryRanges as unknown as SalaryRange[];

  return (
    <div>
      <h1 className="text-4xl font-bold text-white mb-2">Industry Insights</h1>
      <p className="text-white/60 mb-8">
        Last updated: {format(new Date(insights.lastUpdated), "dd/MM/yyyy")}
      </p>

      <StatsCards insights={insights} />

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">
          Salary Ranges by Role
        </h2>
        <p className="text-white/60 mb-4">
          Compare salary ranges across different roles in your industry
        </p>
        <SalaryChart data={salaryRanges} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">
            Key Industry Trends
          </h3>
          <ul className="space-y-2">
            {insights.keyTrends.map((trend) => (
              <li key={trend} className="text-white/80 flex items-start gap-2">
                <span className="text-white/40">•</span>
                {trend}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">
            Recommended Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {insights.recommendedSKills.map((skill) => (
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
    </div>
  );
}
