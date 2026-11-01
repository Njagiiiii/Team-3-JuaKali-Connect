
const express = require("express");
const app = express();

let mode = "ok";
let calls = 0;

const members = [
  {
    id: "anna",
    name: "Anna",
    initials: "AN",
    group_name: "Team 2",
    reliability: 95
  },
  {
    id: "ben",
    name: "Ben",
    initials: "BE",
    group_name: "Team 2",
    reliability: 88
  }
];

const tasks = [
  {
    id: 1,
    title: "Write README",
    dueDate: "2026-11-02",
    status: "active"
  },
  {
    id: 2,
    title: "Ship v1",
    dueDate: "2026-11-09",
    status: "active"
  }
];

app.get("/__mode/:m", (req, res) => {
  const allowedModes = ["ok", "slow", "flaky", "error"];

  if (!allowedModes.includes(req.params.m)) {
    return res.status(400).json({ message: "Unknown mode" });
  }

  mode = req.params.m;
  calls = 0;

  res.json({ mode });
});

async function partnerResponse(req, res, data) {
  calls += 1;
  console.log(`GET ${req.path} (call ${calls}, mode ${mode})`);

  if (mode === "slow") {
    await new Promise(resolve => setTimeout(resolve, 10000));
  }

  if (mode === "flaky" && calls % 3 !== 0) {
    return res.status(503).json({ message: "Try again" });
  }

  if (mode === "error") {
    return res.status(500).json({ message: "Internal error" });
  }

  res.json(data);
}

app.get("/tasks", (req, res) => {
  partnerResponse(req, res, tasks);
});

app.get("/members", (req, res) => {
  partnerResponse(req, res, members);
});

app.listen(4000, () => {
  console.log("Stand-in partner running at http://localhost:4000");
});
