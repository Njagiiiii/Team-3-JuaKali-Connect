import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageHero from "../components/PageHero";
import Section from "../components/Section";
import GoogleMapComponent from "../components/GoogleMap";

function Contact() {
  return (
    <>
      <Navbar />

      <PageHero
        title="Contact Us"
        subtitle="We're here to help. Reach out to us anytime."
      />

      <Section>

        <div className="page-card">

          <h2>Get in Touch</h2>

          <p><strong>📍 Address:</strong> Nairobi, Kenya</p>
          <p><strong>📞 Phone:</strong> +254 700 000 000</p>
          <p><strong>📧 Email:</strong> info@juakaliconnect.co.ke</p>
          <p><strong>🕒 Working Hours:</strong> Monday - Friday, 8:00 AM - 5:00 PM</p>

        </div>

        <div className="page-card">

          <h2>Send Us a Message</h2>

          <form className="contact-form">

            <input type="text" placeholder="Full Name" required />

            <input type="email" placeholder="Email Address" required />

            <textarea
              rows="6"
              placeholder="Your Message"
              required
            ></textarea>

            <button className="btn-primary">
              Send Message
            </button>

          </form>

        </div>

      </Section>
      <section className="container">

    <h2>Find Us</h2>

    <GoogleMapComponent
        location={{
            lat: -1.286389,
            lng: 36.817223
        }}
    />

</section>



      <Footer />

    </>
  );
}

export default Contact;