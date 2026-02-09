import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { setAuth } from "../utils/auth"; // ✅ Using your existing auth utility
import "../App.css"; // ✅ Import the new CSS

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // ✅ State for error messages
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        },
      );

      const data = await res.json();

      if (res.ok) {
        setAuth(data.token, data.owner); // ✅ Save token
        navigate("/dashboard");
      } else {
        setError(data.message || "Login failed"); // ✅ Show error in UI
      }
    } catch (err) {
      console.error(err);
      setError("Network connection error. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome Back 👋</h2>
        <p>Login to manage your cafe</p>

        {/* ⚠️ Error Message Box */}
        {error && <div className="error-msg">⚠️ {error}</div>}

        <form onSubmit={handleLogin} className="auth-form">
          <input
            type="email"
            placeholder="Email Address"
            className="auth-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="auth-btn">
            Login
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account?{" "}
          <Link to="/register" className="auth-link">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
