
import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageHero from "../components/PageHero";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [members, setMembers] = useState([]);
  const [partnerLoading, setPartnerLoading] = useState(true);
  const [partnerError, setPartnerError] = useState("");

  useEffect(() => {
    try {
      const savedBookings = JSON.parse(
        localStorage.getItem("bookings") || "[]"
      );

      setBookings(Array.isArray(savedBookings) ? savedBookings : []);
    } catch {
      setBookings([]);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadPartnerMembers() {
      setPartnerLoading(true);
      setPartnerError("");

      try {
        const response = await fetch(
          "http://localhost:5000/api/partner/members"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load StudySync members."
          );
        }

        if (!cancelled) {
          setMembers(Array.isArray(data.members) ? data.members : []);
        }
      } catch {
        if (!cancelled) {
          setMembers([]);
          setPartnerError(
            "StudySync is currently unavailable. Your bookings are still accessible."
          );
        }
      } finally {
        if (!cancelled) {
          setPartnerLoading(false);
        }
      }
    }

    loadPartnerMembers();

    return () => {
      cancelled = true;
    };
  }, []);

  const customerBookings = user?.email
    ? bookings.filter(
        (booking) =>
          booking.email?.toLowerCase() === user.email.toLowerCase()
      )
    : [];

  return (
    <>
      <Navbar />

      <PageHero
        title="Customer Dashboard"
        subtitle="Your booking history and connected study resources"
      />

      <main className="dashboard-container">
        <section aria-labelledby="bookings-heading">
          <h2 id="bookings-heading">Your Bookings</h2>

          {!user ? (
            <p>Please log in to view your booking history.</p>
          ) : customerBookings.length === 0 ? (
            <p>No bookings yet.</p>
          ) : (
            customerBookings.map((booking) => (
              <article className="booking-card" key={booking.id}>
                <img
                  src={booking.artisanImage}
                  alt={booking.artisanName}
                />

                <div>
                  <h3>{booking.artisanName}</h3>
                  <p>{booking.artisanSkill}</p>
                  <p>{booking.location}</p>
                  <p>{booking.date}</p>
                  <p>
                    <strong>Status:</strong> {booking.status}
                  </p>
                </div>
              </article>
            ))
          )}
        </section>

        <section
          aria-labelledby="partner-heading"
          style={{
            marginTop: "32px",
            padding: "24px",
            border: "1px solid #e5e5e5",
            borderRadius: "12px",
            background: "#fff"
          }}
        >
          <h2 id="partner-heading">StudySync Members</h2>
          <p>
            Member information loaded from our partner's API through
            the Jua Kali Connect backend.
          </p>

          {partnerLoading ? (
            <p>Loading StudySync members...</p>
          ) : partnerError ? (
            <p role="status">{partnerError}</p>
          ) : members.length === 0 ? (
            <p>No StudySync members were returned.</p>
          ) : (
            <div>
              {members.map((member, index) => (
                <article
                  key={member.id ?? index}
                  style={{
                    padding: "12px 0",
                    borderTop: "1px solid #eee"
                  }}
                >
                  <h3>{member.name || "Unnamed member"}</h3>
                  {member.initials && <p>{member.initials}</p>}
                  {member.group_name && (
                    <p>Group: {member.group_name}</p>
                  )}
                  {member.reliability != null && (
                    <p>Reliability: {member.reliability}</p>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Dashboard;
