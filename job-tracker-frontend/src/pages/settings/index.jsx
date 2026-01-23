import { useNavigate } from "react-router-dom";


export default function Settings() {
  const navigate = useNavigate();

  return (
    <div className="settings-card">
      <h2>⚙️ Settings</h2>

      <button onClick={() => navigate("/settings/change-password")}>
        🔒 Change Password
      </button>
    </div>
  );
}
