import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getOwner, getToken, logout } from "../utils/auth";
import Navbar from "../components/Navbar";

function Dashboard() {
  const owner = getOwner();
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/sales/today`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setSummary(data))
      .catch((err) => console.error(err));
  }, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      navigate("/login");
    }
  };

  return (
    <>
      <Navbar />

      <div style={styles.container}>
        <h2>Welcome, {owner?.name}</h2>
        <h3>{owner?.cafeName}</h3>

        <hr />

        {summary ? (
          <div style={styles.card}>
            <h2>📊 Today’s Sales</h2>
            <p>
              <strong>Total Sales:</strong> ₹{summary.totalSales}
            </p>
            <p>
              <strong>Total Bills:</strong> {summary.billCount}
            </p>
          </div>
        ) : (
          <p>Loading sales data...</p>
        )}

        <div style={styles.actions}>
          <button onClick={() => navigate("/billing")}>Open Billing</button>

          <button onClick={() => navigate("/menu")}>Manage Menu</button>

          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </>
  );
}

const styles = {
  container: {
    padding: 40,
  },
  card: {
    background: "#f5f5f5",
    padding: 20,
    borderRadius: 6,
    marginBottom: 20,
  },
  actions: {
    display: "flex",
    gap: 15,
  },
};

export default Dashboard;
