import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme} style={styles.btn}>
      {theme === "light" ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}

const styles = {
  btn: {
    padding: "8px 14px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
  },
};
