# Week 12 API Request Monitoring Notes

## 1. Predictions before testing

Before generating traffic, I expected:

- Valid API requests to return successful 2xx responses.
- Requests with missing or incorrect API keys to return HTTP 401.
- Requests for nonexistent resources or routes to return HTTP 404.
- Invalid login credentials to be rejected.
- The monitoring middleware to record both successful and rejected requests.
- Requests to the same parameterized endpoint to be grouped under one route pattern.

**Performance predictions:**

- **Slowest endpoint:** I predicted that `GET /api/artisans/:id` would have the slowest average response time because retrieving a specific artisan requires looking up an individual record using its ID in the database.
- **Endpoint with the most errors:** I predicted that `POST /api/sessions/` would produce the most errors because login requests depend on valid user credentials, and incorrect or nonexistent credentials can result in rejected requests.

## 2. Traffic-generation test

The `traffic.js` script generated 60 requests against the local API.

| Test scenario               | Requests | Observed status |
| --------------------------- | -------: | --------------: |
| List artisans               |        8 |             200 |
| Get artisan 1               |        8 |             200 |
| List bookings               |        8 |             200 |
| Invalid artisan ID          |        8 |             404 |
| Missing API key             |        7 |             401 |
| Incorrect API key           |        7 |             401 |
| Unknown endpoint            |        7 |             404 |
| Invalid session credentials |        7 |             400 |
| **Total**                   |   **60** |                 |

There were 24 successful responses and 36 expected client-error responses. The traffic generator reported no failed network requests.

## 3. Measured monitoring results

The subsequent `/stats` snapshot recorded:

| Metric                   | Measured result |
| ------------------------ | --------------: |
| Total monitored requests |              67 |
| Client errors (4xx)      |              39 |
| Server errors (5xx)      |               0 |
| Server error rate        |              0% |
| Average response time    |          6.2 ms |

The snapshot includes the 60 generated requests and additional manual verification requests.

### Route-level observations

| Route pattern         | Count | Client errors | Average response time | Maximum response time |
| --------------------- | ----: | ------------: | --------------------: | --------------------: |
| GET /api/artisans/:id |    18 |             8 |                 16 ms |              250.1 ms |
| GET /api/artisans/    |     8 |             0 |                5.5 ms |               28.1 ms |
| GET /api/bookings/    |     8 |             0 |                6.6 ms |                 39 ms |
| POST /api/sessions/   |     7 |             7 |                0.9 ms |                  1 ms |
| GET /stats            |     2 |             0 |                1.6 ms |                1.6 ms |
| GET (no route)        |    24 |            24 |                0.9 ms |                3.5 ms |

The parameterized artisan endpoint was correctly grouped as
GET /api/artisans/:id, rather than being recorded as separate
routes for each artisan ID.

## 4. Analysis and hypothesis

The test produced the expected status codes for the deliberately valid and invalid requests. The monitoring middleware recorded rejected requests as well as successful requests because it runs before authentication and rate limiting.

The largest concentration of client errors came from requests without a matched route, including rejected authentication requests and the deliberately nonexistent endpoint. The 8 invalid artisan ID requests were grouped with the other artisan ID requests.

A useful next investigation would be to separate authentication failures from nonexistent routes in the statistics. This would make it easier to distinguish unauthorized traffic from ordinary client mistakes.

The reported `errorRatePercent` currently represents the server-error rate (5xx responses divided by total requests), not the combined 4xx and 5xx rate. The 39 client errors therefore do not increase this metric.

### Comparison of measured performance and errors

GET /api/artisans/:id had the slowest average response time
at 16 ms and the highest maximum response time at 250.1 ms.

GET (no route) recorded the highest number of client errors,
with 24 errors across 24 requests. This included requests
rejected before reaching a valid route.

The artisan detail endpoint also recorded 8 client errors
out of 18 requests, while the session endpoint recorded
7 client errors out of 7 requests.

The difference between average and maximum response times
shows that an average alone can hide occasional slow requests.
I would investigate the artisan detail endpoint further to
identify what caused its 250.1 ms maximum response time.

## 5. Proposed production alert

Proposed alert: notify the API maintainer if the 5xx server-error rate exceeds 5% over a rolling five-minute period.

This threshold is a proposed operational alert, not a result measured in this local test. Expected 4xx responses should be monitored separately so invalid client requests do not trigger the server-failure alert.

## 6. Limitations

The monitoring statistics are held in memory and reset when the server restarts. They are useful for the lab and short-term observation but are not a replacement for persistent production monitoring and historical metrics.

## Sample Request Logs

### Successful request (200)

{"time":"2026-11-09T12:53:00.424Z","caller":"key-25e96c","method":"GET","path":"/api/artisans","status":200,"ms":136.6}

### Rejected request (401)

{"time":"2026-11-09T12:53:15.397Z","caller":"key-fc04b5","method":"GET","path":"/api/artisans","status":401,"ms":1.9}

The logs demonstrate that both authenticated and rejected
requests are monitored. The API key itself is not recorded.

## Week 13: API Versioning Monitoring Evidence

### Versioned endpoint verification

On 9 November 2026, authenticated GET requests were sent to all three artisan endpoints to verify that the monitoring middleware records traffic across API versions.

| Endpoint           | HTTP status | Response time |
| ------------------ | ----------: | ------------: |
| `/api/artisans`    |         200 |        3.5 ms |
| `/api/v1/artisans` |         200 |        2.2 ms |
| `/api/v2/artisans` |         200 |        2.2 ms |

### Monitoring observations

- All three endpoints were recorded by the monitoring middleware.
- Each request included the same hashed caller identifier.
- All requests returned HTTP 200.
- No API keys were exposed in the monitoring logs.
- The `/stats` endpoint also recorded the versioned route activity.

The monitoring statistics were saved in `week13_monitoring_evidence.json`.

### Conclusion

The monitoring system successfully records requests to the legacy, v1 and v2 artisan endpoints. This provides visibility into API usage during the version migration period.
