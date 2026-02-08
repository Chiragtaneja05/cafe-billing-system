function Receipt({
  owner,
  cart,
  total,
  gst,
  discount,
  customerName, // ✅ Received from parent
  customerPhone, // ✅ Received from parent
}) {
  const date = new Date();

  // calculate subtotal safely
  const subTotal = Number(
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(1),
  );

  return (
    <div className="receipt">
      <h2>{owner?.cafeName}</h2>
      <p>Owner: {owner?.name}</p>
      <p>{date.toLocaleString()}</p>

      {/* ✅ NEW: Customer Details Section */}
      {(customerName || customerPhone) && (
        <div style={{ margin: "10px 0", textAlign: "left" }}>
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

      <hr />

      {cart.map((item, index) => (
        <div key={index} className="row">
          <span>
            {item.name} × {item.quantity}
          </span>
          <span>₹{(item.price * item.quantity).toFixed(1)}</span>
        </div>
      ))}

      <hr />

      <div className="row">
        <span>Subtotal</span>
        <span>₹{subTotal.toFixed(1)}</span>
      </div>

      {gst > 0 && (
        <div className="row">
          <span>GST</span>
          <span>₹{gst.toFixed(1)}</span>
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
