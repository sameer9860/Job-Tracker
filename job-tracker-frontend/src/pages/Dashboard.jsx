import { useEffect, useState } from "react";
import API from "../services/api";
import axios from "axios";
import KanbanBoard from "../components/KanbanBoard";



function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

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
      setData(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        try {
          await refreshToken();
          const retry = await API.get("dashboard/");
          setData(retry.data);
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
    <div>
      {/* 🔝 HEADER */}
      <header style={styles.header}>
        <h2>Job Tracker Dashboard</h2>
        <button onClick={logout} style={styles.logoutBtn}>
          Logout
        </button>
      </header>

      {/* 📊 STATS */}
      <div style={styles.statsGrid}>
        <StatCard title="Total Applications" value={data.total_applications} />
        <StatCard title="Applied" value={data.status_counts.applied} />
        <StatCard title="Interview" value={data.status_counts.interview} />
        <StatCard title="Offers" value={data.status_counts.offer} />
        <StatCard title="Rejected" value={data.status_counts.rejected} />
      </div>

      {/* 📈 RATES */}
      <div style={styles.rateBox}>
        <p>
          <strong>Interview Success Rate:</strong>{" "}
          {data.rates.interview_success_rate}%
        </p>
        <p>
          <strong>Offer Conversion Rate:</strong>{" "}
          {data.rates.offer_conversion_rate}%
        </p>
      </div>

      {/* 🧩 KANBAN */}
      <KanbanBoard />
    </div>
  );
}

/* 🔹 Reusable Stat Card */
function StatCard({ title, value }) {
  return (
    <div style={styles.card}>
      <h4>{title}</h4>
      <p style={styles.cardValue}>{value}</p>
    </div>
  );
}

/* 🎨 Styles */
const styles = {
  header: {
    background: "#4f46e5",
    color: "#fff",
    padding: "15px 30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoutBtn: {
    background: "#fff",
    color: "#4f46e5",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: "20px",
    padding: "30px",
  },
  card: {
    background: "#fff",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  cardValue: {
    fontSize: "28px",
    fontWeight: "bold",
    marginTop: "10px",
    color: "#4f46e5",
  },
  rateBox: {
    margin: "0 30px 20px",
    padding: "20px",
    background: "#f9fafb",
    borderRadius: "10px",
  },
  center: {
    textAlign: "center",
    marginTop: "50px",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginTop: "50px",
  },
};

export default Dashboard;
