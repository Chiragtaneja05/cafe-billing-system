import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { getOwner, getToken } from "../utils/auth";

function Settings() {
  const [formData, setFormData] = useState({
    cafeName: "",
    address: "",
    phone: "",
    gstNo: "", // ✅ New Field
    currency: "₹", // ✅ New Field
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const owner = getOwner();
    if (owner) {
      setFormData({
        cafeName: owner.cafeName || "",
        address: owner.address || "",
        phone: owner.phone || "",
        gstNo: owner.gstNo || "",
        currency: owner.currency || "₹",
      });
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/auth/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify(formData),
        },
      );

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Profile updated successfully!");
        const currentOwner = getOwner();
        const updatedOwner = { ...currentOwner, ...data.owner };
        localStorage.setItem("owner", JSON.stringify(updatedOwner));
      } else {
        setMessage(`❌ Error: ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Error updating profile");
    }
  };

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <div style={styles.card}>
          <h2 style={styles.title}>⚙️ Store Settings</h2>
          <p style={styles.subtitle}>
            Manage your cafe's identity. These details will appear on your
            digital menu and printed receipts.
          </p>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Cafe Name</label>
              <input
                name="cafeName"
                value={formData.cafeName}
                onChange={handleChange}
                style={styles.input}
                placeholder="e.g. Tajinder Cafe"
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Currency Symbol</label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                style={styles.input}
              >
                <option value="₹">INR (₹)</option>
                <option value="$">USD ($)</option>
                <option value="£">GBP (£)</option>
                <option value="€">EUR (€)</option>
              </select>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>GST Number (Optional)</label>
              <input
                name="gstNo"
                value={formData.gstNo}
                onChange={handleChange}
                style={styles.input}
                placeholder="e.g. 07AAAAA0000A1Z5"
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Address</label>
              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                style={styles.input}
                placeholder="e.g. Shop 12, Main Market"
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Phone Number</label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                style={styles.input}
                placeholder="e.g. +91 98765 43210"
              />
            </div>

            <button type="submit" style={styles.saveBtn}>
              Save Store Profile
            </button>
          </form>

          {message && (
            <div
              style={{
                ...styles.message,
                color: message.includes("✅") ? "#27ae60" : "#c0392b",
                border: `1px solid ${message.includes("✅") ? "#27ae60" : "#c0392b"}`,
              }}
            >
              {message}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

const styles = {
  card: {
    background: "white",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
    maxWidth: "550px",
    margin: "40px auto",
  },
  title: {
    margin: "0 0 10px 0",
    fontSize: "24px",
    color: "#333",
  },
  subtitle: {
    color: "#666",
    fontSize: "14px",
    lineHeight: "1.5",
    marginBottom: "30px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontWeight: "600",
    fontSize: "13px",
    color: "#555",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "16px",
    outline: "none",
    transition: "border-color 0.2s",
  },
  saveBtn: {
    padding: "14px",
    background: "#6a1b9a",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "10px",
    boxShadow: "0 4px 12px rgba(106, 27, 154, 0.2)",
  },
  message: {
    marginTop: "20px",
    textAlign: "center",
    fontWeight: "600",
    padding: "12px",
    borderRadius: "8px",
    fontSize: "14px",
  },
};

export default Settings;
