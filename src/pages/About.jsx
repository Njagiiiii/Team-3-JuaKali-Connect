import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageHero from "../components/PageHero";
import Section from "../components/Section";

function About() {
  return (
    <>
      <Navbar />

      <PageHero
        title="About Jua Kali Connect"
        subtitle="Connecting skilled artisans with customers across Kenya."
      />

      <Section>

        <div className="page-card">

          <h2>Who We Are</h2>

          <p>
            Jua Kali Connect is a digital platform that helps customers
            find trusted artisans such as carpenters, electricians,
            plumbers, painters, welders and mechanics.
          </p>

        </div>

        <div className="page-card">

          <h2>Our Mission</h2>

          <p>
            To empower Kenyan artisans by giving them an online
            marketplace where they can showcase their skills and
            connect with customers.
          </p>

        </div>

      </Section>

      <Footer />
    </>
  );
}

export default About;