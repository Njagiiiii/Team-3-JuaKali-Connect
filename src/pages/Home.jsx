import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Stats from "../components/Stats";
import Features from "../components/Features";
import Categories from "../components/Categories";
import CTA from "../components/CTA";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <Categories />
      <CTA />
      <Footer />
    </>
  );
}

export default Home;