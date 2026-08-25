import { Link } from "react-router-dom";
function Footer() {
  return (
    <footer>
      <div className="footer-content">
        <div>
          <h3>Jua Kali Connect</h3>

          <p>Connecting skilled artisans with customers throughout Kenya.</p>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>

          <Link to="/">Home</Link>
          <Link to="/artisans">Find Artisans</Link>
          <Link to="/training">Training</Link>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <div>
          <h4>Contact</h4>

          <p>Nairobi, Kenya</p>
          <p>info@juakaliconnect.co.ke</p>
          <p>+254 700 000 000</p>
        </div>
      </div>

      <hr />

      <p className="copyright">© 2026 Jua Kali Connect</p>
    </footer>
  );
}

export default Footer;
