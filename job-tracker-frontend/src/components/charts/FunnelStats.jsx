import {
  FunnelChart,
  Funnel,
  LabelList,
  ResponsiveContainer,
} from "recharts";

export default function FunnelStats({ stats }) {
  const data = [
    { name: "Applied", value: stats.applied },
    { name: "Interview", value: stats.interview },
    { name: "Offer", value: stats.offer },
  ];

  return (
    <div style={styles.card}>
      <h4>Hiring Funnel</h4>
      <ResponsiveContainer width="100%" height={300}>
        <FunnelChart>
          <Funnel dataKey="value" data={data}>
            <LabelList position="right" fill="#374151" />
          </Funnel>
        </FunnelChart>
      </ResponsiveContainer>
    </div>
  );
}
