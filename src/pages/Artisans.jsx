import { useState } from "react";
import artisans from "../data/artisans";
import ArtisanCard from "../components/ArtisanCard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Artisans() {
  const [search, setSearch] = useState("");
  const [county, setCounty] = useState("All");
  const [rating, setRating] = useState("All");

  const filtered = artisans.filter((artisan) => {
    const matchesSearch =
      artisan.name.toLowerCase().includes(search.toLowerCase()) ||
      artisan.skill.toLowerCase().includes(search.toLowerCase());

    const matchesCounty = county === "All" || artisan.county === county;

    const matchesRating = rating === "All" || artisan.rating >= Number(rating);

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

        <select value={county} onChange={(e) => setCounty(e.target.value)}>
          <option>All</option>
          <option>Nairobi</option>
          <option>Kiambu</option>
          <option>Nakuru</option>
          <option>Mombasa</option>
        </select>

        <select value={rating} onChange={(e) => setRating(e.target.value)}>
          <option>All</option>
          <option value="4">4★ & Above</option>
          <option value="4.5">4.5★ & Above</option>
          <option value="4.8">4.8★ & Above</option>
        </select>

        <div className="artisan-grid">
          {filtered.map((artisan) => (
            <ArtisanCard key={artisan.id} artisan={artisan} />
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Artisans;
