import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS_LIGHT = ["#2563eb", "#f59e0b", "#10b981", "#ef4444"];
const COLORS_DARK = ["#60a5fa", "#fbbf24", "#34d399", "#f87171"];

export default function StatusChart({ stats, theme }) {
  const data = [
    { name: "Applied", value: stats.applied },
    { name: "Interview", value: stats.interview },
    { name: "Offer", value: stats.offer },
    { name: "Rejected", value: stats.rejected },
  ];

  const colors = theme === "light" ? COLORS_LIGHT : COLORS_DARK;

  return (
    <div style={{ background: theme === "light" ? "#fff" : "#2d2d3d", padding: "20px", borderRadius: "16px", marginBottom: "20px" }}>
      <h3 style={{ color: theme === "light" ? "#1f2937" : "#f3f4f6" }}>Application Status</h3>
      <PieChart width={850} height={300}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ backgroundColor: theme === "light" ? "#fff" : "#1f1f2e", border: "none", color: theme === "light" ? "#1f2937" : "#f3f4f6" }}
        />
        <Legend wrapperStyle={{ color: theme === "light" ? "#1f2937" : "#f3f4f6" }} />
      </PieChart>
    </div>
  );
}
