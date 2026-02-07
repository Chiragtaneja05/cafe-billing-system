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

  const gstAmount = (subTotal * gstPercent) / 100;
  const finalTotal = Math.max(subTotal + gstAmount - discount, 0);

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

      // cleanup AFTER print dialog opens
      setTimeout(() => {
        document.body.classList.remove("printing");
        setCart([]);
        setDiscount(0);
        setGstPercent(0);
        setShowReceipt(false);
      }, 500);
    }, 1200);
  };

  return (
    <>
      <Navbar />

      <div style={styles.container}>
        <h2>Billing</h2>

        {/* MENU */}
        <div style={styles.card}>
          <h3>Menu</h3>
          {menu.map((item) => (
            <button
              key={item._id}
              onClick={() => addToCart(item)}
              style={styles.menuBtn}
            >
              {item.name} – ₹{item.price}
            </button>
          ))}
        </div>

        {/* BILL */}
        <div style={styles.card}>
          <h3>Current Bill</h3>

          {cart.length === 0 && <p>No items added.</p>}

          {cart.map((item) => (
            <div key={item._id} style={styles.billRow}>
              <span>
                {item.name} × {item.quantity}
              </span>

              <div>
                <button onClick={() => decreaseQty(item._id)}>➖</button>
                <button onClick={() => addToCart(item)}>➕</button>
              </div>

              <strong>₹{item.price * item.quantity}</strong>
            </div>
          ))}

          <hr />

          <p>Subtotal: ₹{subTotal}</p>

          {/* GST INPUT */}
          <label>GST (%)</label>
          <input
            type="number"
            value={gstPercent}
            onChange={(e) => setGstPercent(Number(e.target.value))}
            placeholder="Enter GST percentage"
            style={{ marginTop: 5 }}
          />

          {gstPercent > 0 && <p>GST Amount: ₹{gstAmount.toFixed(2)}</p>}

          {/* DISCOUNT INPUT */}
          <label style={{ marginTop: 10 }}>Discount (₹)</label>
          <input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value))}
            placeholder="Enter discount amount"
            style={{ marginTop: 5 }}
          />

          <h2>Final Total: ₹{finalTotal}</h2>

          <div style={styles.actions}>
            <button onClick={generateBill}>Print Bill</button>
            <button onClick={clearCart}>Clear</button>
          </div>
        </div>

        <div style={{ display: showReceipt ? "block" : "none" }}>
          <Receipt
            owner={owner}
            cart={cart}
            total={finalTotal}
            gst={gstAmount}
            discount={discount}
          />
        </div>
      </div>
    </>
  );
}

const styles = {
  container: {
    padding: 30,
  },
  card: {
    background: "#f5f5f5",
    padding: 20,
    borderRadius: 6,
    marginBottom: 20,
  },
  menuBtn: {
    margin: 6,
    padding: "10px 14px",
    fontSize: 16,
  },
  billRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  actions: {
    display: "flex",
    gap: 10,
    marginTop: 10,
  },
};

export default BillingPage;
