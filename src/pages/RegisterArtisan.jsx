// src/pages/RegisterArtisan.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/authForm.css";

function RegisterArtisan() {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    specialty: "",
    location: "",
    experience: "",
    bio: "",
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

    if (!formData.fullName || !formData.specialty || !formData.location || !formData.experience) {
      setError("Please fill out all mandatory artisan details.");
      return;
    }
    if (!formData.agreeTerms) {
      setError("You must agree to the Terms.");
      return;
    }

    console.log("Artisan applied successfully!", formData);
    navigate("/");
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card broad">
        <div className="auth-header">
          <h2>Grow Your Business with Us</h2>
          <p>Showcase your skills and connect with paying clients throughout Kenya.</p>
        </div>

        {error && <div className="auth-error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="e.g. Mary Atieno"
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
                placeholder="e.g. 0722000000"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="specialty">Your Specialty (Trade)</label>
              <select
                id="specialty"
                name="specialty"
                value={formData.specialty}
                onChange={handleChange}
                required
              >
                <option value="">Select specialty...</option>
                <option value="Welding">Welder & Metal Fabricator</option>
                <option value="Carpentry">Carpenter & Furniture Maker</option>
                <option value="Plumbing">Plumber & Pipe Fitter</option>
                <option value="Masonry">Mason & Bricklayer</option>
                <option value="Electrical">Electrician</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="experience">Years of Experience</label>
              <input
                type="number"
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="e.g. 5"
                min="0"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="location">Workshop Location / Area</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Ngong Road Artisan Sheds, Nairobi"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="bio">Tell clients about your work (Bio)</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Describe your primary services, special skills, or custom order availability..."
              rows="3"
            />
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
              I agree to the Jua Kali Connect code of conduct
            </label>
          </div>

          <button type="submit" className="auth-primary-btn">
            Submit Artisan Application
          </button>
        </form>

        <div className="auth-footer">
          <p>Already registered? <Link to="/login">Log In</Link></p>
        </div>
      </div>
    </div>
  );
}

export default RegisterArtisan;