const crypto = require("crypto");

const round = (n) => Math.round(n * 10) / 10;

const stats = {
  startedAt: new Date().toISOString(),
  total: 0,
  clientErrors: 0,
  serverErrors: 0,
  totalMs: 0,
  routes: {},
};

function newRoute() {
  return {
    count: 0,
    clientErrors: 0,
    serverErrors: 0,
    totalMs: 0,
    maxMs: 0,
  };
}

function who(req) {
  const apiKey = req.apiKey || req.headers["x-api-key"];

  if (!apiKey) return "none";

  const hash = crypto
    .createHash("sha256")
    .update(apiKey)
    .digest("hex");

  return "key-" + hash.slice(0, 6);
}

function monitor(req, res, next) {
  const started = process.hrtime.bigint();

  res.on("finish", () => {
    const finished = process.hrtime.bigint();

    const ms = Number(finished - started) / 1000000;

    console.log(
      JSON.stringify({
        time: new Date().toISOString(),
        caller: who(req),
        method: req.method,
        path: req.path,
        status: res.statusCode,
        ms: round(ms),
      })
    );

    // Route statistics
    const route = req.route
      ? req.baseUrl + req.route.path
      : "(no route)";

    const label = `${req.method} ${route}`;

    const r = stats.routes[label] || newRoute();

    stats.routes[label] = r;

    stats.total += 1;
    stats.totalMs += ms;

    r.count += 1;
    r.totalMs += ms;
    r.maxMs = Math.max(r.maxMs, ms);

    if (res.statusCode >= 500) {
      stats.serverErrors += 1;
      r.serverErrors += 1;
    } else if (res.statusCode >= 400) {
      stats.clientErrors += 1;
      r.clientErrors += 1;
    }
  });

  next();
}

function statsHandler(req, res) {
  const routes = {};

  for (const [label, r] of Object.entries(stats.routes)) {
    routes[label] = {
      count: r.count,
      clientErrors: r.clientErrors,
      serverErrors: r.serverErrors,
      avgMs: round(r.totalMs / r.count),
      maxMs: round(r.maxMs),
    };
  }

  const rate = stats.total
    ? (stats.serverErrors / stats.total) * 100
    : 0;

  const avg = stats.total
    ? stats.totalMs / stats.total
    : 0;

  res.json({
    startedAt: stats.startedAt,
    uptimeSeconds: Math.round(process.uptime()),
    total: stats.total,
    clientErrors: stats.clientErrors,
    serverErrors: stats.serverErrors,
    errorRatePercent: round(rate),
    avgMs: round(avg),
    routes,
  });
}

module.exports = {
  monitor,
  statsHandler,
};
