import { useEffect, useState } from "react";
import { getToken } from "../utils/auth";
import Navbar from "../components/Navbar";

function MenuPage() {
  const [menu, setMenu] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");

  // fetch menu
  const fetchMenu = () => {
    fetch(`${process.env.REACT_APP_API_URL}/api/menu`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setMenu(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  // add menu item
  const addMenuItem = async (e) => {
    e.preventDefault();

    if (!name || !price) {
      alert("Name and price are required");
      return;
    }

    await fetch(`${process.env.REACT_APP_API_URL}/api/menu`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({
        name,
        price,
        category,
      }),
    });

    setName("");
    setPrice("");
    setCategory("");
    fetchMenu();
  };

  // delete menu item
  const deleteMenuItem = async (id) => {
    if (!window.confirm("Delete this item?")) return;

    await fetch(`${process.env.REACT_APP_API_URL}/api/menu/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    fetchMenu();
  };

  return (
    <>
      <Navbar />

      <div style={styles.container}>
        <h2>Menu Management</h2>

        {/* Add Item Card */}
        <div style={styles.card}>
          <h3>Add New Item</h3>

          <form onSubmit={addMenuItem} style={styles.form}>
            <input
              placeholder="Item Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              type="number"
              placeholder="Price (₹)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />

            <input
              placeholder="Category (optional)"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />

            <button type="submit">Add Item</button>
          </form>
        </div>

        {/* Menu List */}
        <div style={styles.card}>
          <h3>Current Menu</h3>

          {menu.length === 0 && <p>No items added yet.</p>}

          {menu.map((item) => (
            <div key={item._id} style={styles.menuRow}>
              <span>
                {item.name} – ₹{item.price}
                {item.category && (
                  <small style={{ marginLeft: 6, color: "#666" }}>
                    ({item.category})
                  </small>
                )}
              </span>

              <button
                onClick={() => deleteMenuItem(item._id)}
                style={styles.deleteBtn}
              >
                ❌
              </button>
            </div>
          ))}
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
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    maxWidth: 300,
  },
  menuRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "6px 0",
    borderBottom: "1px solid #ddd",
  },
  deleteBtn: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
  },
};

export default MenuPage;
