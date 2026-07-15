import { useParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ArtisanCard from "../components/ArtisanCard";

import artisans from "../data/artisans";

function Categories() {

  const { category } = useParams();

  const filteredArtisans = artisans.filter((artisan) => {

    if (!artisan.skill || !category) return false;

    return artisan.skill.toLowerCase() === category.toLowerCase();

  });

  return (

    <>

      <Navbar />

      <section className="container">

        <h1 style={{ marginTop: "40px", marginBottom: "30px" }}>

          {category
            ? `${category.charAt(0).toUpperCase()}${category.slice(1)}`
            : "Artisans"}

        </h1>

        {filteredArtisans.length > 0 ? (

          <div className="artisan-grid">

            {filteredArtisans.map((artisan) => (

              <ArtisanCard

                key={artisan.id}

                artisan={artisan}

              />

            ))}

          </div>

        ) : (

          <div className="page-card">

            <h2>No artisans found.</h2>

            <p>

              There are currently no artisans in this category.

            </p>

          </div>

        )}

      </section>

      <Footer />

    </>

  );

}

export default Categories;