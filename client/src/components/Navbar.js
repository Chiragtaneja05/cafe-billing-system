import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logout } from "../utils/auth";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // 🔔 NOTIFICATION STATES
  const [lowStockItems, setLowStockItems] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // ✅ FETCH LOW STOCK ITEMS
  const checkStock = () => {
    fetch(`${process.env.REACT_APP_API_URL}/api/menu`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const low = data.filter((item) => (item.stock || 0) < 10);
          setLowStockItems(low);
        }
      })
      .catch((err) => console.error("Stock check error:", err));
  };

  useEffect(() => {
    checkStock();
    const interval = setInterval(checkStock, 60000); // Check every 1 minute
    return () => clearInterval(interval);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="modern-navbar">
        <div className="nav-content">
          <div className="nav-logo">
            <Link to="/dashboard" className="brand-text">
              Cafe<span>System</span>
            </Link>
          </div>

          <div className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
            <div className={`bar ${isOpen ? "open" : ""}`}></div>
            <div className={`bar ${isOpen ? "open" : ""}`}></div>
            <div className={`bar ${isOpen ? "open" : ""}`}></div>
          </div>

          <div className={`nav-links ${isOpen ? "active" : ""}`}>
            <Link
              to="/dashboard"
              className={isActive("/dashboard") ? "active" : ""}
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/billing"
              className={isActive("/billing") ? "active" : ""}
              onClick={() => setIsOpen(false)}
            >
              Billing
            </Link>
            <Link
              to="/menu"
              className={isActive("/menu") ? "active" : ""}
              onClick={() => setIsOpen(false)}
            >
              Menu
            </Link>
            <Link
              to="/expenses"
              className={isActive("/expenses") ? "active" : ""}
              onClick={() => setIsOpen(false)}
            >
              Expenses
            </Link>
            <Link
              to="/bills"
              className={isActive("/bills") ? "active" : ""}
              onClick={() => setIsOpen(false)}
            >
              History
            </Link>

            {/* 🔔 NOTIFICATION BELL */}
            <div className="nav-notif-container">
              <button
                className="notif-btn"
                onClick={() => setShowNotifs(!showNotifs)}
              >
                🔔{" "}
                {lowStockItems.length > 0 && (
                  <span className="notif-badge">{lowStockItems.length}</span>
                )}
              </button>

              {showNotifs && (
                <div className="notif-dropdown">
                  <h4>Low Stock Alerts</h4>
                  {lowStockItems.length === 0 ? (
                    <p className="no-notif">All items are well stocked! ✅</p>
                  ) : (
                    lowStockItems.map((item) => (
                      <div key={item._id} className="notif-item">
                        <span>{item.name}</span>
                        <span className="notif-qty">{item.stock} left</span>
                      </div>
                    ))
                  )}
                  <Link
                    to="/menu"
                    className="manage-link"
                    onClick={() => setShowNotifs(false)}
                  >
                    Manage Stock
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/settings"
              className={isActive("/settings") ? "active" : ""}
              onClick={() => setIsOpen(false)}
            >
              Settings
            </Link>
            <button onClick={handleLogout} className="nav-logout">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <style>{`
        .modern-navbar {
          background: #ffffff;
          height: 70px;
          display: flex;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 1000;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          font-family: 'Inter', sans-serif;
        }
        .nav-content { width: 90%; max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }
        .brand-text { font-size: 1.5rem; font-weight: 800; color: #333; text-decoration: none; letter-spacing: -1px; }
        .brand-text span { color: #6a1b9a; }
        .nav-links { display: flex; gap: 20px; align-items: center; }
        .nav-links a { text-decoration: none; color: #666; font-weight: 500; font-size: 0.95rem; transition: 0.3s; padding: 8px 12px; border-radius: 6px; }
        .nav-links a:hover { color: #6a1b9a; background: #f3e5f5; }
        .nav-links a.active { color: #fff; background: #6a1b9a; box-shadow: 0 4px 10px rgba(106, 27, 154, 0.2); }
        .nav-logout { background: #333; color: white; border: none; padding: 8px 18px; border-radius: 6px; font-weight: 600; cursor: pointer; transition: 0.3s; }
        .nav-logout:hover { background: #000; }

        /* 🔔 NOTIFICATION STYLES */
        .nav-notif-container { position: relative; }
        .notif-btn { background: transparent; border: none; font-size: 1.2rem; cursor: pointer; position: relative; padding: 5px; }
        .notif-badge { position: absolute; top: 0; right: 0; background: #ff3b30; color: white; font-size: 10px; font-weight: bold; padding: 2px 5px; border-radius: 50%; border: 2px solid #fff; }
        .notif-dropdown { position: absolute; top: 45px; right: 0; background: white; width: 220px; box-shadow: 0 8px 24px rgba(0,0,0,0.15); border-radius: 8px; padding: 15px; z-index: 1001; }
        .notif-dropdown h4 { margin: 0 0 10px 0; font-size: 14px; color: #333; border-bottom: 1px solid #eee; padding-bottom: 5px; }
        .notif-item { display: flex; justify-content: space-between; padding: 8px 0; font-size: 13px; border-bottom: 1px dashed #f0f0f0; }
        .notif-qty { color: #ff3b30; font-weight: bold; }
        .no-notif { font-size: 12px; color: #888; text-align: center; margin: 10px 0; }
        .manage-link { display: block; text-align: center; margin-top: 10px; font-size: 12px; color: #6a1b9a !important; font-weight: bold; background: none !important; }

        .mobile-toggle { display: none; flex-direction: column; gap: 5px; cursor: pointer; }
        .bar { width: 25px; height: 3px; background: #333; border-radius: 2px; transition: 0.3s; }

        @media (max-width: 768px) {
          .mobile-toggle { display: flex; }
          .nav-links { position: absolute; top: 70px; right: 0; background: #fff; width: 100%; flex-direction: column; padding: 20px 0; gap: 10px; display: none; box-shadow: 0 10px 15px rgba(0,0,0,0.1); }
          .nav-links.active { display: flex; }
          .nav-links a { width: 80%; text-align: center; }
          .notif-dropdown { right: auto; left: 50%; transform: translateX(-50%); width: 90%; }
          .bar.open:nth-child(1) { transform: rotate(45deg) translate(5px, 6px); }
          .bar.open:nth-child(2) { opacity: 0; }
          .bar.open:nth-child(3) { transform: rotate(-45deg) translate(5px, -6px); }
        }
      `}</style>
    </>
  );
}

export default Navbar;
