import { useState } from "react";
import { setNewPassword } from "../../api/api";

export default function SetNewPassword({ email, otp, onSuccess }) {
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (password1 !== password2) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const res = await setNewPassword(
        email,
        otp,
        password1,
        password2
      );
      setMessage(res.data.detail);
      onSuccess();
    } catch (err) {
      setMessage(err.response?.data?.detail || "Something went wrong");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "40px auto" }}>
      <h2>Set New Password</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="New Password"
          value={password1}
          onChange={(e) => setPassword1(e.target.value)}
          required
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        <input
          type="password"
          placeholder="Confirm New Password"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          required
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        <button type="submit" style={btnStyle}>
          Set Password
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
