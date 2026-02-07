import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div style={{ padding: 40 }}>
      <h1>Smart Cafe Billing System</h1>
      <p>A modern billing & POS solution for cafes and restaurants.</p>

      <Link to="/login">
        <button style={{ marginRight: 10 }}>Login</button>
      </Link>

      <Link to="/register">
        <button>Register Your Cafe</button>
      </Link>
    </div>
  );
}

export default HomePage;
