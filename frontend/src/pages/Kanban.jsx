import { useEffect, useState } from "react";
import API from "../services/api";

const COLUMNS = [
  { key: "applied", label: "Applied", color: "#e0e7ff" },
  { key: "interview", label: "Interview", color: "#fef3c7" },
  { key: "offer", label: "Offer", color: "#dcfce7" },
  { key: "rejected", label: "Rejected", color: "#fee2e2" },
];

function Kanban() {
  const [jobs, setJobs] = useState([]);
  const [draggedJob, setDraggedJob] = useState(null);

  // 🔹 Fetch jobs
  useEffect(() => {
    API.get("jobs/")
      .then((res) => setJobs(res.data))
      .catch(() => {
        alert("Session expired");
        window.location.href = "/";
      });
  }, []);

  // 🔹 Handle drop
  const handleDrop = async (status) => {
    if (!draggedJob || draggedJob.status === status) return;

    try {
      await API.patch(`jobs/${draggedJob.id}/`, {
        status: status,
      });

      setJobs((prev) =>
        prev.map((job) =>
          job.id === draggedJob.id
            ? { ...job, status }
            : job
        )
      );
    } catch (err) {
      alert("Failed to update status");
    }
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>Job Applications Kanban</h2>

      <div style={styles.board}>
        {COLUMNS.map((col) => (
          <div
            key={col.key}
            style={{ ...styles.column, background: col.color }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(col.key)}
          >
            <h3>{col.label}</h3>

            {jobs
              .filter((job) => job.status === col.key)
              .map((job) => (
                <div
                  key={job.id}
                  style={styles.card}
                  draggable
                  onDragStart={() => setDraggedJob(job)}
                >
                  <strong>{job.company}</strong>
                  <p>{job.role}</p>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Kanban;

/* 🎨 Styles */
const styles = {
  page: {
    padding: "30px",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
  },
  board: {
    display: "flex",
    gap: "20px",
  },
  column: {
    flex: 1,
    padding: "15px",
    borderRadius: "12px",
    minHeight: "400px",
  },
  card: {
    background: "#fff",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "10px",
    cursor: "grab",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
};
