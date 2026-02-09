import { useEffect, useState } from "react";
import { getToken } from "../utils/auth";
import Navbar from "../components/Navbar";
import "../App.css";

function Dashboard() {
  // ✅ Updated State to hold Expenses & Profit
  const [stats, setStats] = useState({
    totalSales: 0,
    totalExpenses: 0,
    netProfit: 0,
    billCount: 0,
  });

  const [range, setRange] = useState("today");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  const [lowStockItems, setLowStockItems] = useState([]);
  const [recentBills, setRecentBills] = useState([]);
  const [topItems, setTopItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. Fetch Dashboard Data
  const fetchDashboardData = () => {
    setLoading(true);

    let url = `${process.env.REACT_APP_API_URL}/api/sales?range=${range}`;
    if (range === "custom") {
      if (!customStart || !customEnd) {
        setLoading(false);
        return;
      }
      url += `&from=${customStart}&to=${customEnd}`;
    }

    fetch(url, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then((res) => res.json())
      .then((data) => {
        // ✅ Update Stats with new fields from Backend
        setStats({
          totalSales: data.totalSales || 0,
          totalExpenses: data.totalExpenses || 0,
          netProfit: data.netProfit || 0,
          billCount: data.billCount || 0,
        });

        if (data.bills) {
          setRecentBills(data.bills.slice(0, 5));
          calculateTopSelling(data.bills);
        }
      })
      .catch((err) => console.error("Error fetching dashboard data:", err))
      .finally(() => {
        fetchStock();
      });
  };

  // 2. Fetch Stock
  const fetchStock = () => {
    fetch(`${process.env.REACT_APP_API_URL}/api/menu`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const lowStock = data.filter((item) => (item.stock || 0) < 20);
          setLowStockItems(lowStock);
        }
      })
      .catch((err) => console.error("Error fetching menu:", err))
      .finally(() => setLoading(false));
  };

  // 3. Calculate Top Items
  const calculateTopSelling = (bills) => {
    const itemCounts = {};
    bills.forEach((bill) => {
      bill.items.forEach((item) => {
        itemCounts[item.name] = (itemCounts[item.name] || 0) + item.quantity;
      });
    });

    const sortedItems = Object.keys(itemCounts)
      .map((key) => ({ name: key, count: itemCounts[key] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    setTopItems(sortedItems);
  };

  useEffect(() => {
    if (range !== "custom") {
      fetchDashboardData();
    }
  }, [range]);

  const handleCustomApply = () => {
    if (customStart && customEnd) {
      fetchDashboardData();
    } else {
      alert("Please select both Start and End dates");
    }
  };

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        {/* HEADER */}
        <div className="dashboard-header">
          <h2>📊 Dashboard Overview</h2>
          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <select
              value={range}
              onChange={(e) => setRange(e.target.value)}
              style={styles.select}
            >
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="custom">📅 Custom Range</option>
            </select>

            {range === "custom" && (
              <div style={styles.customDateBox}>
                <input
                  type="date"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                  style={styles.dateInput}
                />
                <span style={{ color: "#666" }}>to</span>
                <input
                  type="date"
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                  style={styles.dateInput}
                />
                <button onClick={handleCustomApply} style={styles.applyBtn}>
                  Go
                </button>
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <p>Loading analytics...</p>
        ) : (
          <div className="dashboard-grid">
            {/* 💰 1. SALES CARD */}
            <div style={{ ...styles.card, background: "#e0f7fa" }}>
              <h3>Total Sales</h3>
              <p style={styles.number}>₹{stats.totalSales}</p>
              <small style={styles.subtext}>Revenue In</small>
            </div>

            {/* 💸 2. EXPENSES CARD (NEW) */}
            <div style={{ ...styles.card, background: "#ffebee" }}>
              <h3>Total Expenses</h3>
              <p style={{ ...styles.number, color: "#c0392b" }}>
                ₹{stats.totalExpenses}
              </p>
              <small style={styles.subtext}>Costs Out</small>
            </div>

            {/* 📈 3. NET PROFIT CARD (NEW) */}
            <div style={{ ...styles.card, background: "#e8f5e9" }}>
              <h3>Net Profit</h3>
              <p
                style={{
                  ...styles.number,
                  color: stats.netProfit >= 0 ? "#27ae60" : "#c0392b",
                }}
              >
                {stats.netProfit >= 0
                  ? `+₹${stats.netProfit}`
                  : `-₹${Math.abs(stats.netProfit)}`}
              </p>
              <small style={styles.subtext}>Earnings (Sales - Expenses)</small>
            </div>

            {/* 🧾 4. ORDERS CARD */}
            <div style={{ ...styles.card, background: "#fff3e0" }}>
              <h3>Total Orders</h3>
              <p style={styles.number}>{stats.billCount}</p>
              <small style={styles.subtext}>Bills Created</small>
            </div>

            {/* 🔥 TOP SELLING ITEMS */}
            <div
              style={{
                ...styles.card,
                background: "#f3e5f5",
                gridColumn: "span 2",
              }}
            >
              <h3 style={{ color: "#6a1b9a", marginBottom: "15px" }}>
                🔥 Top Selling Items
              </h3>
              {topItems.length === 0 ? (
                <p style={{ color: "#666" }}>No items sold in this period.</p>
              ) : (
                <div style={styles.topList}>
                  {topItems.map((item, index) => (
                    <div key={index} style={styles.topItem}>
                      <span style={{ fontWeight: "bold" }}>
                        #{index + 1} {item.name}
                      </span>
                      <span style={styles.badge}>{item.count} sold</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ⚠️ LOW STOCK ALERT */}
            <div
              style={{
                ...styles.card,
                background: "#fffde7",
                gridColumn: "span 2",
              }}
            >
              <h3 style={{ color: "#fbc02d", marginBottom: "10px" }}>
                ⚠️ Low Stock Alerts
              </h3>
              {lowStockItems.length === 0 ? (
                <p style={{ color: "green", fontWeight: "bold" }}>
                  ✅ All items stocked!
                </p>
              ) : (
                <div style={styles.stockList}>
                  {lowStockItems.map((item) => (
                    <div key={item._id} style={styles.stockItem}>
                      <span>{item.name}</span>
                      <span
                        style={{
                          fontWeight: "bold",
                          color: item.stock === 0 ? "red" : "#e65100",
                        }}
                      >
                        {item.stock === 0
                          ? "OUT OF STOCK"
                          : `${item.stock} left`}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 🕒 RECENT ACTIVITY */}
            <div
              style={{
                ...styles.card,
                background: "white",
                gridColumn: "span 2",
                textAlign: "left",
              }}
            >
              <h3
                style={{
                  marginBottom: "15px",
                  borderBottom: "1px solid #eee",
                  paddingBottom: "10px",
                }}
              >
                🕒 Recent Activity
              </h3>
              {recentBills.length === 0 ? (
                <p>No sales in this range.</p>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#f9f9f9", textAlign: "left" }}>
                      <th style={styles.th}>Customer</th>
                      <th style={styles.th}>Amount</th>
                      <th style={styles.th}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBills.map((bill) => (
                      <tr
                        key={bill._id}
                        style={{ borderBottom: "1px solid #eee" }}
                      >
                        <td style={styles.td}>
                          {bill.customerName || "Walk-in"}
                          <div style={{ fontSize: "12px", color: "#888" }}>
                            {bill.items.length} items
                          </div>
                        </td>
                        <td
                          style={{
                            ...styles.td,
                            fontWeight: "bold",
                            color: "#27ae60",
                          }}
                        >
                          ₹{bill.totalAmount}
                        </td>
                        <td
                          style={{
                            ...styles.td,
                            fontSize: "12px",
                            color: "#666",
                          }}
                        >
                          {new Date(bill.createdAt).toLocaleDateString()} <br />
                          {new Date(bill.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              <button
                style={styles.viewAllBtn}
                onClick={() => (window.location.href = "/bills")}
              >
                View Full History →
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

const styles = {
  select: {
    padding: "8px 12px",
    fontSize: "16px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  customDateBox: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
    background: "white",
    padding: "5px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    marginTop: "5px",
  },
  dateInput: { padding: "5px", borderRadius: "4px", border: "1px solid #ccc" },
  applyBtn: {
    padding: "6px 15px",
    background: "#333",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  card: {
    padding: 25,
    borderRadius: 8,
    textAlign: "center",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  number: {
    fontSize: "36px",
    fontWeight: "bold",
    margin: "10px 0",
    color: "#333",
  },
  subtext: { color: "#666", fontSize: "14px" },
  stockList: {
    marginTop: "5px",
    textAlign: "left",
    maxHeight: "150px",
    overflowY: "auto",
  },
  stockItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
    borderBottom: "1px dashed #ccc",
    fontSize: "14px",
  },
  topList: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
    textAlign: "left",
  },
  topItem: {
    background: "white",
    padding: "10px",
    borderRadius: "6px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  badge: {
    background: "#6a1b9a",
    color: "white",
    padding: "2px 8px",
    borderRadius: "10px",
    fontSize: "12px",
    fontWeight: "bold",
  },
  th: { padding: "10px", fontSize: "12px", color: "#555" },
  td: { padding: "10px", fontSize: "14px" },
  viewAllBtn: {
    marginTop: "15px",
    padding: "10px",
    background: "#f0f2f5",
    border: "none",
    cursor: "pointer",
    width: "100%",
    borderRadius: "4px",
    fontWeight: "bold",
    color: "#555",
  },
};

export default Dashboard;
