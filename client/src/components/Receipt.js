function Receipt({
  owner,
  cart,
  total,
  gst,
  discount,
  customerName,
  customerPhone,
}) {
  const date = new Date();

  // calculate subtotal safely
  const subTotal = Number(
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(1),
  );

  return (
    <div className="receipt">
      {/* 🏪 CAFE DETAILS (From Settings) */}
      <h2 style={{ margin: "0 0 5px 0" }}>
        {owner?.cafeName || "Tajinder Cafe"}
      </h2>

      {/* ✅ Show Address if saved in Settings */}
      {owner?.address && (
        <p style={{ fontSize: "12px", margin: "2px 0" }}>{owner.address}</p>
      )}

      {/* ✅ Show Cafe Phone if saved in Settings */}
      {owner?.phone && (
        <p style={{ fontSize: "12px", margin: "2px 0" }}>Ph: {owner.phone}</p>
      )}

      <hr />

      {/* 📅 DATE & CUSTOMER INFO */}
      <div style={{ textAlign: "left", fontSize: "12px", marginBottom: "5px" }}>
        <p>
          Date: {date.toLocaleDateString()} {date.toLocaleTimeString()}
        </p>

        {/* ✅ Customer Details Section */}
        {(customerName || customerPhone) && (
          <div
            style={{
              marginTop: "5px",
              borderTop: "1px dashed #ccc",
              paddingTop: "5px",
            }}
          >
            {customerName && (
              <div>
                Customer: <strong>{customerName}</strong>
              </div>
            )}
            {customerPhone && (
              <div>
                Phone: <strong>{customerPhone}</strong>
              </div>
            )}
          </div>
        )}
      </div>

      <hr />

      {/* 🛒 ITEMS LIST */}
      {cart.map((item, index) => (
        <div key={index} className="row">
          <span>
            {item.name} × {item.quantity}
          </span>
          <span>₹{(item.price * item.quantity).toFixed(1)}</span>
        </div>
      ))}

      <hr />

      {/* 💰 CALCULATIONS */}
      <div className="row">
        <span>Subtotal</span>
        <span>₹{subTotal.toFixed(1)}</span>
      </div>

      {gst > 0 && (
        <div className="row">
          <span>GST</span>
          <span>+₹{gst.toFixed(1)}</span>
        </div>
      )}

      {discount > 0 && (
        <div className="row">
          <span>Discount</span>
          <span>-₹{discount.toFixed(1)}</span>
        </div>
      )}

      <hr />

      <div className="row">
        <strong>Total</strong>
        <strong>₹{total.toFixed(1)}</strong>
      </div>

      <p style={{ marginTop: 10, textAlign: "center" }}>Thank you! ☕</p>
    </div>
  );
}

export default Receipt;
