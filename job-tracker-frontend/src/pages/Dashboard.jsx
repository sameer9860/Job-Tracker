import { useEffect, useState } from "react";
import API from "../services/api";
import axios from "axios";

import AddJobModal from "../components/AddJobModal";
import StatusChart from "../components/charts/StatusChart";
import FunnelStats from "../components/charts/FunnelStats";

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  // 🌗 Theme
  const [theme, setTheme] = useState("light");
  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));

  // 🔐 Logout
  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.href = "/";
  };

  // 🔁 Refresh token
  const refreshToken = async () => {
    const refresh = localStorage.getItem("refresh_token");
    if (!refresh) throw new Error("No refresh token");

    const res = await axios.post(
      "http://127.0.0.1:8000/api/token/refresh/",
      { refresh }
    );
    localStorage.setItem("access_token", res.data.access);
    return res.data.access;
  };

  // 📊 Load dashboard
  const fetchDashboard = async () => {
    try {
      const res = await API.get("dashboard/");
      setData({ ...res.data, jobs: res.data.jobs || [] });
    } catch (err) {
      if (err.response?.status === 401) {
        try {
          await refreshToken();
          const retry = await API.get("dashboard/");
          setData({ ...retry.data, jobs: retry.data.jobs || [] });
        } catch {
          logout();
        }
      } else {
        setError("Failed to load dashboard");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) return <p style={styles.center}>Loading dashboard...</p>;
  if (error) return <p style={styles.error}>{error}</p>;

  return (
    <div style={theme === "light" ? styles.pageLight : styles.pageDark}>
      {/* 🔝 HEADER */}
      <header style={styles.header}>
        <div>
          <h2 style={styles.title}>Job Application Dashboard</h2>
          <p style={styles.subtitle}>Track your progress and job search performance</p>
        </div>
        <div>
          <button style={styles.addBtn} onClick={() => setModalOpen(true)}>
            + Add Job
          </button>
          <button style={styles.themeBtn} onClick={toggleTheme}>
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
          </button>
          <button style={styles.logoutBtn} onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      {/* 📊 STATS */}
      <section style={styles.statsGrid}>
        <StatCard label="Total Applications" value={data.total_applications} color="#4f46e5" theme={theme} />
        <StatCard label="Applied" value={data.status_counts.applied} color="#2563eb" theme={theme} />
        <StatCard label="Interview" value={data.status_counts.interview} color="#f59e0b" theme={theme} />
        <StatCard label="Offers" value={data.status_counts.offer} color="#10b981" theme={theme} />
        <StatCard label="Rejected" value={data.status_counts.rejected} color="#ef4444" theme={theme} />
      </section>

      {/* 📈 KPIs */}
      <section style={styles.kpiGrid}>
        <KpiCard
          title="Interview Success Rate"
          value={`${data.rates.interview_success_rate}%`}
          desc="Interviews per application"
          theme={theme}
        />
        <KpiCard
          title="Offer Conversion Rate"
          value={`${data.rates.offer_conversion_rate}%`}
          desc="Offers per interview"
          theme={theme}
        />
      </section>

      {/* 📊 CHARTS */}
      <div style={{ padding: "0 30px 30px 30px" }}>
        <StatusChart stats={data.status_counts} theme={theme} />
        <FunnelStats stats={data.status_counts} theme={theme} />
      </div>

      {/* ➕ Add Job Modal */}
      <AddJobModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onJobAdded={() => fetchDashboard()}
      />
    </div>
  );
}

/* 🔹 Stat Card */
function StatCard({ label, value, color, theme }) {
  const cardStyle = theme === "light" ? styles.statCardLight : styles.statCardDark;
  return (
    <div style={{ ...cardStyle, borderLeft: `6px solid ${color}` }}>
      <p style={styles.statLabel}>{label}</p>
      <h3 style={{ ...styles.statValue, color }}>{value}</h3>
    </div>
  );
}

/* 🔹 KPI Card */
function KpiCard({ title, value, desc, theme }) {
  const cardStyle = theme === "light" ? styles.kpiCardLight : styles.kpiCardDark;
  return (
    <div style={cardStyle}>
      <h4>{title}</h4>
      <h2 style={styles.kpiValue}>{value}</h2>
      <p style={styles.kpiDesc}>{desc}</p>
    </div>
  );
}

/* 🎨 Styles */
const styles = {
  pageLight: { minHeight: "100vh", background: "linear-gradient(180deg, #eef2ff, #f9fafb)", color: "#1f2937" },
  pageDark: { minHeight: "100vh", background: "#1f1f2e", color: "#f3f4f6" },

  header: { padding: "30px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#ffffff", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" },
  title: { margin: 0, color: "#1f2937" },
  subtitle: { marginTop: "6px", color: "#6b7280" },

  addBtn: { background: "#4f46e5", color: "#fff", border: "none", padding: "10px 18px", borderRadius: "10px", fontWeight: "bold", marginRight: "10px", cursor: "pointer" },
  themeBtn: { background: "#f3f4f6", border: "1px solid #e5e7eb", padding: "10px 18px", borderRadius: "10px", cursor: "pointer", marginRight: "10px" },
  logoutBtn: { background: "#fff", border: "1px solid #e5e7eb", padding: "10px 18px", borderRadius: "10px", cursor: "pointer" },

  statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "20px", padding: "30px" },
  statCardLight: { background: "#fff", padding: "20px", borderRadius: "16px", boxShadow: "0 10px 25px rgba(0,0,0,0.08)" },
  statCardDark: { background: "#2d2d3d", padding: "20px", borderRadius: "16px", boxShadow: "0 10px 25px rgba(0,0,0,0.2)" },
  statLabel: { color: "#6b7280", fontSize: "14px" },
  statValue: { fontSize: "30px", marginTop: "10px" },

  kpiGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px", padding: "0 30px 40px" },
  kpiCardLight: { background: "#ffffff", padding: "25px", borderRadius: "18px", boxShadow: "0 10px 30px rgba(0,0,0,0.08)" },
  kpiCardDark: { background: "#2d2d3d", padding: "25px", borderRadius: "18px", boxShadow: "0 10px 30px rgba(0,0,0,0.2)" },
  kpiValue: { fontSize: "36px", color: "#4f46e5", margin: "10px 0" },
  kpiDesc: { color: "#6b7280" },

  center: { textAlign: "center", marginTop: "60px" },
  error: { color: "red", textAlign: "center", marginTop: "60px" },
};

export default Dashboard;
