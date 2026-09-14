import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import GoogleMapComponent from "../components/GoogleMap";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageHero from "../components/PageHero";

import artisans from "../data/artisans";

function Profile() {

    const { id } = useParams();

    const artisan = artisans.find(
        item => item.id === Number(id)
    );

    if (!artisan) {
        return (
            <>
                <Navbar />

                <PageHero
                    title="Artisan Not Found"
                    subtitle="The artisan you are looking for does not exist."
                />

                <Footer />
            </>
        );
    }

    return (

        <>

            <Navbar />

            <PageHero
                title={artisan.name}
                subtitle={`${artisan.skill} • ${artisan.county}`}
            />

            <section className="profile-container">

                <div className="profile-card">

                    <img
                        src={artisan.image}
                        alt={artisan.name}
                        className="profile-image"
                    />

                    <div className="profile-info">

                        <h2>{artisan.name}</h2>

                        <p><strong>Profession:</strong> {artisan.skill}</p>

                        <p><strong>County:</strong> {artisan.county}</p>

                        <p><strong>Rating:</strong> ⭐ {artisan.rating}/5</p>

                        <p><strong>Status:</strong> ✅ Verified Artisan</p>

                        <p>
                            {artisan.description}
                        </p>

                        <div className="profile-stats">

                            <div>
                                <h3>8+</h3>
                                <span>Years Experience</span>
                            </div>

                            <div>
                                <h3>320+</h3>
                                <span>Completed Jobs</span>
                            </div>

                            <div>
                                <h3>98%</h3>
                                <span>Positive Reviews</span>
                            </div>

                        </div>

                        <Link
                            to={`/booking/${artisan.id}`}
                            className="btn-primary"
                        >
                            Book Now
                        </Link>

                    </div>

                </div>

            </section>
            <section className="reviews-section">

    <h2>Location</h2>

    <p
        style={{
            marginBottom: "20px",
            fontSize: "18px",
            fontWeight: "500"
        }}
    >
        📍 {artisan.county}
    </p>

    <GoogleMapComponent
        location={artisan.location}
    />

</section>

            <section className="reviews-section">

                <h2>Customer Reviews</h2>

                <div className="review-card">

                    <h4>⭐⭐⭐⭐⭐</h4>

                    <p>
                        "Very professional, arrived on time and delivered
                        excellent workmanship."
                    </p>

                    <span>- Sarah M.</span>

                </div>

                <div className="review-card">

                    <h4>⭐⭐⭐⭐⭐</h4>

                    <p>
                        "Highly recommend! Great communication and quality work."
                    </p>

                    <span>- Kevin O.</span>

                </div>

                <div className="review-card">

                    <h4>⭐⭐⭐⭐☆</h4>

                    <p>
                        "Very satisfied with the service. Will hire again."
                    </p>

                    <span>- Grace W.</span>

                </div>

            </section>

            <Footer />

        </>

    );

}

export default Profile;