import { Routes, Route } from "react-router-dom";
import React from "react";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Artisans from "./pages/Artisans";
import Categories from "./pages/Categories";
import Login from "./pages/Login";
import RegisterArtisan from "./pages/RegisterArtisan";
import RegisterCustomer from "./pages/RegisterCustomer";
import Booking from "./pages/Booking";
import Training from "./pages/Training";
import Pricing from "./pages/Pricing";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/about" element={<About />} />

      <Route path="/contact" element={<Contact />} />

      <Route path="/artisans" element={<Artisans />} />

      <Route path="/categories/:category" element={<Categories />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register-artisan" element={<RegisterArtisan />} />

      <Route path="/register-customer" element={<RegisterCustomer />} />

      <Route path="/training" element={<Training />} />

      <Route path="/pricing" element={<Pricing />} />

      <Route path="/profile/:id" element={<Profile />} />

      <Route path="/booking/:id" element={<Booking />} />

      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}

export default App;
