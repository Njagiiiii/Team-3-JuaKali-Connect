// src/pages/RegisterCustomer.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/authForm.css";

function RegisterCustomer() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Simple Validations
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.password
    ) {
      setError("Please fill in all fields.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!formData.agreeTerms) {
      setError("You must agree to the Terms & Conditions.");
      return;
    }

    // Success Mock-up
    console.log("Customer Registered successfully!", formData);
    // Navigate to homepage or dashboard after account creation
    navigate("/");
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Create Customer Account</h2>
          <p>Find trusted local Jua Kali artisans in seconds.</p>
        </div>

        {error && <div className="auth-error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="e.g. Caleb Mutua"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@domain.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g. 0712345678"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div className="form-checkbox-group">
            <input
              type="checkbox"
              id="agreeTerms"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
            />
            <label htmlFor="agreeTerms">
              I agree to the <Link to="/terms">Terms & Conditions</Link>
            </label>
          </div>

          <button type="submit" className="auth-primary-btn">
            Create Account
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account? <Link to="/login">Log In</Link>
          </p>
          <p className="alternative-option">
            Are you an artisan?{" "}
            <Link to="/register-artisan">Join as Artisan</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterCustomer;
