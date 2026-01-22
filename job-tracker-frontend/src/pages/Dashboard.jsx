import { useEffect, useState } from "react";
import API from "../services/api";
import axios from "axios";

function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

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

    const response = await axios.post(
      "http://127.0.0.1:8000/api/token/refresh/",
      { refresh }
    );

    localStorage.setItem("access_token", response.data.access);
    return response.data.access;
  };

  // 📊 Load dashboard
  const fetchDashboard = async () => {
    try {
      const res = await API.get("dashboard/");
      setData(res.data);
    } catch (err) {
      // If access token expired → refresh
      if (err.response && err.response.status === 401) {
        try {
          await refreshToken();
          const retry = await API.get("dashboard/");
          setData(retry.data);
        } catch (refreshError) {
          logout();
        }
      } else {
        setError("Failed to load dashboard");
      }
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (error) return <p>{error}</p>;
  if (!data) return <p>Loading dashboard...</p>;

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Dashboard</h2>
        <button onClick={logout}>Logout</button>
      </div>

      <p><strong>Total Applications:</strong> {data.total_applications}</p>

      <h4>Status Counts</h4>
      <ul>
        <li>Applied: {data.status_counts.applied}</li>
        <li>Interview: {data.status_counts.interview}</li>
        <li>Offer: {data.status_counts.offer}</li>
        <li>Rejected: {data.status_counts.rejected}</li>
      </ul>

      <h4>Success Rates</h4>
      <p>Interview Success Rate: {data.rates.interview_success_rate}%</p>
      <p>Offer Conversion Rate: {data.rates.offer_conversion_rate}%</p>
    </div>
  );
}

export default Dashboard;
