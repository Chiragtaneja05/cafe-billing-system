import { useNavigate } from "react-router-dom";
import { getOwner, logout } from "../utils/auth";

function Navbar() {
  const owner = getOwner();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      navigate("/login");
    }
  };

  return (
    <div style={styles.navbar}>
      <div style={styles.left}>
        <strong>{owner?.cafeName || "Cafe Billing"}</strong>
      </div>

      <div style={styles.right}>
        <button onClick={() => navigate("/dashboard")}>Dashboard</button>
        <button onClick={() => navigate("/menu")}>Menu</button>
        <button onClick={() => navigate("/billing")}>Billing</button>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 20px",
    backgroundColor: "#222",
    color: "#fff",
  },
  left: {
    fontSize: 18,
  },
  right: {
    display: "flex",
    gap: 10,
  },
};

export default Navbar;
