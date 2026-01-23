import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ for redirect
import { registerUser } from "../api/api";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // ✅ optional password toggler
import { Link } from "react-router-dom"; // ✅ for navigation to login

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (form.password !== form.confirm_password) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const res = await registerUser(form);
      setMessage(res.data.detail);
      setSuccess(true);

      // ✅ Redirect to login after short delay
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      setMessage("Registration failed");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {!success ? (
          <>
            <h2 style={styles.title}>📝 Register</h2>
            <p style={styles.subtitle}>Create your account</p>

            <form onSubmit={handleSubmit}>
              <input
                name="username"
                placeholder="Username"
                onChange={handleChange}
                required
                style={styles.input}
              />

              <input
                name="email"
                type="email"
                placeholder="Email"
                onChange={handleChange}
                required
                style={styles.input}
              />

              {/* Password */}
              <div style={styles.passwordWrapper}>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
                <span
                  style={styles.eye}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>

              {/* Confirm Password */}
              <div style={styles.passwordWrapper}>
                <input
                  name="confirm_password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
                <span
                  style={styles.eye}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>

              <button type="submit" style={styles.button}>
                Register
              </button>
            <p style={{ marginTop: "10px" }}>
              Already have an account?{" "}
              <Link
                to="/"
                style={{
                  color: "#facc15",
                  textDecoration: "none",
                  fontWeight: "bold",
                }}
              >
                Login
              </Link>
            </p>
            </form>

            {message && <p style={styles.message}>{message}</p>}
          </>
        ) : (
          <p style={styles.success}>
            ✅ Registration successful! Redirecting to login...
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
