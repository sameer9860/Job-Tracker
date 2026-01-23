import { useState } from "react";
import { verifyOTP } from "../../api/api";

export default function OTPVerify({ email, onNext }) {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await verifyOTP(email, otp);
      setMessage(res.data.detail);
      onNext(otp); // 🔥 IMPORTANT FIX
    } catch (err) {
      setMessage(err.response?.data?.detail || "Invalid OTP");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "40px auto" }}>
      <h2>Verify OTP</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        <button type="submit" style={btnStyle}>
          Verify
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

const btnStyle = {
  width: "100%",
  padding: "10px",
  background: "#4f46e5",
  color: "#fff",
};
