const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require("path");

require("dotenv").config();

const bookingRoutes = require("./routes/bookings");
const artisanRoutes = require("./routes/artisans");
const sessionRoutes = require("./routes/sessions");

const app = express();

const PORT = process.env.PORT || 5000;

const swaggerDocument = YAML.load(
  path.join(__dirname, "..", "public", "openapi.yaml"),
);
console.log("Swagger servers:", swaggerDocument.servers);

app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req, res) => {
  res.send("API is running");
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
