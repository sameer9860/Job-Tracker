import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { changePasswordAPI } from "../../api/api";

export default function ChangePassword() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    new_password1: "",
    new_password2: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.new_password1 !== formData.new_password2) {
      alert("Passwords do not match");
      return;
    }

    try {
      await changePasswordAPI(
        formData.username,
        formData.new_password1,
        formData.new_password2
      );

      // logout user
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");

      alert("Password changed successfully. Please login again.");
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
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="new_password1"
          placeholder="New Password"
          value={formData.new_password1}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="new_password2"
          placeholder="Confirm New Password"
          value={formData.new_password2}
          onChange={handleChange}
          required
        />

        <button type="submit">Change Password</button>
      </form>
    </div>
  );
}
