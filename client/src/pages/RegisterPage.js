import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css"; // ✅ Import the new CSS

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    cafeName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );

      const data = await res.json();

      if (res.ok) {
        // Optional: You can auto-login here, but redirecting to login is safer
        alert("Registration Successful! Please Login.");
        navigate("/login");
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      setError("Network connection error. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account 🚀</h2>
        <p>Start managing your cafe today</p>

        {/* ⚠️ Error Message Box */}
        {error && <div className="error-msg">⚠️ {error}</div>}

        <form onSubmit={handleRegister} className="auth-form">
          <input
            name="name"
            placeholder="Owner Name"
            className="auth-input"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            name="cafeName"
            placeholder="Cafe Name"
            className="auth-input"
            value={formData.cafeName}
            onChange={handleChange}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email Address"
            className="auth-input"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="auth-input"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit" className="auth-btn">
            Register
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{" "}
          <Link to="/login" className="auth-link">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
