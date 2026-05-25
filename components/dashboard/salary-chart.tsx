"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface SalaryRange {
  role: string;
  min: number;
  median: number;
  max: number;
}

interface SalaryChartProps {
  data: SalaryRange[];
}

export function SalaryChart({ data }: SalaryChartProps) {
  const chartData = data.map((item) => ({
    role: item.role,
    Min: item.min,
    Median: item.median,
    Max: item.max,
  }));

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={chartData}>
          <CartesianGrid stroke="#ffffff15" />
          <XAxis
            dataKey="role"
            tick={{ fill: "#ffffff60", fontSize: 12 }}
            angle={-15}
            textAnchor="end"
            height={80}
          />
          <YAxis tick={{ fill: "#ffffff60" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#111",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
              color: "#fff",
            }}
          />
          <Legend />
          <Bar dataKey="Min" fill="#666" />
          <Bar dataKey="Median" fill="#4682b4" />
          <Bar dataKey="Max" fill="#87ceeb" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
