import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../services/api";

export default function ForgotPasswordOTP() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";
  const [otp, setOTP] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    try {
      const res = await API.post("accounts/password-reset-confirm/", {
        email, otp, password1, password2
      });
      setSuccess(res.data.detail);
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setError(err.response?.data.detail || "Error resetting password");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center" }}>
      <h2>Reset Password</h2>
      <p>OTP sent to: {email}</p>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOTP(e.target.value)} required style={{ padding: "10px", width: "100%", marginBottom: "10px" }}/>
        <input type="password" placeholder="New Password" value={password1} onChange={(e) => setPassword1(e.target.value)} required style={{ padding: "10px", width: "100%", marginBottom: "10px" }}/>
        <input type="password" placeholder="Confirm Password" value={password2} onChange={(e) => setPassword2(e.target.value)} required style={{ padding: "10px", width: "100%", marginBottom: "15px" }}/>
        <button type="submit" style={{ padding: "10px 20px" }}>Reset Password</button>
      </form>
    </div>
  );
}
