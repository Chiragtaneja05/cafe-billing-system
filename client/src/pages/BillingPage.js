import { useEffect, useState } from "react";
import Receipt from "../components/Receipt";
import { getOwner, getToken } from "../utils/auth";
import Navbar from "../components/Navbar";
import "../receipt.css";

function BillingPage() {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [showReceipt, setShowReceipt] = useState(false);
  const [gstPercent, setGstPercent] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [searchTerm, setSearchTerm] = useState(""); // ✅ Added Search State

  const owner = getOwner();

  // fetch menu (protected)
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/menu`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setMenu(Array.isArray(data) ? data : []))
      .catch((err) => console.error(err));
  }, []);

  // ✅ Filter Logic
  const filteredMenu = menu.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // add item
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

  // decrease item
  const decreaseQty = (id) => {
    setCart(
      cart
        .map((i) => (i._id === id ? { ...i, quantity: i.quantity - 1 } : i))
        .filter((i) => i.quantity > 0),
    );
  };

  // clear cart
  const clearCart = () => {
    if (window.confirm("Clear current bill?")) {
      setCart([]);
      setDiscount(0);
      setGstPercent(0);
    }
  };

  // calculations
  const subTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const gstAmount = Number(((subTotal * gstPercent) / 100).toFixed(1));
  const finalTotal = Number(
    Math.max(subTotal + gstAmount - discount, 0).toFixed(1),
  );

  // generate bill + print
  const generateBill = async () => {
    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    const billData = {
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

      // ✅ Printing Logic Restored (Exact Original)
      setShowReceipt(true);

      setTimeout(() => {
        document.body.classList.add("printing");
        window.print();

        // cleanup AFTER print dialog closes
        setTimeout(() => {
          document.body.classList.remove("printing");
          setCart([]);
          setDiscount(0);
          setGstPercent(0);
          setShowReceipt(false);
          setSearchTerm(""); // Reset search
        }, 500);
      }, 500); // Small delay to render Receipt component
    } catch (err) {
      console.error(err);
      alert("Error saving bill");
    }
  };

  return (
    <>
      <Navbar />

      <div style={styles.container}>
        <h2>Billing</h2>

        {/* MENU SECTION */}
        <div style={styles.card}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <h3>Menu</h3>
            {/* ✅ Search Input */}
            <input
              placeholder="🔍 Search item..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
              autoFocus
            />
          </div>

          <div style={styles.menuGrid}>
            {filteredMenu.map((item) => (
              <button
                key={item._id}
                onClick={() => addToCart(item)}
                style={styles.menuBtn}
              >
                {item.name} – ₹{item.price}
              </button>
            ))}
            {filteredMenu.length === 0 && <p>No items found.</p>}
          </div>
        </div>

        {/* BILL SECTION */}
        <div style={styles.card}>
          <h3>Current Bill</h3>

          {cart.length === 0 && <p>No items added.</p>}

          {cart.map((item) => (
            <div key={item._id} style={styles.billRow}>
              <span>
                {item.name} × {item.quantity}
              </span>

              <div>
                <button
                  onClick={() => decreaseQty(item._id)}
                  style={styles.qtyBtn}
                >
                  ➖
                </button>
                <button onClick={() => addToCart(item)} style={styles.qtyBtn}>
                  ➕
                </button>
              </div>

              <strong>₹{item.price * item.quantity}</strong>
            </div>
          ))}

          <hr style={{ margin: "15px 0" }} />

          <p>Subtotal: ₹{subTotal}</p>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <div>
              <label>GST (%)</label>
              <input
                type="number"
                value={gstPercent}
                onChange={(e) => setGstPercent(Number(e.target.value))}
                placeholder="0"
                style={styles.inputSmall}
              />
            </div>

            <div>
              <label>Discount (₹)</label>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                placeholder="0"
                style={styles.inputSmall}
              />
            </div>
          </div>

          {gstPercent > 0 && <p>GST Amount: ₹{gstAmount.toFixed(2)}</p>}

          <h2 style={{ marginTop: 15 }}>Final Total: ₹{finalTotal}</h2>

          <div style={styles.actions}>
            <button onClick={generateBill} style={styles.printBtn}>
              ✅ Print Bill
            </button>
            <button onClick={clearCart} style={styles.clearBtn}>
              ❌ Clear
            </button>
          </div>
        </div>

        {/* ✅ Receipt Component (Hidden unless printing) */}
        {showReceipt && (
          <div className="receipt-print-area">
            <Receipt
              owner={owner}
              cart={cart}
              total={finalTotal}
              gst={gstAmount}
              discount={discount}
              subTotal={subTotal}
            />
          </div>
        )}
      </div>
    </>
  );
}

const styles = {
  container: {
    padding: 30,
    maxWidth: "1000px",
    margin: "0 auto",
  },
  card: {
    background: "#fff",
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },
  menuGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
  },
  menuBtn: {
    padding: "12px 16px",
    fontSize: 16,
    border: "1px solid #ddd",
    background: "#f8f9fa",
    cursor: "pointer",
    borderRadius: 6,
    transition: "background 0.2s",
  },
  searchInput: {
    padding: "8px 12px",
    fontSize: "16px",
    width: "200px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  billRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingBottom: 5,
    borderBottom: "1px solid #eee",
  },
  qtyBtn: {
    padding: "4px 8px",
    margin: "0 5px",
    cursor: "pointer",
  },
  inputSmall: {
    display: "block",
    marginTop: 5,
    padding: "8px",
    width: "100px",
    borderRadius: 4,
    border: "1px solid #ddd",
  },
  actions: {
    display: "flex",
    gap: 15,
    marginTop: 20,
  },
  printBtn: {
    padding: "12px 24px",
    background: "#27ae60",
    color: "white",
    border: "none",
    borderRadius: 6,
    fontSize: "16px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  clearBtn: {
    padding: "12px 24px",
    background: "#c0392b",
    color: "white",
    border: "none",
    borderRadius: 6,
    fontSize: "16px",
    cursor: "pointer",
  },
};

export default BillingPage;
