import { useEffect, useState } from "react";

import ArtisanCard from "../components/ArtisanCard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Artisans() {
  const [artisans, setArtisans] = useState([]);
  const [search, setSearch] = useState("");
  const [county, setCounty] = useState("All");
  const [rating, setRating] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/artisans")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch artisans");
        }

        return response.json();
      })
      .then((data) => {
        setArtisans(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to load artisans from the database");
        setLoading(false);
      });
  }, []);

  const filtered = artisans.filter((artisan) => {
    const artisanName = (
      artisan.full_name || artisan.name || ""
    ).toLowerCase();

    const artisanSpecialty = (
      artisan.specialty || artisan.skill || ""
    ).toLowerCase();

    const matchesSearch =
      artisanName.includes(search.toLowerCase()) ||
      artisanSpecialty.includes(search.toLowerCase());

    const matchesCounty =
      county === "All" || artisan.location === county;

    const artisanRating = Number(artisan.rating || 0);

    const matchesRating =
      rating === "All" || artisanRating >= Number(rating);

    return matchesSearch && matchesCounty && matchesRating;
  });

  return (
    <>
      <Navbar />

      <section className="container">
        <h1>Find Skilled Artisans</h1>

        <input
          type="text"
          placeholder="Search artisan..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={county}
          onChange={(e) => setCounty(e.target.value)}
        >
          <option>All</option>
          <option>Nairobi</option>
          <option>Kiambu</option>
          <option>Nakuru</option>
          <option>Mombasa</option>
        </select>

        <select
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        >
          <option>All</option>
          <option value="4">4★ & Above</option>
          <option value="4.5">4.5★ & Above</option>
          <option value="4.8">4.8★ & Above</option>
        </select>

        {loading && <p>Loading artisans...</p>}

        {error && <p>{error}</p>}

        {!loading && !error && (
          <div className="artisan-grid">
            {filtered.map((artisan) => (
              <ArtisanCard
                key={artisan.id}
                artisan={artisan}
              />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </>
  );
}

export default Artisans;
