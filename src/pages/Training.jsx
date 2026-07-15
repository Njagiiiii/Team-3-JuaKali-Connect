import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageHero from "../components/PageHero";
import Section from "../components/Section";

function Training() {
  return (
    <>
      <Navbar />

      <PageHero
        title="Training Programs"
        subtitle="Improve your skills and grow your business."
      />

      <Section>

        <div className="training-grid">

          <div className="page-card">
            <h2>Carpentry</h2>
            <p>Duration: 8 Weeks</p>
            <p>Certificate Included</p>
          </div>

          <div className="page-card">
            <h2>Electrical Installation</h2>
            <p>Duration: 10 Weeks</p>
            <p>Certificate Included</p>
          </div>

          <div className="page-card">
            <h2>Plumbing</h2>
            <p>Duration: 6 Weeks</p>
            <p>Certificate Included</p>
          </div>

          <div className="page-card">
            <h2>Tailoring</h2>
            <p>Duration: 12 Weeks</p>
            <p>Certificate Included</p>
          </div>

        </div>

      </Section>

      <Footer />

    </>
  );
}

export default Training;