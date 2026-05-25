"use client";

import { Assessment } from "@prisma/client";
import { format } from "date-fns";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface PerformanceChartProps {
  assessments: Assessment[];
}

export function PerformanceChart({ assessments }: PerformanceChartProps) {
  const data = assessments.map((a, index) => ({
    date: format(new Date(a.createdAt), "MMM d"),
    score: a.quizScore,
    name: `Quiz ${index + 1}`,
  }));

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      <h2 className="text-xl font-bold text-white mb-6">Performance Over Time</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid stroke="#ffffff15" />
          <XAxis dataKey="date" tick={{ fill: "#ffffff60" }} />
          <YAxis domain={[0, 100]} tick={{ fill: "#ffffff60" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#111",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
              color: "#fff",
            }}
            formatter={(value: number) => [`Score: ${value}%`, ""]}
            labelFormatter={(label) => label}
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#fff"
            strokeWidth={2}
            dot={{ fill: "#fff", r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
