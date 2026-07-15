import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageHero from "../components/PageHero";

function Admin() {

    const bookings =
        JSON.parse(localStorage.getItem("bookings")) || [];

    return (

        <>

            <Navbar />

            <PageHero
                title="Artisan Dashboard"
                subtitle="Incoming booking requests"
            />

            <section className="dashboard-container">

                {bookings.length === 0 ? (

                    <h2>No booking requests.</h2>

                ) : (

                    bookings.map((booking) => (

                        <div
                            className="booking-card"
                            key={booking.id}
                        >

                            <img
                                src={booking.artisanImage}
                                alt={booking.artisanName}
                            />

                            <div>

                                <h2>{booking.customerName}</h2>

                                <p>

                                    Booking for

                                    {" "}

                                    {booking.artisanName}

                                </p>

                                <p>{booking.phone}</p>

                                <p>{booking.location}</p>

                                <p>{booking.date}</p>

                                <p>{booking.description}</p>

                            </div>

                        </div>

                    ))

                )}

            </section>

            <Footer />

        </>

    );

}

export default Admin;