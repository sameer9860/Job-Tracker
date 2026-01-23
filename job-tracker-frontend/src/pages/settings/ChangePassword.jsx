import { useState } from "react";
import API from "../../api/api";
import { useNavigate } from "react-router-dom";

export default function ChangePassword() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    new_password1: "",
    new_password2: "",
  });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      await API.put("change-password/", formData);

      // 🔐 LOGOUT AFTER PASSWORD CHANGE
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");

      alert("Password changed. Please login again.");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.error || "Password change failed");
    }
  };

  return (
    <div className="settings-card">
      <h2>Change Password</h2>

      <form onSubmit={handleSubmit}>
      

        <input
          type="password"
          name="new_password1"
          placeholder="New Password"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="new_password2"
          placeholder="Confirm New Password"
          onChange={handleChange}
          required
        />

        <button type="submit">Change Password</button>
      </form>
    </div>
  );
}
