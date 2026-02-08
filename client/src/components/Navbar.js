import { Link, useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";
import "../App.css"; // Ensure CSS is imported if not already in App.js

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-brand-container">
        <Link to="/dashboard" className="nav-brand">
          Tajinder Cafe
        </Link>
      </div>

      <div className="nav-menu">
        <Link to="/dashboard" className="nav-link">
          Dashboard
        </Link>
        <Link to="/billing" className="nav-link">
          Billing
        </Link>
        <Link to="/menu" className="nav-link">
          Menu
        </Link>
        <Link to="/bills" className="nav-link">
          History
        </Link>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
