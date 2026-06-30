import { useState } from "react";
import { requestPasswordReset } from "../../api/api";

export default function EnterEmail({ onNext }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await requestPasswordReset(email);
      setMessage(res.data.detail);
      onNext(email);
    } catch (err) {
      setMessage(err.response?.data?.detail || "Something went wrong");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🔑 Forgot Password</h2>
        <p style={styles.subtitle}>Enter your email to receive an OTP</p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />

          <button type="submit" style={styles.button}>
            Send OTP
          </button>
        </form>

        {message && <p style={styles.message}>{message}</p>}
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
    maxWidth: "400px",
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
    marginBottom: "25px",
    fontSize: "14px",
    color: "#e5e5e5",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px",
    outline: "none",
    transition: "border 0.3s",
  },
  button: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    background: "#4f46e5",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "10px",
    transition: "background 0.3s",
  },
  message: {
    marginTop: "15px",
    fontSize: "14px",
    color: "#fff",
    fontWeight: "bold",
  },
};
