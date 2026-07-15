import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="hero">
      <div className="overlay">
        <div className="hero-content">

          <h1>
            Connecting Skilled Artisans
            <br />
            With Customers
          </h1>

          <p>
            Find trusted carpenters, electricians,
            plumbers, mechanics,
            painters, tailors and welders anywhere in Kenya.
          </p>

          <div className="hero-buttons">

            <Link to="/artisans" className="btn-primary">
              Find an Artisan
            </Link>

            <Link to="/register-customer" className="btn-outline-white">
              Create Account
            </Link>

          </div>

        </div>
      </div>
    </section>
  );
}

export default Hero;