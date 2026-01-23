import { useState } from "react";
import { requestPasswordReset } from "../../api/api";

export default function EnterEmail({ onNext }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await requestPasswordReset(email);
      setMessage(res.data.detail);
      onNext(email);
    } catch (err) {
      setMessage(err.response?.data.detail || "Something went wrong");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "40px auto" }}>
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />
        <button type="submit" style={{ width: "100%", padding: "10px", background: "#4f46e5", color: "#fff" }}>
          Send OTP
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
