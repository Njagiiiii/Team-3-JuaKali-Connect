// traffic.js
// Run:
// API=http://localhost:5000 KEY=your-api-key node traffic.js

const API = process.env.API || "http://localhost:5000";
const KEY = process.env.KEY;
const N = Number(process.env.N || 60);

const mix = [
  // Successful requests
  { method: "GET", path: "/api/artisans", key: true },
  { method: "GET", path: "/api/artisans/1", key: true },
  { method: "GET", path: "/api/bookings", key: true },

  // Requests expected to return 404
  { method: "GET", path: "/api/artisans/9999", key: true },
  { method: "PATCH", path: "/api/bookings/9999", key: true },

  // Requests expected to return 401 (if API key required)
  { method: "GET", path: "/api/artisans", key: false },

  // Non-existent route
  { method: "GET", path: "/not-a-route", key: true },

  // Session test
  { method: "POST", path: "/api/sessions", key: true }
];

const pause = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

(async () => {
  const counts = {};

  for (let i = 0; i < N; i++) {
    const r = mix[Math.floor(Math.random() * mix.length)];

    try {
      const options = {
        method: r.method,
        headers: {},
      };

      if (r.key) {
        options.headers["X-API-Key"] = KEY;
      }

      if (r.method === "POST" && r.path === "/api/sessions") {
        options.headers["Content-Type"] = "application/json";
        options.body = JSON.stringify({
          username: "test",
          password: "test",
        });
      }

      const res = await fetch(API + r.path, options);

      counts[res.status] =
        (counts[res.status] || 0) + 1;
    } catch (err) {
      counts.failed = (counts.failed || 0) + 1;
    }

    await pause(50);
  }

  console.log("Status codes received:", counts);
})();