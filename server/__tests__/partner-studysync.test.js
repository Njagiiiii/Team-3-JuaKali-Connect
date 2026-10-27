const crypto = require("crypto");
const request = require("supertest");

const partnerApiUrl = process.env.PARTNER_API_URL;

const partnerApi = partnerApiUrl
  ? request(partnerApiUrl)
  : null;

beforeAll(() => {
  if (!partnerApi) {
    throw new Error(
      "Set PARTNER_API_URL to your partner's actual StudySync API URL before running these tests."
    );
  }
});

describe("StudySync Partner API - Members", () => {
  describe("GET /api/members", () => {
    it("returns a 200 status and an array of members", async () => {
      const res = await partnerApi.get("/api/members").set("X-API-Key", process.env.TEAM_TEST_API_KEY);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it("returns members with the required contract fields", async () => {
      const res = await partnerApi.get("/api/members").set("X-API-Key", process.env.TEAM_TEST_API_KEY);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);

      for (const member of res.body) {
        expect(member).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            name: expect.any(String),
            initials: expect.any(String),
            reliability: expect.any(Number)
          })
        );

        expect(member.initials.length).toBeGreaterThanOrEqual(1);
        expect(member.initials.length).toBeLessThanOrEqual(5);
        expect(Number.isInteger(member.reliability)).toBe(true);
        expect(member.reliability).toBeGreaterThanOrEqual(0);
        expect(member.reliability).toBeLessThanOrEqual(100);
      }
    });
  });

  describe("POST /api/members", () => {
    it("rejects a request with missing required fields", async () => {
      const res = await partnerApi
        .post("/api/members").set("X-API-Key", process.env.TEAM_TEST_API_KEY)
        .send({});

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error");
      expect(typeof res.body.error).toBe("string");
    });

    it("rejects a reliability value greater than 100", async () => {
      const res = await partnerApi
        .post("/api/members").set("X-API-Key", process.env.TEAM_TEST_API_KEY)
        .send({
          id: `partner-test-${Date.now()}`,
          name: "Test Member",
          initials: "TM",
          reliability: 101,
          group_id: null
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error");
      expect(typeof res.body.error).toBe("string");
    });

    it("creates a member and returns the documented fields", async () => {
      const testMemberId = `jest-member-${crypto.randomUUID()}`;

      try {
        const res = await partnerApi
          .post("/api/members").set("X-API-Key", process.env.TEAM_TEST_API_KEY)
          .send({
            id: testMemberId,
            name: "API Test Member",
            initials: "ATM",
            reliability: 75,
            group_id: null
          });

console.log("MEMBER CREATE DEBUG:", {
  status: res.status,
  body: res.body,
  idSent: testMemberId
});
        expect(res.status).toBe(201);
        expect(res.body).toEqual(
          expect.objectContaining({
            id: testMemberId,
            name: "API Test Member",
            initials: "ATM",
            reliability: 75
          })
        );
      } finally {
        await partnerApi
          .delete(`/api/members/${encodeURIComponent(testMemberId)}`).set("X-API-Key", process.env.TEAM_TEST_API_KEY)
          .catch(() => {});
      }
    });
  });
});

