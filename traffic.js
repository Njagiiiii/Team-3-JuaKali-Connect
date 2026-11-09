const API = process.env.API || "http://localhost:5000";
const KEY = process.env.KEY || process.env.API_KEY;
const N = Number(process.env.N || 60);

if (!KEY) {
  console.error("Missing API key. Set KEY or API_KEY first.");
  process.exit(1);
}

const mix = [
  { name: "List artisans", method: "GET", path: "/api/artisans", key: "valid" },
  {
    name: "Get artisan 1",
    method: "GET",
    path: "/api/artisans/1",
    key: "valid",
  },
  { name: "List bookings", method: "GET", path: "/api/bookings", key: "valid" },
  {
    name: "Invalid artisan ID",
    method: "GET",
    path: "/api/artisans/9999",
    key: "valid",
  },
  {
    name: "Missing API key",
    method: "GET",
    path: "/api/artisans",
    key: "missing",
  },
  {
    name: "Incorrect API key",
    method: "GET",
    path: "/api/artisans",
    key: "wrong",
  },
  {
    name: "Unknown endpoint",
    method: "GET",
    path: "/not-a-route",
    key: "valid",
  },
  {
    name: "Invalid session credentials",
    method: "POST",
    path: "/api/sessions",
    key: "valid",
    body: {
      email: "invalid-test@example.com",
      password: "invalid-test-password",
    },
  },
];

const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

(async () => {
  const counts = {};

  console.log(`Generating ${N} requests against ${API}`);

  for (let i = 0; i < N; i++) {
    const test = mix[i % mix.length];

    const options = {
      method: test.method,
      headers: {},
    };

    if (test.key === "valid") {
      options.headers["X-API-Key"] = KEY;
    } else if (test.key === "wrong") {
      options.headers["X-API-Key"] = "definitely-wrong-test-key";
    }

    if (test.body) {
      options.headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(test.body);
    }

    try {
      const response = await fetch(API + test.path, options);
      const status = response.status;

      const label = `${test.name} (${status})`;
      counts[label] = (counts[label] || 0) + 1;

      console.log(`${i + 1}/${N}: ${test.name} -> ${status}`);
    } catch (error) {
      counts[`${test.name} (failed)`] =
        (counts[`${test.name} (failed)`] || 0) + 1;

      console.error(`${test.name}: ${error.message}`);
    }

    await pause(50);
  }

  console.log("\nTraffic generation complete.");
  console.log("Results:", counts);
})();
