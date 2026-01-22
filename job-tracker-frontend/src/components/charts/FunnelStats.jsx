import React from "react";
import { FunnelChart, Funnel, LabelList, Tooltip, ResponsiveContainer } from "recharts";

function FunnelStats({ stats }) {
  if (!stats) return null;

  // Prepare data for the funnel chart
  const data = [
    { name: "Applied", value: stats.applied, color: "#2563eb" },
    { name: "Interview", value: stats.interview, color: "#f59e0b" },
    { name: "Offer", value: stats.offer, color: "#10b981" },
    { name: "Rejected", value: stats.rejected, color: "#ef4444" },
  ];

  return (
    <div style={styles.chartContainer}>
      <h3 style={styles.title}>Funnel Overview</h3>
      <ResponsiveContainer width="100%" height={300}>
        <FunnelChart>
          <Tooltip />
          <Funnel
            dataKey="value"
            data={data}
            isAnimationActive
            stroke="#fff"
          >
            <LabelList position="right" fill="#1f2937" fontSize={14} />
          </Funnel>
        </FunnelChart>
      </ResponsiveContainer>
    </div>
  );
}

const styles = {
  chartContainer: {
    background: "#ffffff",
    padding: "20px",
    borderRadius: "14px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
    marginBottom: "20px",
  },
  title: {
    marginBottom: "12px",
    fontSize: "18px",
    fontWeight: "600",
    color: "#1f2937",
  },
};

export default FunnelStats;
