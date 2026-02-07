function Receipt({ owner, cart, total, gst, discount }) {
  const date = new Date();

  // calculate subtotal again for clarity
  const subTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <div className="receipt">
      <h2>{owner?.cafeName}</h2>
      <p>Owner: {owner?.name}</p>
      <p>{date.toLocaleString()}</p>

      <hr />

      {cart.map((item, index) => (
        <div key={index} className="row">
          <span>
            {item.name} x {item.quantity}
          </span>
          <span>₹{item.price * item.quantity}</span>
        </div>
      ))}

      <hr />

      <div className="row">
        <span>Subtotal</span>
        <span>₹{subTotal}</span>
      </div>

      {gst > 0 && (
        <div className="row">
          <span>GST</span>
          <span>₹{gst.toFixed(2)}</span>
        </div>
      )}

      {discount > 0 && (
        <div className="row">
          <span>Discount</span>
          <span>-₹{discount}</span>
        </div>
      )}

      <hr />

      <div className="row">
        <strong>Total</strong>
        <strong>₹{total}</strong>
      </div>

      <p style={{ marginTop: 10, textAlign: "center" }}>Thank you! ☕</p>
    </div>
  );
}

export default Receipt;
