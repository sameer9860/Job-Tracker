import { useEffect, useState } from "react";
import API, { getUser } from "../services/api";
import axios from "axios";

import AddJobModal from "../components/AddJobModal";
import StatusChart from "../components/charts/StatusChart";
import FunnelStats from "../components/charts/FunnelStats";

function Dashboard() {
  const [data, setData] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [theme, setTheme] = useState("light"); // default theme

  /* 🔐 Logout */
  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.href = "/";
  };

  /* 🌗 Toggle Theme */
  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  /* 🔁 Refresh token */
  const refreshToken = async () => {
    const refresh = localStorage.getItem("refresh_token");
    const res = await axios.post("http://127.0.0.1:8000/api/token/refresh/", { refresh });
    localStorage.setItem("access_token", res.data.access);
    return res.data.access;
  };

  /* 📊 Load dashboard and user info */
  const fetchDashboard = async () => {
    try {
      const res = await API.get("dashboard/");
      setData({ ...res.data, jobs: res.data.jobs || [] });

      // fetch logged-in user
      const userData = await getUser();
      setUser(userData);

    } catch (err) {
      if (err.response?.status === 401) {
        try {
          await refreshToken();
          const retry = await API.get("dashboard/");
          setData({ ...retry.data, jobs: retry.data.jobs || [] });

          const userRetry = await getUser();
          setUser(userRetry);

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

  /* ✅ Handle adding new job */
  const handleJobAdded = (newJob) => {
    setData((prev) => ({
      ...prev,
      jobs: [newJob, ...prev.jobs],
      total_applications: prev.total_applications + 1,
      status_counts: {
        ...prev.status_counts,
        [newJob.status]: prev.status_counts[newJob.status] + 1,
      },
    }));
  };

  if (loading) return <p style={styles.center}>Loading dashboard...</p>;
  if (error) return <p style={styles.error}>{error}</p>;

  const isDark = theme === "dark";

  return (
    <div style={{ ...styles.page, background: isDark ? "#1f1f2e" : "#eef2ff", color: isDark ? "#f3f4f6" : "#1f2937" }}>
      {/* # Job Application Dashboard Header */}
      <header style={{ ...styles.header, background: isDark ? "#2d2d3d" : "#fff" }}>
        <div>
          <h2 style={{ margin: 0 }}>Job Application Dashboard</h2>
          <p style={{ marginTop: "4px", color: isDark ? "#cbd5e1" : "#6b7280" }}>
            Track your progress and job search performance
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Theme Toggler */}
          <button onClick={toggleTheme} style={styles.themeBtn}>
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
          </button>

          {/* Profile Card */}
          {user && (
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 12px",
              borderRadius: "12px",
              background: isDark ? "#3b3b4f" : "#f3f4f6"
            }}>
              <div style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "#4f46e5",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "#fff",
                fontWeight: "bold",
              }}>
                {user.username[0].toUpperCase()}
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontWeight: "bold", color: isDark ? "#f3f4f6" : "#1f2937" }}>
                  {user.username}
                </span>
                <span style={{ fontSize: "12px", color: isDark ? "#cbd5e1" : "#6b7280" }}>
                  {user.email}
                </span>
              </div>
            </div>
          )}

          {/* Add Job Button */}
          <button style={styles.addBtn} onClick={() => setModalOpen(true)}>
            + Add Job
          </button>

          {/* Logout */}
          <button
            style={{
              ...styles.logoutBtn,
              background: isDark ? "#3b3b4f" : "#fff",
              color: isDark ? "#f3f4f6" : "#4f46e5",
            }}
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </header>

      {/* 📊 Stats Cards */}
      <section style={styles.statsGrid}>
        <StatCard label="Total Applications" value={data.total_applications} color="#4f46e5" theme={theme} />
        <StatCard label="Applied" value={data.status_counts.applied} color="#2563eb" theme={theme} />
        <StatCard label="Interview" value={data.status_counts.interview} color="#f59e0b" theme={theme} />
        <StatCard label="Offers" value={data.status_counts.offer} color="#10b981" theme={theme} />
        <StatCard label="Rejected" value={data.status_counts.rejected} color="#ef4444" theme={theme} />
      </section>

      {/* 📈 KPI Cards */}
      <section style={styles.kpiGrid}>
        <KpiCard title="Interview Success Rate" value={`${data.rates.interview_success_rate}%`} desc="Interviews per application" theme={theme} />
        <KpiCard title="Offer Conversion Rate" value={`${data.rates.offer_conversion_rate}%`} desc="Offers per interview" theme={theme} />
      </section>

      {/* 📊 Charts */}
      <section style={styles.chartGrid}>
        <StatusChart stats={data.status_counts} theme={theme} size={400} />
        <FunnelStats stats={data.status_counts} theme={theme} size={400} />
      </section>

      {/* ➕ Add Job Modal */}
      <AddJobModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onJobAdded={handleJobAdded} />
    </div>
  );
}

/* Stat Card */
function StatCard({ label, value, color, theme }) {
  const isDark = theme === "dark";
  return (
    <div style={{ ...styles.statCard, borderLeft: `6px solid ${color}`, background: isDark ? "#2d2d3d" : "#fff", color: isDark ? "#f3f4f6" : "#1f2937" }}>
      <p style={styles.statLabel}>{label}</p>
      <h3 style={{ ...styles.statValue, color }}>{value}</h3>
    </div>
  );
}

/* KPI Card */
function KpiCard({ title, value, desc, theme }) {
  const isDark = theme === "dark";
  return (
    <div style={{ ...styles.kpiCard, background: isDark ? "#2d2d3d" : "#fff", color: isDark ? "#f3f4f6" : "#1f2937" }}>
      <h4>{title}</h4>
      <h2 style={styles.kpiValue}>{value}</h2>
      <p style={styles.kpiDesc}>{desc}</p>
    </div>
  );
}

/* Styles */
const styles = {
  page: { minHeight: "100vh" },
  header: {
    padding: "20px 30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
    borderRadius: "0 0 20px 20px",
  },
  themeBtn: {
    padding: "6px 12px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    background: "#4f46e5",
    color: "#fff",
    fontWeight: "bold",
  },
  addBtn: {
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    padding: "10px 18px",
    borderRadius: "10px",
    fontWeight: "bold",
    marginRight: "10px",
    cursor: "pointer",
  },
  logoutBtn: {
    border: "1px solid #e5e7eb",
    padding: "10px 18px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "20px",
    padding: "30px",
  },
  statCard: { padding: "20px", borderRadius: "16px", boxShadow: "0 10px 25px rgba(0,0,0,0.08)" },
  statLabel: { fontSize: "14px", color: "#6b7280" },
  statValue: { fontSize: "28px", marginTop: "8px", fontWeight: "bold" },
  kpiGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "20px",
    padding: "0 30px 30px",
  },
  kpiCard: { padding: "25px", borderRadius: "18px", boxShadow: "0 10px 30px rgba(0,0,0,0.08)" },
  kpiValue: { fontSize: "32px", margin: "10px 0", color: "#4f46e5" },
  kpiDesc: { fontSize: "14px", color: "#6b7280" },
  chartGrid: {
    display: "flex",
    gap: "30px",
    justifyContent: "center",
    padding: "0 30px 40px",
    flexWrap: "wrap",
  },
  center: { textAlign: "center", marginTop: "60px" },
  error: { color: "red", textAlign: "center", marginTop: "60px" },
};

export default Dashboard;
