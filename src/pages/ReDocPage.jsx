import { useEffect } from "react";
import { RedocStandalone } from "redoc";

function ReDocPage() {
  useEffect(() => {
    // Any setup logic if needed
  }, []);

  return (
    <section
      className="redoc-container"
      style={{
        height: "100vh",
        width: "100%",
        borderRadius: "15px",
        background: "#fff",
        padding: "20px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
      }}
    >
      <h2>API Documentation (ReDoc)</h2>
      <RedocStandalone
        specUrl="/openapi.yaml"
        options={{
          theme: { colors: { primary: { main: "#1976d2" } } },
          hideDownloadButton: false,
          nativeScrollbars: true,
        }}
      />
    </section>
  );
}

export default ReDocPage;
