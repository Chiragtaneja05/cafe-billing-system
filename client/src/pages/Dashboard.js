import { useEffect, useState } from "react";
import { getToken } from "../utils/auth";
import Navbar from "../components/Navbar";
import "../App.css"; // ✅ Import CSS

function Dashboard() {
  const [stats, setStats] = useState({ totalSales: 0, billCount: 0 });
  const [range, setRange] = useState("today"); // 'today', 'week', 'month'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Fetch data with the selected range query
    fetch(`${process.env.REACT_APP_API_URL}/api/sales?range=${range}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching sales:", err);
        setLoading(false);
      });
  }, [range]); // 🔄 Re-run whenever 'range' changes

  return (
    <>
      <Navbar />
      {/* ✅ Use responsive CSS class */}
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h2>Dashboard</h2>

          {/* 🔽 Filter Dropdown */}
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            style={styles.select}
          >
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
          </select>
        </div>

        {loading ? (
          <p>Loading analytics...</p>
        ) : (
          /* ✅ Use responsive CSS class */
          <div className="dashboard-grid">
            {/* Sales Card */}
            <div style={{ ...styles.card, background: "#e0f7fa" }}>
              <h3>Total Sales</h3>
              <p style={styles.number}>₹{stats.totalSales}</p>
              <small style={styles.subtext}>
                {range === "today"
                  ? "Generated Today"
                  : range === "week"
                    ? "Past 7 Days"
                    : "Past 30 Days"}
              </small>
            </div>

            {/* Orders Card */}
            <div style={{ ...styles.card, background: "#fff3e0" }}>
              <h3>Total Orders</h3>
              <p style={styles.number}>{stats.billCount}</p>
              <small style={styles.subtext}>Bills Created</small>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// Minimal inline styles for specific elements
const styles = {
  select: {
    padding: "8px 12px",
    fontSize: "16px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  card: {
    padding: 30,
    borderRadius: 8,
    textAlign: "center",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },
  number: {
    fontSize: "36px",
    fontWeight: "bold",
    margin: "10px 0",
    color: "#333",
  },
  subtext: {
    color: "#666",
    fontSize: "14px",
  },
};

export default Dashboard;
