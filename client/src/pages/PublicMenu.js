import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../App.css"; // Reuse global styles

function PublicMenu() {
  const { ownerId } = useParams(); // Get the ID from the URL
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch from the PUBLIC route we created
    fetch(`${process.env.REACT_APP_API_URL}/api/menu/public/${ownerId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Could not load menu");
        return res.json();
      })
      .then((data) => {
        setMenu(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Menu not found or cafe is offline.");
        setLoading(false);
      });
  }, [ownerId]);

  // ✅ Group Items by Category (e.g. { "Coffee": [...], "Snacks": [...] })
  const groupedMenu = menu.reduce((acc, item) => {
    const category = item.category || "General";
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {});

  if (loading) return <div style={styles.center}>Loading Menu... ⏳</div>;
  if (error) return <div style={styles.center}>❌ {error}</div>;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>🍽️ Digital Menu</h1>
        <p>Welcome! Please browse our menu below.</p>
      </header>

      {Object.keys(groupedMenu).length === 0 ? (
        <p style={{ textAlign: "center", color: "#666" }}>
          No items available yet.
        </p>
      ) : (
        Object.keys(groupedMenu).map((category) => (
          <div key={category} style={styles.categorySection}>
            <h2 style={styles.categoryTitle}>{category}</h2>

            <div style={styles.grid}>
              {groupedMenu[category].map((item) => (
                <div key={item._id} style={styles.card}>
                  <div style={styles.cardHeader}>
                    <h3 style={styles.itemName}>{item.name}</h3>
                    <span style={styles.price}>₹{item.price}</span>
                  </div>

                  {/* Stock Status Badge */}
                  {item.stock !== undefined && item.stock < 1 ? (
                    <span style={styles.outOfStock}>🚫 Out of Stock</span>
                  ) : item.stock < 10 ? (
                    <span style={styles.lowStock}>⚠️ Low Stock</span>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      <footer style={styles.footer}>
        <p>Powered by Tajinder Cafe System 🚀</p>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "20px",
    background: "#f9f9f9",
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
  },
  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    fontSize: "18px",
    color: "#555",
  },
  header: {
    textAlign: "center",
    marginBottom: "30px",
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
  },
  categorySection: {
    marginBottom: "30px",
  },
  categoryTitle: {
    color: "#d35400",
    borderBottom: "2px solid #e67e22",
    paddingBottom: "5px",
    marginBottom: "15px",
    fontSize: "22px",
  },
  grid: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  card: {
    background: "white",
    padding: "15px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemName: {
    margin: 0,
    fontSize: "18px",
    color: "#333",
  },
  price: {
    fontWeight: "bold",
    color: "#27ae60",
    fontSize: "18px",
  },
  outOfStock: {
    marginTop: "5px",
    alignSelf: "flex-start",
    fontSize: "12px",
    background: "#ffcdd2",
    color: "#c62828",
    padding: "2px 8px",
    borderRadius: "4px",
    fontWeight: "bold",
  },
  lowStock: {
    marginTop: "5px",
    alignSelf: "flex-start",
    fontSize: "12px",
    background: "#fff3cd",
    color: "#856404",
    padding: "2px 8px",
    borderRadius: "4px",
    fontWeight: "bold",
  },
  footer: {
    textAlign: "center",
    marginTop: "40px",
    color: "#aaa",
    fontSize: "12px",
  },
};

export default PublicMenu;
