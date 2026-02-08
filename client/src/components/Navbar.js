import { Link, useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.brand}>
        <Link to="/dashboard" style={styles.link}>
          Tajinder Cafe
        </Link>
      </div>
      <div style={styles.menu}>
        <Link to="/dashboard" style={styles.navItem}>
          Dashboard
        </Link>
        <Link to="/billing" style={styles.navItem}>
          Billing
        </Link>
        <Link to="/menu" style={styles.navItem}>
          Menu
        </Link>
        <Link to="/bills" style={styles.navItem}>
          History
        </Link>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Logout
        </button>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 40px",
    background: "#333",
    color: "white",
  },
  brand: {
    fontSize: "20px",
    fontWeight: "bold",
  },
  menu: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
  },
  link: {
    color: "white",
    textDecoration: "none",
  },
  navItem: {
    color: "white",
    textDecoration: "none",
    fontSize: "16px",
  },
  logoutBtn: {
    background: "#c0392b",
    color: "white",
    border: "none",
    padding: "8px 12px",
    cursor: "pointer",
    borderRadius: "4px",
  },
};

export default Navbar;
