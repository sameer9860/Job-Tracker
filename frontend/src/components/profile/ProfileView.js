import { useEffect, useState } from "react";
import API from "../../services/api";
import EditProfileForm from "./EditProfileForm";

const BACKEND_URL = "http://127.0.0.1:8000";

export default function ProfileView({ onClose }) {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await API.get("accounts/profile/");
      setProfile(res.data);
    } catch (err) {
      console.error("Profile load failed:", err);
      alert("Error loading profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const getAvatarUrl = () => {
    if (!profile?.avatar) {
      return `${BACKEND_URL}/media/avatars/default.png`;
    }
    return profile.avatar.startsWith("http")
      ? profile.avatar
      : `${BACKEND_URL}${profile.avatar}`;
  };

  if (loading) return <p style={center}>Loading profile...</p>;
  if (!profile) return <p style={center}>Profile not found</p>;

  return (
    <div style={styles.container}>
      <button onClick={onClose} style={styles.backBtn}>← Back</button>

      {!editing ? (
        <div style={styles.card}>
          <img src={getAvatarUrl()} alt="Avatar" style={styles.avatar} />
          <h2 style={styles.title}>{profile.full_name || profile.username}</h2>
          <p style={styles.bio}>{profile.bio || "No bio yet"}</p>

          <button style={styles.editBtn} onClick={() => setEditing(true)}>
            Edit Profile
          </button>
        </div>
      ) : (
        <EditProfileForm
          profile={profile}
          setProfile={setProfile}
          setEditing={setEditing}
        />
      )}
    </div>
  );
}

const center = { textAlign: "center", marginTop: "40px" };

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    padding: "20px",
  },
  backBtn: {
    background: "none",
    border: "none",
    color: "#fff",
    cursor: "pointer",
    marginBottom: "20px",
    fontSize: "16px",
    fontWeight: "bold",
  },
  card: {
    background: "rgba(255, 255, 255, 0.15)",
    backdropFilter: "blur(12px)",
    padding: "40px",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
    color: "#fff",
    textAlign: "center",
  },
  avatar: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: "15px",
    border: "3px solid #fff",
  },
  title: {
    fontSize: "22px",
    fontWeight: "bold",
    marginBottom: "8px",
  },
  bio: {
    fontSize: "14px",
    color: "#e5e5e5",
    marginBottom: "20px",
  },
  editBtn: {
    marginTop: "12px",
    padding: "12px 20px",
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    transition: "background 0.3s",
  },
};
