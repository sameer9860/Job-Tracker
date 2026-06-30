import { useEffect, useState } from "react";
import API from "../../services/api";

const BACKEND_URL = "http://127.0.0.1:8000";

export default function EditProfileForm({ profile, setProfile, setEditing }) {
  const [formData, setFormData] = useState({
    full_name: "",
    bio: "",
  });

  const [preview, setPreview] = useState("");
  const [success, setSuccess] = useState(false); // ✅ success state

  useEffect(() => {
    setFormData({
      full_name: profile.full_name || "",
      bio: profile.bio || "",
    });

    if (profile.avatar) {
      setPreview(`${BACKEND_URL}${profile.avatar}`);
    } else {
      setPreview(`${BACKEND_URL}/media/avatars/default.png`);
    }
  }, [profile]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("full_name", formData.full_name);
    data.append("bio", formData.bio);

    try {
      const res = await API.put("accounts/profile/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setProfile(res.data);
      setSuccess(true); // ✅ show success message
      setTimeout(() => {
        setEditing(false); // ✅ close form after short delay
      }, 2000);
    } catch (err) {
      console.error(err);
      alert("Profile update failed");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>✏️ Edit Profile</h2>
        <p style={styles.subtitle}>Update your details below</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Show avatar but not editable */}
          <img src={preview} alt="Avatar" style={styles.avatar} />

          <input
            name="full_name"
            placeholder="Full name"
            value={formData.full_name}
            onChange={handleChange}
            style={styles.input}
          />

          <textarea
            name="bio"
            placeholder="Bio"
            value={formData.bio}
            onChange={handleChange}
            style={styles.textarea}
          />

          <div style={styles.actions}>
            <button type="submit" style={styles.buttonSave}>
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              style={styles.buttonCancel}
            >
              Cancel
            </button>
          </div>
        </form>

        {/* ✅ Success message */}
        {success && <p style={styles.success}>✅ Updated successfully!</p>}
      </div>
    </div>
  );
}

/* 🎨 Styles */
const styles = {
  container: {
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    background: "rgba(255, 255, 255, 0.15)",
    backdropFilter: "blur(12px)",
    padding: "30px",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
    color: "#fff",
    textAlign: "center",
  },
  title: {
    marginBottom: "5px",
    fontSize: "22px",
    fontWeight: "bold",
  },
  subtitle: {
    marginBottom: "20px",
    fontSize: "14px",
    color: "#e5e5e5",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  avatar: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    objectFit: "cover",
    alignSelf: "center",
    marginBottom: "10px",
    border: "3px solid #fff",
  },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px",
    outline: "none",
  },
  textarea: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px",
    outline: "none",
    minHeight: "80px",
  },
  actions: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },
  buttonSave: {
    flex: 1,
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    background: "#4f46e5",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  buttonCancel: {
    flex: 1,
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    background: "#e53e3e",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  success: {
    marginTop: "15px",
    fontSize: "14px",
    fontWeight: "bold",
    color: "lightgreen", // ✅ green success message
  },
};