describe("PUT /api/members/:id", () => {
  it("updates an existing member successfully", async () => {
    const memberId = `partner-put-${crypto.randomUUID()}`;
    const createRes = await partnerApi
      .post("/api/members").set("X-API-Key", process.env.TEAM_TEST_API_KEY)
      .send({
        id: memberId,
        name: "Original Test Member",
        initials: "OTM",
        reliability: 60,
        group_id: null
      });

    expect(createRes.status).toBe(201);

    try {
      const res = await partnerApi
        .put(`/api/members/${encodeURIComponent(memberId)}`).set("X-API-Key", process.env.TEAM_TEST_API_KEY)
        .send({
          name: "Updated Test Member",
          initials: "UTM",
          reliability: 85
        });

      expect(res.status).toBe(200);
      expect(res.body).toEqual(
        expect.objectContaining({
          id: memberId,
          name: "Updated Test Member",
          initials: "UTM",
          reliability: 85
        })
      );
    } finally {
      await partnerApi
        .delete(`/api/members/${encodeURIComponent(memberId)}`).set("X-API-Key", process.env.TEAM_TEST_API_KEY)
        .catch(() => {});
    }
  });

  it("returns 400 when required update fields are missing", async () => {
    const res = await partnerApi
      .put("/api/members/nonexistent-test-member").set("X-API-Key", process.env.TEAM_TEST_API_KEY)
      .send({
        reliability: 80
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
    expect(typeof res.body.error).toBe("string");
  });

  it("returns 404 when the member does not exist", async () => {
    const res = await partnerApi
      .put(`/api/members/nonexistent-${Date.now()}`).set("X-API-Key", process.env.TEAM_TEST_API_KEY)
      .send({
        name: "Updated Member",
        initials: "UM"
      });

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");
  });
});

describe("DELETE /api/members/:id", () => {
  it("deletes an existing member successfully", async () => {
    const memberId =
      `partner-delete-${Date.now()}-${Math.random().toString(16).slice(2)}`;

    const createRes = await partnerApi
      .post("/api/members").set("X-API-Key", process.env.TEAM_TEST_API_KEY)
      .send({
        id: memberId,
        name: "Member To Delete",
        initials: "MTD",
        reliability: 50,
        group_id: null
      });

    expect(createRes.status).toBe(201);

    const deleteRes = await partnerApi
      .delete(`/api/members/${encodeURIComponent(memberId)}`).set("X-API-Key", process.env.TEAM_TEST_API_KEY);

    expect(deleteRes.status).toBe(204);
    expect(deleteRes.text).toBe("");

    const getRes = await partnerApi.get("/api/members").set("X-API-Key", process.env.TEAM_TEST_API_KEY);

    expect(getRes.status).toBe(200);
    expect(
      getRes.body.some(member => member.id === memberId)
    ).toBe(false);
  });

  it("returns 404 when deleting a member that does not exist", async () => {
    const res = await partnerApi
      .delete(`/api/members/nonexistent-${Date.now()}`).set("X-API-Key", process.env.TEAM_TEST_API_KEY);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");
  });
});

describe("GET /users/:userId/reliability-score", () => {
  it("returns the reliability score for an existing user", async () => {
    const membersRes = await partnerApi.get("/api/members").set("X-API-Key", process.env.TEAM_TEST_API_KEY);

    expect(membersRes.status).toBe(200);
    expect(Array.isArray(membersRes.body)).toBe(true);

    if (membersRes.body.length === 0) {
      console.warn(
        "Skipping reliability-score test: no members are available."
      );
      return;
    }

    const userId = membersRes.body[0].id;

    const res = await partnerApi.get(
      `/users/${encodeURIComponent(userId)}/reliability-score`
    );

    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        user_id: expect.any(String),
        user_name: expect.any(String),
        reliability_score: expect.any(Number)
      })
    );

    expect(res.body.user_id).toBe(userId);
    expect(Number.isInteger(res.body.reliability_score)).toBe(true);
    expect(res.body.reliability_score).toBeGreaterThanOrEqual(0);
    expect(res.body.reliability_score).toBeLessThanOrEqual(100);
  });

  it("returns 404 when the user does not exist", async () => {
    const userId = `nonexistent-user-${Date.now()}`;

    const res = await partnerApi.get(
      `/users/${encodeURIComponent(userId)}/reliability-score`
    );

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");
    expect(typeof res.body.error).toBe("string");
  });
});

