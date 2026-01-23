import React from "react";
import { FunnelChart, Funnel, Tooltip, LabelList } from "recharts";

export default function FunnelStats({ stats, theme }) {
  const data = [
    { name: "Applied", value: stats.applied },
    { name: "Interview", value: stats.interview },
    { name: "Offer", value: stats.offer },
    { name: "Rejected", value: stats.rejected },
  ];

  return (
    <div style={{ background: theme === "light" ? "#fff" : "#2d2d3d", padding: "20px", borderRadius: "16px" }}>
      <h3 style={{ color: theme === "light" ? "#1f2937" : "#f3f4f6" }}>Application Funnel</h3>
      <FunnelChart width={850} height={300}>
        <Tooltip
          contentStyle={{ backgroundColor: theme === "light" ? "#fff" : "#1f1f2e", border: "none", color: theme === "light" ? "#1f2937" : "#f3f4f6" }}
        />
        <Funnel dataKey="value" data={data} isAnimationActive>
          <LabelList position="right" fill={theme === "light" ? "#1f2937" : "#f3f4f6"} />
        </Funnel>
      </FunnelChart>
    </div>
  );
}
