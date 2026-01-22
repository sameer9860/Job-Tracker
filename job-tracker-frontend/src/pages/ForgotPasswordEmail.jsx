import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function ForgotPasswordEmail() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    try {
      const res = await API.post("accounts/password-reset-request/", { email });
      setSuccess(res.data.detail);
      setTimeout(() => navigate("/reset-password", { state: { email } }), 1000);
    } catch (err) {
      setError(err.response?.data.detail || "Error sending OTP");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center" }}>
      <h2>Forgot Password</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: "10px", width: "100%", marginBottom: "15px" }}
        />
        <button type="submit" style={{ padding: "10px 20px" }}>Send OTP</button>
      </form>
    </div>
  );
}
