const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require("path");

require("dotenv").config({
  path: require("path").join(__dirname, ".env"),
});

const bookingRoutes = require("./routes/bookings");
const artisanRoutes = require("./routes/artisans");
const sessionRoutes = require("./routes/sessions");
const requireApiKey = require("./middleware/requireApiKey");
const rateLimiter = require("./middleware/rateLimiter");

const app = express();
const PORT = process.env.PORT || 5000;

const swaggerDocument = YAML.load(
  path.join(__dirname, "..", "public", "openapi.yaml"),
);

app.use(cors());
app.use(express.json());

// Require a valid API key before accessing protected endpoints
app.use(requireApiKey);
app.use(rateLimiter);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req, res) => {
  res.send("API is running");
});

app.get("/api/partner/members", async (req, res) => {
  const partnerUrl = process.env.PARTNER_URL;

  if (!partnerUrl) {
    return res.status(503).json({
      message: "Partner integration is not configured yet.",
    });
  }

  try {
    const headers = {
      Accept: "application/json",
    };

    if (process.env.PARTNER_API_KEY) {
      headers["X-API-Key"] = process.env.PARTNER_API_KEY;
    }

    const response = await fetch(`${partnerUrl.replace(/\/+$/, "")}/members`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      console.error("Partner API returned HTTP status:", response.status);

      return res.status(502).json({
        message: "The partner service could not provide member data.",
        partnerStatus: response.status,
      });
    }

    const data = await response.json();

    const members = Array.isArray(data)
      ? data
      : Array.isArray(data.members)
        ? data.members
        : null;

    if (!members) {
      console.error("Partner API returned an unexpected response format.");

      return res.status(502).json({
        message: "The partner service returned an unexpected data format.",
      });
    }

    return res.json({ members });
  } catch (error) {
    console.error(
      "Partner API connection failed:",
      error.cause?.code || error.code || error.message,
    );

    return res.status(503).json({
      message: "StudySync is currently unavailable. Please try again later.",
    });
  }
});

app.use("/api/bookings", bookingRoutes);
app.use("/api/artisans", artisanRoutes);
app.use("/api/sessions", sessionRoutes);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
