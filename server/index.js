const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require("path");
const morgan = require("morgan");
require("dotenv").config();

const bookingRoutes = require("./routes/bookings");
const artisanRoutes = require("./routes/artisans");
const sessionRoutes = require("./routes/sessions");

const {
  monitor,
  statsHandler,
} = require("./middleware/monitoring");

const app = express();
const PORT = process.env.PORT || 5000;

// Load OpenAPI specification
const swaggerDocument = YAML.load(
  path.join(__dirname, "..", "public", "openapi.yaml")
);

// Core middleware
app.use(cors());
app.use(express.json());

// Observability middleware MUST come before routes
app.use(monitor);

// HTTP request logging
app.use(morgan("combined"));

// Swagger docs
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

// Health check
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Jua Kali Connect API is running",
  });
});

// Metrics endpoint
app.get("/stats", statsHandler);

// API routes
app.use("/api/bookings", bookingRoutes);
app.use("/api/artisans", artisanRoutes);
app.use("/api/sessions", sessionRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    error: "Internal server error",
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
