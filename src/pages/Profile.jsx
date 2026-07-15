// src/pages/Profile.jsx
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import GoogleMapComponent from "../components/GoogleMap";
import "../styles/Profile.css";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageHero from "../components/PageHero";

import artisans from "../data/artisans";

function Profile() {
  const { id } = useParams();

  // Find the matching artisan using the string ID
  const artisan = artisans.find((item) => item.id === id);

  if (!artisan) {
    return (
      <>
        <Navbar />
        <PageHero
          title="Artisan Not Found"
          subtitle="The artisan you are looking for does not exist."
        />
        <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
          <Link
            to="/artisans"
            style={{
              color: "#df7a15",
              fontWeight: "600",
              textDecoration: "none",
            }}
          >
            ← Back to Marketplace
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const displayLocation = artisan.location || "Nairobi, Kenya";

  return (
    <>
      <Navbar />

      <PageHero
        title={artisan.name}
        subtitle={`${artisan.specialty} • ${displayLocation}`}
      />

      <section className="profile-container">
        <div className="profile-card">
          <img
            src={artisan.photo}
            alt={artisan.name}
            className="profile-image"
            onError={(e) => {
              // Friendly fallback if local image isn't available yet
              e.target.src =
                "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=300&auto=format&fit=crop";
            }}
          />

          <div className="profile-info">
            <h2>{artisan.name}</h2>

            <p>
              <strong>Profession:</strong> {artisan.specialty}
            </p>
            <p>
              <strong>Location:</strong> {displayLocation}
            </p>
            <p>
              <strong>Rating:</strong> ⭐ {artisan.rating}/5
            </p>
            <p>
              <strong>Status:</strong> ✅ Verified Artisan
            </p>

            <p className="profile-bio-text">{artisan.bio}</p>

            <div className="profile-stats">
              <div>
                <h3>{artisan.experienceYears || "5+"}</h3>
                <span>Years Experience</span>
              </div>
              <div>
                <h3>120+</h3>
                <span>Completed Jobs</span>
              </div>
              <div>
                <h3>98%</h3>
                <span>Positive Reviews</span>
              </div>
            </div>

            <Link to={`/booking/${artisan.id}`} className="btn-primary">
              Book Now
            </Link>
          </div>
        </div>
      </section>

      <section className="reviews-section">
        <h2>Location</h2>
        <p
          style={{ marginBottom: "20px", fontSize: "18px", fontWeight: "500" }}
        >
          📍 {displayLocation}
        </p>
        <GoogleMapComponent location={artisan.location} />
      </section>

      <section className="reviews-section">
        <h2>Customer Reviews</h2>
        <div className="review-card">
          <h4>⭐⭐⭐⭐⭐</h4>
          <p>
            "Very professional, arrived on time and delivered excellent
            workmanship."
          </p>
          <span>- Sarah M.</span>
        </div>
        <div className="review-card">
          <h4>⭐⭐⭐⭐⭐</h4>
          <p>"Highly recommend! Great communication and quality work."</p>
          <span>- Kevin O.</span>
        </div>
        <div className="review-card">
          <h4>⭐⭐⭐⭐☆</h4>
          <p>"Very satisfied with the service. Will hire again."</p>
          <span>- Grace W.</span>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Profile;
