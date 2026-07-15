import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageHero from "../components/PageHero";

function Dashboard() {

    const bookings = allBookings.filter(

    booking =>

    booking.email === user.email

);

    return (

        <>

            <Navbar />

            <PageHero
                title="Customer Dashboard"
                subtitle="Your booking history"
            />

            <section className="dashboard-container">

                {bookings.length === 0 ? (

                    <h2>No bookings yet.</h2>

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

                                <h2>{booking.artisanName}</h2>

                                <p>{booking.artisanSkill}</p>

                                <p>{booking.location}</p>

                                <p>{booking.date}</p>

                                <p>

                                    <strong>Status:</strong>

                                    {booking.status}

                                </p>

                            </div>

                        </div>

                    ))

                )}

            </section>

            <Footer />

        </>

    );

}

export default Dashboard;