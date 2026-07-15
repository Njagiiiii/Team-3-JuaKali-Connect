import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageHero from "../components/PageHero";
import Section from "../components/Section";

function Pricing() {
  return (
    <>
      <Navbar />

      <PageHero
        title="Pricing Plans"
        subtitle="Affordable plans for both customers and artisans."
      />

      <Section>

        <div className="pricing-grid">

          <div className="page-card">
            <h2>Customer</h2>
            <h3>FREE</h3>

            <p>✔ Find artisans</p>
            <p>✔ Book services</p>
            <p>✔ Leave reviews</p>

            <button className="btn-primary">
              Get Started
            </button>
          </div>

          <div className="page-card">

            <h2>Artisan Basic</h2>

            <h3>KSh 500/month</h3>

            <p>✔ Create profile</p>
            <p>✔ Receive bookings</p>
            <p>✔ Customer ratings</p>

            <button className="btn-primary">
              Choose Plan
            </button>

          </div>

          <div className="page-card">

            <h2>Premium</h2>

            <h3>KSh 1000/month</h3>

            <p>✔ Featured listing</p>
            <p>✔ Priority support</p>
            <p>✔ Business analytics</p>

            <button className="btn-primary">
              Upgrade
            </button>

          </div>

        </div>

      </Section>

      <Footer />

    </>
  );
}

export default Pricing;

