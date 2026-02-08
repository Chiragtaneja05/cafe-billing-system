import { useEffect, useState } from "react";
import Receipt from "../components/Receipt";
import { getOwner, getToken } from "../utils/auth";
import Navbar from "../components/Navbar";
import "../receipt.css"; // Ensure this import is present

function BillingPage() {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [showReceipt, setShowReceipt] = useState(false);
  const [gstPercent, setGstPercent] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const owner = getOwner();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/menu`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then((res) => res.json())
      .then((data) => setMenu(Array.isArray(data) ? data : []))
      .catch((err) => console.error(err));
  }, []);

  const filteredMenu = menu.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const addToCart = (item) => {
    const existing = cart.find((i) => i._id === item._id);
    if (existing) {
      setCart(
        cart.map((i) =>
          i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i,
        ),
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const decreaseQty = (id) => {
    setCart(
      cart
        .map((i) => (i._id === id ? { ...i, quantity: i.quantity - 1 } : i))
        .filter((i) => i.quantity > 0),
    );
  };

  const clearCart = () => {
    if (window.confirm("Clear current bill?")) {
      setCart([]);
      setDiscount(0);
      setGstPercent(0);
      setCustomerName("");
      setCustomerPhone("");
    }
  };

  const subTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const gstAmount = Number(((subTotal * gstPercent) / 100).toFixed(1));
  const finalTotal = Number(
    Math.max(subTotal + gstAmount - discount, 0).toFixed(1),
  );

  const generateBill = async () => {
    if (cart.length === 0) return alert("Cart is empty");

    const billData = {
      customerName,
      customerPhone,
      items: cart.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      paymentMethod: "Cash",
      totalAmount: finalTotal,
    };

    try {
      await fetch(`${process.env.REACT_APP_API_URL}/api/bills`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(billData),
      });

      setShowReceipt(true);
      setTimeout(() => {
        document.body.classList.add("printing");
        window.print();
        setTimeout(() => {
          document.body.classList.remove("printing");
          setCart([]);
          setDiscount(0);
          setGstPercent(0);
          setCustomerName("");
          setCustomerPhone("");
          setShowReceipt(false);
          setSearchTerm("");
        }, 500);
      }, 500);
    } catch (err) {
      console.error(err);
      alert("Error saving bill");
    }
  };

  return (
    <>
      <Navbar />

      {/* ✅ Use the CSS class for layout */}
      <div className="billing-container">
        {/* MENU SECTION */}
        <div className="menu-section">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 15,
            }}
          >
            <h3 style={{ margin: 0 }}>Menu</h3>
            <input
              placeholder="🔍 Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>

          <div className="menu-grid">
            {filteredMenu.map((item) => (
              <div
                key={item._id}
                onClick={() => addToCart(item)}
                style={styles.menuCard}
              >
                <h4 style={{ margin: "0 0 5px 0" }}>{item.name}</h4>
                <p style={{ margin: 0, color: "#27ae60", fontWeight: "bold" }}>
                  ₹{item.price}
                </p>
              </div>
            ))}
            {filteredMenu.length === 0 && (
              <p style={{ color: "#888" }}>No items found.</p>
            )}
          </div>
        </div>

        {/* CART SECTION */}
        <div className="cart-section">
          <h3 style={{ borderBottom: "1px solid #ddd", paddingBottom: 10 }}>
            Current Bill
          </h3>

          <div style={{ display: "flex", gap: 5, marginBottom: 10 }}>
            <input
              placeholder="Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              style={styles.inputField}
            />
            <input
              placeholder="Phone"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              style={styles.inputField}
            />
          </div>

          <div style={{ flex: 1, overflowY: "auto", marginBottom: 15 }}>
            {cart.length === 0 && (
              <p style={{ color: "#888" }}>Cart is empty</p>
            )}
            {cart.map((item) => (
              <div key={item._id} style={styles.cartItem}>
                <div>
                  <div style={{ fontWeight: "bold" }}>{item.name}</div>
                  <div style={{ fontSize: "12px", color: "#666" }}>
                    ₹{item.price} x {item.quantity}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <button
                    onClick={() => decreaseQty(item._id)}
                    style={styles.qtyBtn}
                  >
                    -
                  </button>
                  <button onClick={() => addToCart(item)} style={styles.qtyBtn}>
                    +
                  </button>
                  <span
                    style={{
                      fontWeight: "bold",
                      minWidth: 40,
                      textAlign: "right",
                    }}
                  >
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: "2px solid #333", paddingTop: 10 }}>
            <div style={styles.summaryRow}>
              <label>Subtotal:</label> <span>₹{subTotal}</span>
            </div>
            <div style={styles.summaryRow}>
              <label>GST %:</label>
              <input
                type="number"
                value={gstPercent}
                onChange={(e) => setGstPercent(Number(e.target.value))}
                style={styles.inputSmall}
              />
            </div>
            <div style={styles.summaryRow}>
              <label>Discount:</label>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                style={styles.inputSmall}
              />
            </div>

            <h2 style={{ textAlign: "right", marginTop: 10 }}>₹{finalTotal}</h2>

            <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
              <button onClick={generateBill} style={styles.printBtn}>
                PRINT
              </button>
              <button onClick={clearCart} style={styles.clearBtn}>
                CLEAR
              </button>
            </div>
          </div>
        </div>

        {/* Receipt Component */}
        {showReceipt && (
          <div className="receipt-print-area">
            <Receipt
              owner={owner}
              cart={cart}
              total={finalTotal}
              gst={gstAmount}
              discount={discount}
              customerName={customerName}
              customerPhone={customerPhone}
            />
          </div>
        )}
      </div>
    </>
  );
}

// Minimal inline styles for specific interactive elements
const styles = {
  searchInput: {
    padding: "8px",
    borderRadius: 4,
    border: "1px solid #ccc",
    width: "150px",
  },
  menuCard: {
    background: "white",
    padding: 15,
    borderRadius: 8,
    cursor: "pointer",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    textAlign: "center",
    border: "1px solid #eee",
  },
  inputField: {
    flex: 1,
    padding: 8,
    borderRadius: 4,
    border: "1px solid #ddd",
  },
  cartItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 0",
    borderBottom: "1px solid #f0f0f0",
  },
  qtyBtn: {
    width: 25,
    height: 25,
    borderRadius: "50%",
    border: "1px solid #ddd",
    background: "white",
    cursor: "pointer",
  },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  inputSmall: { width: 60, padding: 4, textAlign: "right" },
  printBtn: {
    flex: 1,
    background: "#27ae60",
    color: "white",
    padding: 12,
    border: "none",
    borderRadius: 6,
    fontWeight: "bold",
    cursor: "pointer",
  },
  clearBtn: {
    flex: 0.5,
    background: "#c0392b",
    color: "white",
    padding: 12,
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
};

export default BillingPage;
