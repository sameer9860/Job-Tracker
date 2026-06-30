import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // ✅ Import navigation
import { setNewPassword } from "../../api/api";

export default function SetNewPassword({ email, otp }) {
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (password1 !== password2) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const res = await setNewPassword(email, otp, password1, password2);
      setMessage(res.data.detail);
      setSuccess(true);

      // ✅ Redirect to login after short delay
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      setMessage(err.response?.data?.detail || "Something went wrong");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {!success ? (
          <>
            <h2 style={styles.title}>🔒 Set New Password</h2>
            <p style={styles.subtitle}>Enter and confirm your new password</p>

            <form onSubmit={handleSubmit}>
              {/* New Password */}
              <div style={styles.passwordWrapper}>
                <input
                  type={showPassword1 ? "text" : "password"}
                  placeholder="New Password"
                  value={password1}
                  onChange={(e) => setPassword1(e.target.value)}
                  required
                  style={styles.input}
                />
                <span
                  style={styles.eye}
                  onClick={() => setShowPassword1(!showPassword1)}
                >
                  {showPassword1 ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>

              {/* Confirm Password */}
              <div style={styles.passwordWrapper}>
                <input
                  type={showPassword2 ? "text" : "password"}
                  placeholder="Confirm New Password"
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                  required
                  style={styles.input}
                />
                <span
                  style={styles.eye}
                  onClick={() => setShowPassword2(!showPassword2)}
                >
                  {showPassword2 ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>

              <button type="submit" style={styles.button}>
                Set Password
              </button>
            </form>

            {message && <p style={styles.message}>{message}</p>}
          </>
        ) : (
          <p style={styles.success}>
            ✅ Password changed successfully! Redirecting to login...
          </p>
        )}
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
  passwordWrapper: {
    position: "relative",
    marginBottom: "15px",
  },
  eye: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    color: "#444",
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
  success: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "lightgreen",
  },
};
