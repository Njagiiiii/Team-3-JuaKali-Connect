import { Link } from "react-router-dom";

function ArtisanCard({ artisan }) {
  return (
    <div className="artisan-card">
      <img src={artisan.image} alt={artisan.name} />

      <h2>{artisan.name}</h2>

      <h4>{artisan.skill}</h4>

      <p>{artisan.county}</p>

      <p>⭐ {artisan.rating}</p>

      <Link to={`/profile/${artisan.id}`} className="btn-primary">
        View Profile
      </Link>

      <Link to={`/booking/${artisan.id}`} className="btn-primary">
        Book Now
      </Link>
    </div>
  );
}

export default ArtisanCard;
