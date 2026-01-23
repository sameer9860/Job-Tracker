import { useState } from "react";
import API from "../../services/api";

export default function EditProfileForm({ profile, setProfile, setEditing }) {
  const [formData, setFormData] = useState({
    full_name: profile.full_name || "",
    bio: profile.bio || "",
    avatar: null,
  });

  const handleChange = e => {
    if (e.target.name === "avatar") {
      setFormData({ ...formData, avatar: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));

    try {
      const res = await API.put("accounts/profile/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProfile(res.data);
      setEditing(false);
    } catch (err) {
      console.error(err);
      alert("Error updating profile.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="full_name"
        value={formData.full_name}
        onChange={handleChange}
        placeholder="Full Name"
      />
      <textarea
        name="bio"
        value={formData.bio}
        onChange={handleChange}
        placeholder="Bio"
      />
      <input type="file" name="avatar" onChange={handleChange} />
      <button type="submit">Save</button>
      <button type="button" onClick={() => setEditing(false)}>
        Cancel
      </button>
    </form>
  );
}
