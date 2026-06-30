import { useState } from "react";
import API from "../services/api";

function AddJobModal({ isOpen, onClose, onJobAdded }) {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("applied");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null; // Modal hidden

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await API.post("jobs/", { company, role, status });
      onJobAdded(res.data); // Update Kanban in Dashboard
      onClose();
      setCompany("");
      setRole("");
      setStatus("applied");
    } catch (err) {
      setError("Failed to add job");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3>Add New Job</h3>
        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            placeholder="Company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            style={styles.input}
            required
          />
          <input
            placeholder="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={styles.input}
            required
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={styles.input}
          >
            <option value="applied">Applied</option>
            <option value="interview">Interview</option>
            <option value="offer">Offer</option>
            <option value="rejected">Rejected</option>
          </select>

          <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
            <button type="submit" disabled={loading} style={styles.button}>
              {loading ? "Adding..." : "Add Job"}
            </button>
            <button type="button" onClick={onClose} style={styles.cancelBtn}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddJobModal;

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "400px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  button: {
    flex: 1,
    padding: "10px",
    border: "none",
    borderRadius: "6px",
    background: "#4f46e5",
    color: "#fff",
    cursor: "pointer",
  },
  cancelBtn: {
    flex: 1,
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    background: "#fff",
    cursor: "pointer",
  },
  error: {
    color: "red",
    marginBottom: "10px",
  },
};
