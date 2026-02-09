import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getToken } from "../utils/auth";
import "../App.css";

function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "Inventory",
    date: "",
  });
  const [loading, setLoading] = useState(true);

  // Fetch Expenses
  const fetchExpenses = () => {
    fetch(`${process.env.REACT_APP_API_URL}/api/expenses`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setExpenses(data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Handle Add
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.amount) return alert("Please fill details");

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/expenses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setForm({ title: "", amount: "", category: "Inventory", date: "" }); // Reset
        fetchExpenses(); // Refresh list
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this expense?")) return;
    await fetch(`${process.env.REACT_APP_API_URL}/api/expenses/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    fetchExpenses();
  };

  // Calculate Total
  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <h2 style={{ marginBottom: "20px" }}>💸 Expense Tracker</h2>

        {/* 📝 Add Expense Form */}
        <div style={styles.card}>
          <h3>Add New Expense</h3>
          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              placeholder="Expense Name (e.g. Milk)"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              style={styles.input}
              required
            />
            <input
              type="number"
              placeholder="Amount (₹)"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              style={styles.inputSmall}
              required
            />
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              style={styles.input}
            >
              <option value="Inventory">Inventory (Milk, Sugar)</option>
              <option value="Utilities">Utilities (Bill, Wifi)</option>
              <option value="Salary">Staff Salary</option>
              <option value="Rent">Rent</option>
              <option value="Other">Other</option>
            </select>
            <button type="submit" style={styles.addBtn}>
              Add Cost
            </button>
          </form>
        </div>

        {/* 📊 Summary */}
        <div style={styles.summaryCard}>
          <span>Total Expenses (All Time):</span>
          <span
            style={{ fontSize: "24px", fontWeight: "bold", color: "#c0392b" }}
          >
            ₹{totalExpenses}
          </span>
        </div>

        {/* 📜 Expense List */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div style={styles.listContainer}>
            {expenses.map((item) => (
              <div key={item._id} style={styles.expenseItem}>
                <div>
                  <div style={{ fontWeight: "bold", fontSize: "16px" }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: "12px", color: "#666" }}>
                    {new Date(item.date).toLocaleDateString()} • {item.category}
                  </div>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "15px" }}
                >
                  <span style={{ fontWeight: "bold", color: "#c0392b" }}>
                    - ₹{item.amount}
                  </span>
                  <button
                    onClick={() => handleDelete(item._id)}
                    style={styles.deleteBtn}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

const styles = {
  card: {
    background: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    marginBottom: "20px",
  },
  form: { display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "15px" },
  input: {
    flex: 2,
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    minWidth: "150px",
  },
  inputSmall: {
    flex: 1,
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    minWidth: "80px",
  },
  addBtn: {
    background: "#c0392b",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  summaryCard: {
    background: "#ffebee",
    padding: "20px",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    border: "1px solid #ffcdd2",
  },
  listContainer: {
    background: "white",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    overflow: "hidden",
  },
  expenseItem: {
    padding: "15px",
    borderBottom: "1px solid #eee",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  deleteBtn: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
  },
};

export default ExpensesPage;
