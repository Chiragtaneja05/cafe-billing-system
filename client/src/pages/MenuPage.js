import { useEffect, useState } from "react";
import { getToken } from "../utils/auth";
import Navbar from "../components/Navbar";

function MenuPage() {
  const [menu, setMenu] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [editId, setEditId] = useState(null);

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
      .catch((err) => console.error("Error fetching menu:", err));
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !price) {
      alert("Name and price are required");
      return;
    }

    const token = getToken();
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    const body = JSON.stringify({
      name,
      price: Number(price),
      category,
    });

    try {
      let res;
      if (editId) {
        console.log(`Updating item ${editId}...`);
        res = await fetch(
          `${process.env.REACT_APP_API_URL}/api/menu/${editId}`,
          {
            method: "PUT",
            headers,
            body,
          },
        );
      } else {
        console.log("Creating new item...");
        res = await fetch(`${process.env.REACT_APP_API_URL}/api/menu`, {
          method: "POST",
          headers,
          body,
        });
      }

      if (res.ok) {
        resetForm();
        fetchMenu();
        alert(editId ? "Item updated!" : "Item added!");
      } else {
        // IMPROVED ERROR HANDLING
        const text = await res.text();
        try {
          const data = JSON.parse(text);
          alert(`Error: ${data.message}`);
        } catch {
          // This will show "Server Error: 404" if the route is missing
          alert(
            `Server Error: ${res.status} ${res.statusText || "(No message)"}`,
          );
          console.error("Server Response:", text);
        }
      }
    } catch (err) {
      console.error("Submit Error:", err);
      alert("Network Error: Could not connect to server.");
    }
  };

  const handleEdit = (item) => {
    setName(item.name);
    setPrice(item.price);
    setCategory(item.category || "");
    setEditId(item._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

  const resetForm = () => {
    setName("");
    setPrice("");
    setCategory("");
    setEditId(null);
  };

  return (
    <>
      <Navbar />

      <div style={styles.container}>
        <h2>Menu Management</h2>

        <div style={styles.card}>
          <h3 style={{ color: editId ? "#d35400" : "#333" }}>
            {editId ? `Editing: ${name}` : "Add New Item"}
          </h3>

          <form onSubmit={handleSubmit} style={styles.form}>
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

            <div style={styles.formActions}>
              <button
                type="submit"
                style={editId ? styles.updateBtn : styles.addBtn}
              >
                {editId ? "Update Item" : "Add Item"}
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

        <div style={styles.card}>
          <h3>Current Menu</h3>
          {menu.map((item) => (
            <div key={item._id} style={styles.menuRow}>
              <span>
                <strong>{item.name}</strong> – ₹{item.price}
                {item.category && <small> ({item.category})</small>}
              </span>
              <div>
                <button onClick={() => handleEdit(item)} style={styles.editBtn}>
                  ✏️
                </button>
                <button
                  onClick={() => deleteMenuItem(item._id)}
                  style={styles.deleteBtn}
                >
                  ❌
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
  container: { padding: 40, maxWidth: "800px", margin: "0 auto" },
  card: {
    background: "#f5f5f5",
    padding: 20,
    borderRadius: 6,
    marginBottom: 20,
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },
  form: { display: "flex", flexDirection: "column", gap: 10, maxWidth: 400 },
  formActions: { display: "flex", gap: 10, marginTop: 10 },
  addBtn: {
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    padding: "10px 15px",
    cursor: "pointer",
    borderRadius: 4,
    fontWeight: "bold",
  },
  updateBtn: {
    backgroundColor: "#d35400",
    color: "white",
    border: "none",
    padding: "10px 15px",
    cursor: "pointer",
    borderRadius: 4,
    fontWeight: "bold",
  },
  cancelBtn: {
    backgroundColor: "#95a5a6",
    color: "white",
    border: "none",
    padding: "10px 15px",
    cursor: "pointer",
    borderRadius: 4,
  },
  menuRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 0",
    borderBottom: "1px solid #ddd",
  },
  editBtn: {
    background: "transparent",
    border: "1px solid #d35400",
    color: "#d35400",
    cursor: "pointer",
    padding: "5px 10px",
    marginRight: 10,
    borderRadius: 4,
  },
  deleteBtn: {
    background: "transparent",
    border: "1px solid #c0392b",
    color: "#c0392b",
    cursor: "pointer",
    padding: "5px 10px",
    borderRadius: 4,
  },
};

export default MenuPage;
