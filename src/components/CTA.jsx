import { Link } from "react-router-dom";

function CTA() {
  return (
    <section className="cta">

      <h2>Ready to hire a trusted artisan?</h2>

      <p>
        Join thousands of customers using
        Jua Kali Connect every day.
      </p>

      <Link to="/register-customer" className="btn-light">
        Get Started
      </Link>

    </section>
  );
}

export default CTA;