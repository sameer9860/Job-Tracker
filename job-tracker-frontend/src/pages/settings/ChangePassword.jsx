import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { changePasswordAPI } from "../../api/api";
import "./ChangePassword.css";
export default function ChangePassword() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    old_password: "",
    new_password1: "",
    new_password2: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess(false);

    if (formData.new_password1 !== formData.new_password2) {
      setErrors({ new_password2: "Passwords do not match" });
      return;
    }

    try {
      await changePasswordAPI(
        formData.username,
        formData.old_password,
        formData.new_password1,
        formData.new_password2
      );

      localStorage.removeItem("access");
      localStorage.removeItem("refresh");

      setSuccess(true); // ✅ show success message
      setTimeout(() => {
        navigate("/login"); // ✅ redirect to login
      }, 2000);
    } catch (err) {
      if (err.response?.data) {
        setErrors(err.response.data);
      } else {
        setErrors({ general: "Password change failed" });
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🔑 Change Password</h2>
        <p style={styles.subtitle}>Update your account password</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
            required
            style={styles.input}
          />
          {errors.username && <p style={styles.error}>{errors.username}</p>}

          <input
            type="password"
            name="old_password"
            placeholder="Old Password"
            onChange={handleChange}
            required
            style={styles.input}
          />
          {errors.old_password && <p style={styles.error}>{errors.old_password}</p>}

          <input
            type="password"
            name="new_password1"
            placeholder="New Password"
            onChange={handleChange}
            required
            style={styles.input}
          />
          {errors.new_password1 && <p style={styles.error}>{errors.new_password1}</p>}

          <input
            type="password"
            name="new_password2"
            placeholder="Confirm New Password"
            onChange={handleChange}
            required
            style={styles.input}
          />
          {errors.new_password2 && <p style={styles.error}>{errors.new_password2}</p>}

          <div style={styles.actions}>
            <button type="submit" style={styles.buttonSave}>
              Change Password
            </button>
            <button
              type="button"
              style={styles.buttonCancel}
              onClick={() => navigate("/dashboard")} // ✅ Cancel goes to dashboard
            >
              Cancel
            </button>
          </div>
        </form>

        {success && (
          <p style={styles.success}>
            ✅ Password changed successfully! Redirecting to login...
          </p>
        )}
        {errors.general && <p style={styles.error}>{errors.general}</p>}

        {/* ✅ Back to Dashboard button */}
        <button
          type="button"
          style={styles.backBtn}
          onClick={() => navigate("/dashboard")}
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}

/* 🎨 Styles */
const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
  },
  card: {
    background: "rgba(255, 255, 255, 0.15)",
    backdropFilter: "blur(12px)",
    padding: "40px",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
    color: "#fff",
    textAlign: "center",
  },
  title: {
    marginBottom: "5px",
    fontSize: "24px",
    fontWeight: "bold",
  },
  subtitle: {
    marginBottom: "20px",
    fontSize: "14px",
    color: "#e5e5e5",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px",
    outline: "none",
  },
  actions: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },
  buttonSave: {
    flex: 1,
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    background: "#4f46e5",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  buttonCancel: {
    flex: 1,
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    background: "#e53e3e",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  backBtn: {
    marginTop: "20px",
    padding: "10px 16px",
    background: "none",
    border: "2px solid #fff",
    borderRadius: "8px",
    color: "#fff",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
  },
  error: {
    fontSize: "13px",
    color: "#ffb3b3",
    marginTop: "-10px",
    marginBottom: "10px",
  },
  success: {
    marginTop: "15px",
    fontSize: "14px",
    fontWeight: "bold",
    color: "lightgreen",
  },
};
