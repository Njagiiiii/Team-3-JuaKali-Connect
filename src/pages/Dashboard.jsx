
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageHero from "../components/PageHero";

function Dashboard() {
  const [members, setMembers] = useState([]);
  const [partnerLoading, setPartnerLoading] = useState(true);
  const [partnerError, setPartnerError] = useState("");
  const [stale, setStale] = useState(false);
  const [asOf, setAsOf] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadPartnerMembers() {
      try {
        setPartnerLoading(true);
        setPartnerError("");

      const response = await fetch(
  "http://localhost:5000/api/partner/members",
  {
    headers: {
      "X-API-Key": "TEAM_TEST_API_KEY",
    },
    signal: controller.signal
  }
);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Unable to load StudySync members."
          );
        }

        if (!Array.isArray(result.data)) {
          throw new Error("The partner API returned an unexpected data format.");
        }

        setMembers(result.data);
        setStale(result.stale === true);
        setAsOf(result.asOf || null);
      } catch (error) {
        if (error.name !== "AbortError") {
          setMembers([]);
          setPartnerError(
            error.message === "Failed to fetch"
              ? "Could not connect to the Jua Kali Connect backend. Check that it is running."
              : error.message || "StudySync is currently unavailable."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setPartnerLoading(false);
        }
      }
    }

    loadPartnerMembers();

    return () => controller.abort();
  }, []);

  function getMemberName(member) {
    return (
      member.name ||
      member.full_name ||
      member.fullName ||
      member.username ||
      member.email ||
      member.id ||
      "Unnamed member"
    );
  }

  function formatDate(date) {
    if (!date) return "Unknown";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "Unknown";

    return parsedDate.toLocaleString();
  }

  return (
    <>
      <Navbar />

      <PageHero
        title="StudySync Partner Dashboard"
        subtitle="View member information shared through our upstream partner integration."
      />

      <main className="dashboard-container">
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
            Member information is retrieved from the StudySync partner
            through the Jua Kali Connect backend.
          </p>

          {partnerLoading ? (
            <p>Loading StudySync members...</p>
          ) : partnerError ? (
            <p role="alert">{partnerError}</p>
          ) : (
            <>
              {stale && (
                <div
                  role="alert"
                  style={{
                    padding: "14px",
                    margin: "20px 0",
                    borderRadius: "8px",
                    background: "#fff3cd",
                    border: "1px solid #ffe69c",
                    color: "#664d03"
                  }}
                >
                  <strong>Showing previously saved data.</strong>
                  <p>
                    StudySync is currently unavailable. The information
                    below is from the last successful response.
                  </p>
                </div>
              )}

              <p>
                Successfully loaded {members.length} partner member
                {members.length === 1 ? "" : "s"}.
              </p>

              <p>
                <strong>Data status:</strong>{" "}
                {stale ? "Cached data" : "Live data"}
              </p>

              <p>
                <strong>Last successful update:</strong>{" "}
                {formatDate(asOf)}
              </p>

              {members.length === 0 ? (
                <p>No StudySync members were returned.</p>
              ) : (
                <div>
                  {members.map((member, index) => (
                    <article
                      key={member.id ?? member.member_id ?? index}
                      style={{
                        padding: "16px 0",
                        borderTop: "1px solid #eee"
                      }}
                    >
                      <h3>{getMemberName(member)}</h3>

                      {(member.initials || member.email) && (
                        <p>{member.initials || member.email}</p>
                      )}

                      {(member.group_name || member.groupName) && (
                        <p>
                          Group: {member.group_name || member.groupName}
                        </p>
                      )}

                      {member.reliability != null && (
                        <p>Reliability: {member.reliability}</p>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Dashboard;
