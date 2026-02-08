import { useEffect, useState } from "react";
import { getToken, getOwner } from "../utils/auth";
import Navbar from "../components/Navbar";
import Receipt from "../components/Receipt"; // ✅ Import Receipt
import "../receipt.css"; // ✅ Import Print Styles

function BillsPage() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBill, setSelectedBill] = useState(null); // ✅ Track bill to print
  const [showReceipt, setShowReceipt] = useState(false); // ✅ Toggle print view

  const owner = getOwner();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/bills`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setBills(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching bills:", err);
        setLoading(false);
      });
  }, []);

  // ✅ Handle Reprint Logic
  const handleReprint = (bill) => {
    setSelectedBill(bill);
    setShowReceipt(true);

    setTimeout(() => {
      document.body.classList.add("printing");
      window.print();

      // Cleanup after print
      setTimeout(() => {
        document.body.classList.remove("printing");
        setShowReceipt(false);
        setSelectedBill(null);
      }, 500);
    }, 500);
  };

  return (
    <>
      <Navbar />

      <div style={styles.container}>
        <h2>Transaction History</h2>

        {loading ? (
          <p>Loading transactions...</p>
        ) : bills.length === 0 ? (
          <p>No transactions found.</p>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Items</th>
                  <th style={styles.th}>Payment</th>
                  <th style={styles.th}>Total (₹)</th>
                  <th style={styles.th}>Action</th> {/* ✅ New Column */}
                </tr>
              </thead>
              <tbody>
                {bills.map((bill) => (
                  <tr key={bill._id}>
                    <td style={styles.td}>
                      {new Date(bill.createdAt).toLocaleDateString()}{" "}
                      {new Date(bill.createdAt).toLocaleTimeString()}
                    </td>
                    <td style={styles.td}>
                      {bill.items.map((item, index) => (
                        <span key={index}>
                          {item.quantity}x {item.name}
                          {index < bill.items.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </td>
                    <td style={styles.td}>{bill.paymentMethod}</td>
                    <td style={{ ...styles.td, fontWeight: "bold" }}>
                      ₹{bill.totalAmount}
                    </td>
                    <td style={styles.td}>
                      {/* ✅ Print Button */}
                      <button
                        onClick={() => handleReprint(bill)}
                        style={styles.printBtn}
                      >
                        🖨 Print
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ✅ Hidden Receipt Component (Only visible when printing) */}
        {showReceipt && selectedBill && (
          <div className="receipt-print-area">
            <Receipt
              owner={owner}
              cart={selectedBill.items}
              total={selectedBill.totalAmount}
              // Note: If you didn't save GST/Discount to DB, these default to 0
              gst={0}
              discount={0}
              subTotal={selectedBill.totalAmount}
            />
          </div>
        )}
      </div>
    </>
  );
}

const styles = {
  container: {
    padding: 40,
    maxWidth: "1000px",
    margin: "0 auto",
  },
  tableWrapper: {
    overflowX: "auto",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    borderRadius: 8,
    border: "1px solid #ddd",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "white",
  },
  th: {
    background: "#2c3e50",
    color: "white",
    padding: "12px 15px",
    textAlign: "left",
  },
  td: {
    padding: "12px 15px",
    borderBottom: "1px solid #eee",
    color: "#333",
  },
  printBtn: {
    background: "#3498db",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
  },
};

export default BillsPage;
