import { useParams } from "react-router-dom";
import { useState } from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageHero from "../components/PageHero";

import artisans from "../data/artisans";

function Booking() {

  const { id } = useParams();

  const artisan = artisans.find(
    (item) => item.id === Number(id)
  );

  const [booking, setBooking] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    date: "",
    description: ""
  });

  const handleChange = (e) => {
    setBooking({
      ...booking,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {

    e.preventDefault();

    const newBooking = {

        id: Date.now(),

        artisanId: artisan.id,

        artisanName: artisan.name,

        artisanSkill: artisan.skill,

        artisanImage: artisan.image,

        customerName: booking.name,

        email: booking.email,

        phone: booking.phone,

        location: booking.location,

        date: booking.date,

        description: booking.description,

        status: "Pending"

    };

    const existingBookings =
        JSON.parse(localStorage.getItem("bookings")) || [];

    existingBookings.push(newBooking);

    localStorage.setItem(
        "bookings",
        JSON.stringify(existingBookings)
    );

    alert("Booking submitted successfully!");

    setBooking({
        name: "",
        email: "",
        phone: "",
        location: "",
        date: "",
        description: ""
    });

};

  return (
    <>
      <Navbar />

      <PageHero
        title="Book an Artisan"
        subtitle="Complete the form below to request a service."
      />

      <section className="booking-container">

        {artisan && (

          <div className="selected-artisan">

            <img
              src={artisan.image}
              alt={artisan.name}
            />

            <div>

              <h2>{artisan.name}</h2>

              <p><strong>Skill:</strong> {artisan.skill}</p>

              <p><strong>County:</strong> {artisan.county}</p>

              <p><strong>Rating:</strong> ⭐ {artisan.rating}</p>

            </div>

          </div>

        )}

        <form
          className="booking-form"
          onSubmit={handleSubmit}
        >

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            onChange={handleChange}
            required
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            onChange={handleChange}
            required
          />

          <input
            type="date"
            name="date"
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            rows="6"
            placeholder="Describe the work you need done..."
            onChange={handleChange}
            required
          />

          <button
            className="btn-primary"
            type="submit"
          >
            Confirm Booking
          </button>

        </form>

      </section>

      <Footer />
    </>
  );
}

export default Booking;