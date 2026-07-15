import { useState } from "react";

function BookingForm({ artisan }) {
  const [formData, setFormData] = useState({
    customer: "",
    phone: "",
    location: "",
    date: "",
    description: "",
  });

  const [submitted, setSubmitted] = useState(false);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    console.log(formData);

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="booking-success">
        <h2>Booking Successful ✅</h2>

        <p>
          Your booking request has been sent to
          <strong> {artisan.name}</strong>.
        </p>
      </div>
    );
  }

  return (
    <form className="booking-form" onSubmit={handleSubmit}>

      <h2>Book {artisan.name}</h2>

      <input
        type="text"
        name="customer"
        placeholder="Your Name"
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
        placeholder="Describe the job..."
        rows="5"
        onChange={handleChange}
      ></textarea>

      <button type="submit" className="btn-primary">
        Confirm Booking
      </button>

    </form>
  );
}

export default BookingForm;