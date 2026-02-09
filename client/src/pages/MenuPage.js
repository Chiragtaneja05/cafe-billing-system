import { useEffect, useState } from "react";
import { getToken, getOwner } from "../utils/auth";
import Navbar from "../components/Navbar";
import QRCode from "react-qr-code"; // ✅ Import QR Code Library
import "../App.css";

function MenuPage() {
  const [menu, setMenu] = useState([]);
  const [filteredMenu, setFilteredMenu] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState(""); // ✅ Stock State
  const [editId, setEditId] = useState(null);

  const [showQR, setShowQR] = useState(false); // ✅ Toggle QR Modal

  const owner = getOwner();
  // Construct the URL for the public menu (e.g., https://yourapp.com/menu/public/OWNER_ID)
  const publicMenuURL = `${window.location.origin}/menu/public/${owner?.id}`;

  const fetchMenu = () => {
    fetch(`${process.env.REACT_APP_API_URL}/api/menu`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const items = Array.isArray(data) ? data : [];
        setMenu(items);
        setFilteredMenu(items);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  // 🔍 Handle Search
  useEffect(() => {
    setFilteredMenu(
      menu.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    );
  }, [searchTerm, menu]);

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !price) {
      alert("Name and price required");
      return;
    }

    const body = JSON.stringify({
      name,
      price: Number(price),
      category: category || "General",
      stock: Number(stock) || 0, // ✅ Send Stock to Backend
    });

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    };

    try {
      let res;
      if (editId) {
        res = await fetch(
          `${process.env.REACT_APP_API_URL}/api/menu/${editId}`,
          { method: "PUT", headers, body },
        );
      } else {
        res = await fetch(`${process.env.REACT_APP_API_URL}/api/menu`, {
          method: "POST",
          headers,
          body,
        });
      }

      if (res.ok) {
        resetForm();
        fetchMenu();
      } else {
        const text = await res.text();
        alert(`Error: ${text}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (item) => {
    setName(item.name);
    setPrice(item.price);
    setCategory(item.category || "");
    setStock(item.stock || 0); // ✅ Load current stock
    setEditId(item._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteMenuItem = async (id) => {
    if (!window.confirm("Delete item?")) return;
    await fetch(`${process.env.REACT_APP_API_URL}/api/menu/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    fetchMenu();
  };

  const resetForm = () => {
    setName("");
    setPrice("");
    setCategory("");
    setStock("");
    setEditId(null);
  };

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        {/* HEADER WITH QR BUTTON */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <h2>Menu & Inventory</h2>
          <button onClick={() => setShowQR(!showQR)} style={styles.qrBtn}>
            📱 Show QR Code
          </button>
        </div>

        {/* 📷 QR CODE MODAL */}
        {showQR && (
          <div style={styles.qrModal}>
            <div style={styles.qrContent}>
              <h3>Scan for Digital Menu</h3>
              <div
                style={{
                  background: "white",
                  padding: "16px",
                  display: "inline-block",
                }}
              >
                <QRCode value={publicMenuURL} size={200} />
              </div>
              <p style={{ marginTop: 10, fontSize: 12, color: "#555" }}>
                {publicMenuURL}
              </p>
              <button onClick={() => setShowQR(false)} style={styles.closeBtn}>
                Close
              </button>
            </div>
          </div>
        )}

        {/* 📝 ADD / EDIT FORM */}
        <div style={styles.card}>
          <h3
            style={{ color: editId ? "#d35400" : "#333", margin: "0 0 15px 0" }}
          >
            {editId ? `Editing: ${name}` : "Add New Item"}
          </h3>

          <form onSubmit={handleSubmit} style={styles.formRow}>
            <input
              placeholder="Item Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={styles.input}
            />
            <input
              type="number"
              placeholder="Price (₹)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              style={styles.inputSmall}
            />

            {/* ✅ NEW STOCK INPUT */}
            <input
              type="number"
              placeholder="Stock Qty"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              style={styles.inputSmall}
            />

            <input
              placeholder="Category (e.g. Coffee)"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={styles.input}
            />

            <div style={{ display: "flex", gap: 10 }}>
              <button
                type="submit"
                style={editId ? styles.updateBtn : styles.addBtn}
              >
                {editId ? "Update" : "Add"}
              </button>
              {editId && (
                <button
                  type="button"
                  onClick={resetForm}
                  style={styles.cancelBtn}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div style={{ margin: "20px 0", textAlign: "right" }}>
          <input
            placeholder="🔍 Search menu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        {/* 🍔 MENU GRID */}
        <div className="menu-grid">
          {filteredMenu.map((item) => (
            <div key={item._id} style={styles.menuCard}>
              <div>
                <h4 style={{ margin: "0 0 5px 0", fontSize: "18px" }}>
                  {item.name}
                </h4>
                <p style={{ margin: 0, color: "#666", fontSize: "12px" }}>
                  {item.category}
                </p>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: 5,
                  }}
                >
                  <span style={{ color: "#27ae60", fontWeight: "bold" }}>
                    ₹{item.price}
                  </span>

                  {/* ✅ STOCK DISPLAY */}
                  <span
                    style={{
                      color: item.stock < 10 ? "red" : "#333",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    Stock: {item.stock}
                  </span>
                </div>
              </div>
              <div style={styles.cardActions}>
                <button onClick={() => handleEdit(item)} style={styles.editBtn}>
                  ✏️ Edit
                </button>
                <button
                  onClick={() => deleteMenuItem(item._id)}
                  style={styles.deleteBtn}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

const styles = {
  card: {
    background: "white",
    padding: 20,
    borderRadius: 8,
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    marginBottom: 20,
  },
  formRow: { display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" },
  input: {
    padding: "10px",
    borderRadius: 4,
    border: "1px solid #ccc",
    flex: 2,
    minWidth: "150px",
  },
  inputSmall: {
    padding: "10px",
    borderRadius: 4,
    border: "1px solid #ccc",
    flex: 1,
    minWidth: "80px",
  },
  searchInput: {
    padding: "10px",
    width: "100%",
    maxWidth: "300px",
    borderRadius: "20px",
    border: "1px solid #ccc",
    outline: "none",
    paddingLeft: "15px",
  },
  menuCard: {
    background: "white",
    padding: 15,
    borderRadius: 8,
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    border: "1px solid #eee",
  },
  cardActions: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 15,
    borderTop: "1px solid #f0f0f0",
    paddingTop: 10,
  },
  addBtn: {
    background: "#27ae60",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: 4,
    cursor: "pointer",
    fontWeight: "bold",
  },
  updateBtn: {
    background: "#d35400",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: 4,
    cursor: "pointer",
    fontWeight: "bold",
  },
  cancelBtn: {
    background: "#95a5a6",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: 4,
    cursor: "pointer",
  },
  editBtn: {
    background: "#f39c12",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: 4,
    cursor: "pointer",
    fontSize: "12px",
  },
  deleteBtn: {
    background: "#c0392b",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: 4,
    cursor: "pointer",
    fontSize: "12px",
  },

  // ✅ NEW STYLES FOR QR MODAL
  qrBtn: {
    background: "#34495e",
    color: "white",
    padding: "8px 15px",
    borderRadius: 4,
    border: "none",
    cursor: "pointer",
  },
  qrModal: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.8)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  qrContent: {
    background: "white",
    padding: 30,
    borderRadius: 10,
    textAlign: "center",
  },
  closeBtn: {
    marginTop: 20,
    padding: "8px 20px",
    background: "#c0392b",
    color: "white",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
  },
};

export default MenuPage;