describe("GET /api/tasks", () => {
  it("returns 200 and an array of tasks", async () => {
    const res = await partnerApi.get("/api/tasks").set("X-API-Key", process.env.TEAM_TEST_API_KEY);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("returns tasks with the required contract fields", async () => {
    const res = await partnerApi.get("/api/tasks").set("X-API-Key", process.env.TEAM_TEST_API_KEY);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    for (const task of res.body) {
      expect(task).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          title: expect.any(String),
          assigned_to: expect.any(String),
          status: expect.stringMatching(/^(pending|done|late)$/),
          deadline: expect.any(String)
        })
      );

      expect(Number.isNaN(Date.parse(task.deadline))).toBe(false);
    }
  });

  it.each(["pending", "done", "late"])(
    "accepts the status filter: %s",
    async (status) => {
      const res = await partnerApi
        .get("/api/tasks").set("X-API-Key", process.env.TEAM_TEST_API_KEY)
        .query({ status });

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);

      for (const task of res.body) {
        expect(task.status).toBe(status);
      }
    }
  );

  it("accepts a groupId filter", async () => {
    const res = await partnerApi
      .get("/api/tasks").set("X-API-Key", process.env.TEAM_TEST_API_KEY)
      .query({ groupId: "test-group" });

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("accepts an assignee filter", async () => {
    const membersRes = await partnerApi.get("/api/members").set("X-API-Key", process.env.TEAM_TEST_API_KEY);

    expect(membersRes.status).toBe(200);
    expect(Array.isArray(membersRes.body)).toBe(true);

    const assignee = membersRes.body.length > 0
      ? membersRes.body[0].id
      : "test-member";

    const res = await partnerApi
      .get("/api/tasks").set("X-API-Key", process.env.TEAM_TEST_API_KEY)
      .query({ assignee });

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("rejects an invalid status filter", async () => {
    const res = await partnerApi
      .get("/api/tasks").set("X-API-Key", process.env.TEAM_TEST_API_KEY)
      .query({ status: "in-progress" });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
    expect(typeof res.body.error).toBe("string");
  });
});

describe("POST /api/tasks", () => {
  it("creates a task successfully", async () => {
    const membersRes = await partnerApi.get("/api/members").set("X-API-Key", process.env.TEAM_TEST_API_KEY);



    expect(membersRes.status).toBe(200);
    expect(Array.isArray(membersRes.body)).toBe(true);
    expect(membersRes.body.length).toBeGreaterThan(0);

    const taskId =
      `partner-test-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const memberId = membersRes.body[0].id;

    try {
      const res = await partnerApi
        .post("/api/tasks").set("X-API-Key", process.env.TEAM_TEST_API_KEY)
        .send({
          id: taskId,
          title: "API Test Task",
          assigned_to: memberId,
          deadline: "2030-12-31T10:00:00Z",
          status: "pending"
        });

      expect(res.status).toBe(201);
      expect(res.body).toEqual(
        expect.objectContaining({
          id: taskId,
          title: "API Test Task",
          assigned_to: memberId,
          status: "pending",
          deadline: expect.any(String)
        })
      );

      expect(Number.isNaN(Date.parse(res.body.deadline))).toBe(false);
    } finally {
      await partnerApi
        .delete(`/api/tasks/${encodeURIComponent(taskId)}`).set("X-API-Key", process.env.TEAM_TEST_API_KEY)
        .catch(() => {});
    }
  });

  it("rejects a request with missing required fields", async () => {
    const res = await partnerApi
      .post("/api/tasks").set("X-API-Key", process.env.TEAM_TEST_API_KEY)
      .send({
        title: "Incomplete Task"
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
    expect(typeof res.body.error).toBe("string");
  });

  it.each(["in-progress", "cancelled", "unknown"])(
    "rejects an invalid task status: %s",
    async (status) => {
      const res = await partnerApi
        .post("/api/tasks").set("X-API-Key", process.env.TEAM_TEST_API_KEY)
        .send({
          id: `invalid-task-${Date.now()}-${Math.random().toString(16).slice(2)}`,
          title: "Invalid Status Task",
          assigned_to: "test-member",
          deadline: "2030-12-31T10:00:00Z",
          status
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error");
      expect(typeof res.body.error).toBe("string");
    }
  );

  it("rejects an invalid deadline format", async () => {
    const res = await partnerApi
      .post("/api/tasks").set("X-API-Key", process.env.TEAM_TEST_API_KEY)
      .send({
        id: `invalid-deadline-${Date.now()}`,
        title: "Invalid Deadline Task",
        assigned_to: "test-member",
        deadline: "not-a-date",
        status: "pending"
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
    expect(typeof res.body.error).toBe("string");
  });

  it("uses pending as the default status when status is omitted", async () => {
    const membersRes = await partnerApi.get("/api/members").set("X-API-Key", process.env.TEAM_TEST_API_KEY);

    expect(membersRes.status).toBe(200);
    expect(Array.isArray(membersRes.body)).toBe(true);
    expect(membersRes.body.length).toBeGreaterThan(0);

    const taskId =
      `default-status-${Date.now()}-${Math.random().toString(16).slice(2)}`;

    try {
      const res = await partnerApi
        .post("/api/tasks").set("X-API-Key", process.env.TEAM_TEST_API_KEY)
        .send({
          id: taskId,
          title: "Default Status Test",
          assigned_to: membersRes.body[0].id,
          deadline: "2030-12-31T10:00:00Z"
        });

      expect(res.status).toBe(201);
      expect(res.body.status).toBe("pending");
    } finally {
      await partnerApi
        .delete(`/api/tasks/${encodeURIComponent(taskId)}`).set("X-API-Key", process.env.TEAM_TEST_API_KEY)
        .catch(() => {});
    }
  });
});

describe("PATCH /api/tasks/:id", () => {
  it("updates an existing task successfully", async () => {
    const membersRes = await partnerApi.get("/api/members").set("X-API-Key", process.env.TEAM_TEST_API_KEY);

    expect(membersRes.status).toBe(200);
    expect(Array.isArray(membersRes.body)).toBe(true);

    if (membersRes.body.length === 0) {
      console.warn("Cannot test PATCH: no members are available.");
      return;
    }

    const taskId =
      `partner-patch-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const memberId = membersRes.body[0].id;

    const createRes = await partnerApi
      .post("/api/tasks").set("X-API-Key", process.env.TEAM_TEST_API_KEY)
      .send({
        id: taskId,
        title: "Original Test Task",
        assigned_to: memberId,
        deadline: "2030-12-31T10:00:00Z",
        status: "pending"
      });

    expect(createRes.status).toBe(201);

    try {
      const res = await partnerApi
        .patch(`/api/tasks/${encodeURIComponent(taskId)}`).set("X-API-Key", process.env.TEAM_TEST_API_KEY)
        .send({
          status: "done"
        });

      expect(res.status).toBe(200);
      expect(res.body).toEqual(
        expect.objectContaining({
          id: taskId,
          title: "Original Test Task",
          assigned_to: memberId,
          status: "done",
          deadline: expect.any(String)
        })
      );

      expect(Number.isNaN(Date.parse(res.body.deadline))).toBe(false);
    } finally {
      await partnerApi
        .delete(`/api/tasks/${encodeURIComponent(taskId)}`).set("X-API-Key", process.env.TEAM_TEST_API_KEY)
        .catch(() => {});
    }
  });

  it("returns 400 when no update fields are provided", async () => {
    const res = await partnerApi
      .patch("/api/tasks/nonexistent-patch-test").set("X-API-Key", process.env.TEAM_TEST_API_KEY)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
    expect(typeof res.body.error).toBe("string");
  });

  it("returns 400 when an invalid status is provided", async () => {
    const res = await partnerApi
      .patch("/api/tasks/nonexistent-patch-test").set("X-API-Key", process.env.TEAM_TEST_API_KEY)
      .send({
        status: "in-progress"
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
    expect(typeof res.body.error).toBe("string");
  });

  it("returns 400 when an invalid deadline is provided", async () => {
    const res = await partnerApi
      .patch("/api/tasks/nonexistent-patch-test").set("X-API-Key", process.env.TEAM_TEST_API_KEY)
      .send({
        deadline: "not-a-valid-date"
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
    expect(typeof res.body.error).toBe("string");
  });

  it("returns 404 when the task does not exist", async () => {
    const res = await partnerApi
      .patch(`/api/tasks/nonexistent-${Date.now()}`).set("X-API-Key", process.env.TEAM_TEST_API_KEY)
      .send({
        status: "done"
      });

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");
    expect(typeof res.body.error).toBe("string");
  });
});

describe("DELETE /api/tasks/:id", () => {
  it("deletes an existing task successfully", async () => {
    const membersRes = await partnerApi.get("/api/members").set("X-API-Key", process.env.TEAM_TEST_API_KEY);

    expect(membersRes.status).toBe(200);
    expect(Array.isArray(membersRes.body)).toBe(true);
    expect(membersRes.body.length).toBeGreaterThan(0);

    const taskId =
      `partner-delete-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const memberId = membersRes.body[0].id;

    const createRes = await partnerApi
      .post("/api/tasks").set("X-API-Key", process.env.TEAM_TEST_API_KEY)
      .send({
        id: taskId,
        title: "Task To Delete",
        assigned_to: memberId,
        deadline: "2030-12-31T10:00:00Z",
        status: "pending"
      });

    expect(createRes.status).toBe(201);

    const deleteRes = await partnerApi
      .delete(`/api/tasks/${encodeURIComponent(taskId)}`).set("X-API-Key", process.env.TEAM_TEST_API_KEY);

    expect(deleteRes.status).toBe(204);
    expect(deleteRes.text).toBe("");

    const tasksRes = await partnerApi.get("/api/tasks").set("X-API-Key", process.env.TEAM_TEST_API_KEY);

    expect(tasksRes.status).toBe(200);
    expect(
      tasksRes.body.some(task => task.id === taskId)
    ).toBe(false);
  });

  it("returns 404 when the task does not exist", async () => {
    const taskId = `nonexistent-task-${Date.now()}`;

    const res = await partnerApi
      .delete(`/api/tasks/${encodeURIComponent(taskId)}`).set("X-API-Key", process.env.TEAM_TEST_API_KEY);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");
    expect(typeof res.body.error).toBe("string");
  });
});

describe("GET /calendar-events", () => {
  it("returns 200 and an array of calendar events for a valid date range", async () => {
    const res = await partnerApi
      .get("/calendar-events").set("X-API-Key", process.env.TEAM_TEST_API_KEY)
      .query({
        from: "2026-09-01T00:00:00Z",
        to: "2026-09-30T23:59:59Z"
      });

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    for (const event of res.body) {
      expect(event).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          title: expect.any(String),
          assigned_to: expect.any(String),
          status: expect.stringMatching(/^(pending|done|late)$/),
          deadline: expect.any(String)
        })
      );

      expect(Number.isNaN(Date.parse(event.deadline))).toBe(false);
    }
  });

  it("returns 400 when the from parameter is missing", async () => {
    const res = await partnerApi
      .get("/calendar-events").set("X-API-Key", process.env.TEAM_TEST_API_KEY)
      .query({
        to: "2026-09-30T23:59:59Z"
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
    expect(typeof res.body.error).toBe("string");
  });

  it("returns 400 when the to parameter is missing", async () => {
    const res = await partnerApi
      .get("/calendar-events").set("X-API-Key", process.env.TEAM_TEST_API_KEY)
      .query({
        from: "2026-09-01T00:00:00Z"
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
    expect(typeof res.body.error).toBe("string");
  });

  it("returns 400 when the date range is invalid", async () => {
    const res = await partnerApi
      .get("/calendar-events").set("X-API-Key", process.env.TEAM_TEST_API_KEY)
      .query({
        from: "not-a-date",
        to: "also-not-a-date"
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
    expect(typeof res.body.error).toBe("string");
  });

  it("returns 400 when from is later than to", async () => {
    const res = await partnerApi
      .get("/calendar-events").set("X-API-Key", process.env.TEAM_TEST_API_KEY)
      .query({
        from: "2026-09-30T23:59:59Z",
        to: "2026-09-01T00:00:00Z"
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
    expect(typeof res.body.error).toBe("string");
  });
});

describe("GET /api/deadlines", () => {
  it("returns 200 and an array of deadlines", async () => {
    const res = await partnerApi.get("/api/deadlines").set("X-API-Key", process.env.TEAM_TEST_API_KEY);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("returns deadlines with the required contract fields", async () => {
    const res = await partnerApi.get("/api/deadlines").set("X-API-Key", process.env.TEAM_TEST_API_KEY);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    for (const deadline of res.body) {
      expect(deadline).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          title: expect.any(String),
          assigned_to: expect.any(String),
          status: expect.stringMatching(/^(pending|done|late)$/),
          deadline: expect.any(String)
        })
      );

      expect(Number.isNaN(Date.parse(deadline.deadline))).toBe(false);
    }
  });

  it("returns deadlines sorted in ascending order by date", async () => {
    const res = await partnerApi.get("/api/deadlines").set("X-API-Key", process.env.TEAM_TEST_API_KEY);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    for (let i = 1; i < res.body.length; i++) {
      const previousDate = Date.parse(res.body[i - 1].deadline);
      const currentDate = Date.parse(res.body[i].deadline);

      expect(previousDate).toBeLessThanOrEqual(currentDate);
    }
  });
});

describe("GET /users/:userId/activity", () => {
  it("returns 200 and an array of activity records for an existing user", async () => {
    const membersRes = await partnerApi.get("/api/members").set("X-API-Key", process.env.TEAM_TEST_API_KEY);

    expect(membersRes.status).toBe(200);
    expect(Array.isArray(membersRes.body)).toBe(true);
    expect(membersRes.body.length).toBeGreaterThan(0);

    const userId = membersRes.body[0].id;

    const res = await partnerApi.get(
      `/users/${encodeURIComponent(userId)}/activity`
    );

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    for (const activity of res.body) {
      expect(activity).toEqual(
        expect.objectContaining({
          member_id: expect.any(String),
          activity_date: expect.any(String),
          minutes_studied: expect.any(Number)
        })
      );

      expect(activity.member_id).toBe(userId);
      expect(Number.isNaN(Date.parse(activity.activity_date))).toBe(false);
      expect(Number.isInteger(activity.minutes_studied)).toBe(true);
      expect(activity.minutes_studied).toBeGreaterThanOrEqual(0);
    }
  });

  it("returns 404 when the user does not exist", async () => {
    const userId = `nonexistent-user-${Date.now()}`;

    const res = await partnerApi.get(
      `/users/${encodeURIComponent(userId)}/activity`
    );

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");
    expect(typeof res.body.error).toBe("string");
  });
});

describe("GET /api/activity", () => {
  it("returns 200 and an array of activity logs", async () => {
    const res = await partnerApi.get("/api/activity").set("X-API-Key", process.env.TEAM_TEST_API_KEY);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("returns activity logs with the required contract fields", async () => {
    const res = await partnerApi.get("/api/activity").set("X-API-Key", process.env.TEAM_TEST_API_KEY);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    for (const activity of res.body) {
      expect(activity).toEqual(
        expect.objectContaining({
          member_id: expect.any(String),
          activity_date: expect.any(String),
          minutes_studied: expect.any(Number)
        })
      );

      expect(Number.isNaN(Date.parse(activity.activity_date))).toBe(false);
      expect(Number.isInteger(activity.minutes_studied)).toBe(true);
      expect(activity.minutes_studied).toBeGreaterThanOrEqual(0);
    }
  });

  it("accepts a member filter", async () => {
    const membersRes = await partnerApi.get("/api/members").set("X-API-Key", process.env.TEAM_TEST_API_KEY);

    expect(membersRes.status).toBe(200);
    expect(Array.isArray(membersRes.body)).toBe(true);
    expect(membersRes.body.length).toBeGreaterThan(0);

    const memberId = membersRes.body[0].id;

    const res = await partnerApi
      .get("/api/activity").set("X-API-Key", process.env.TEAM_TEST_API_KEY)
      .query({ member: memberId });

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    for (const activity of res.body) {
      expect(activity.member_id).toBe(memberId);
    }
  });

  it("returns 400 for an invalid member filter", async () => {
    const res = await partnerApi
      .get("/api/activity").set("X-API-Key", process.env.TEAM_TEST_API_KEY)
      .query({ member: "" });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
    expect(typeof res.body.error).toBe("string");
  });
});

describe("GET /api/flashcards", () => {
  it("returns 200 and an array of flashcard decks", async () => {
    const res = await partnerApi.get("/api/flashcards").set("X-API-Key", process.env.TEAM_TEST_API_KEY);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("returns decks with the required fields and cards", async () => {
    const res = await partnerApi.get("/api/flashcards").set("X-API-Key", process.env.TEAM_TEST_API_KEY);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    for (const deck of res.body) {
      expect(deck).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          title: expect.any(String),
          owner_id: expect.any(String),
          cards: expect.any(Array)
        })
      );

      for (const card of deck.cards) {
        expect(card).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            deck_id: expect.any(String),
            question: expect.any(String),
            answer: expect.any(String)
          })
        );
      }
    }
  });

  it("accepts a groupId filter", async () => {
    const res = await partnerApi
      .get("/api/flashcards").set("X-API-Key", process.env.TEAM_TEST_API_KEY)
      .query({ groupId: "test-group" });

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("returns 400 for an invalid groupId", async () => {
    const res = await partnerApi
      .get("/api/flashcards").set("X-API-Key", process.env.TEAM_TEST_API_KEY)
      .query({ groupId: "" });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
    expect(typeof res.body.error).toBe("string");
  });
});