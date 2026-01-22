import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function StatusChart({ stats }) {
  const data = [
    { name: "Applied", value: stats.applied },
    { name: "Interview", value: stats.interview },
    { name: "Offer", value: stats.offer },
    { name: "Rejected", value: stats.rejected },
  ];

  return (
    <div style={styles.card}>
      <h4>Applications by Status</h4>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="value" fill="#4f46e5" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

const styles = {
  card: {
    background: "var(--card-bg)",
    padding: "20px",
    borderRadius: "16px",
  },
};
