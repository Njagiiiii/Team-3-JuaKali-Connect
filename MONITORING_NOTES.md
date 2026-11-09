# Week 12 API Request Monitoring Notes

## 1. Predictions before testing

Before generating traffic, I expected:

- Valid API requests to return successful 2xx responses.
- Requests with missing or incorrect API keys to return HTTP 401.
- Requests for nonexistent resources or routes to return HTTP 404.
- Invalid login credentials to be rejected.
- The monitoring middleware to record both successful and rejected requests.
- Requests to the same parameterized endpoint to be grouped under one route pattern.

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

| Route pattern         | Count | Client errors | Average response time |
| --------------------- | ----: | ------------: | --------------------: |
| GET /api/artisans/:id |    18 |             8 |                 16 ms |
| GET /api/artisans/    |     8 |             0 |                5.5 ms |
| GET /api/bookings/    |     8 |             0 |                6.6 ms |
| POST /api/sessions/   |     7 |             7 |                0.9 ms |
| GET /stats            |     2 |             0 |                1.6 ms |
| GET (no route)        |    24 |            24 |                0.9 ms |

The parameterized artisan endpoint was correctly grouped as `GET /api/artisans/:id`, rather than being recorded as separate routes for each artisan ID.

## 4. Analysis and hypothesis

The test produced the expected status codes for the deliberately valid and invalid requests. The monitoring middleware recorded rejected requests as well as successful requests because it runs before authentication and rate limiting.

The largest concentration of client errors came from requests without a matched route, including rejected authentication requests and the deliberately nonexistent endpoint. The 8 invalid artisan ID requests were grouped with the other artisan ID requests.

A useful next investigation would be to separate authentication failures from nonexistent routes in the statistics. This would make it easier to distinguish unauthorized traffic from ordinary client mistakes.

The reported `errorRatePercent` currently represents the server-error rate (5xx responses divided by total requests), not the combined 4xx and 5xx rate. The 39 client errors therefore do not increase this metric.

## 5. Proposed production alert

Proposed alert: notify the API maintainer if the 5xx server-error rate exceeds 5% over a rolling five-minute period.

This threshold is a proposed operational alert, not a result measured in this local test. Expected 4xx responses should be monitored separately so invalid client requests do not trigger the server-failure alert.

## 6. Limitations

The monitoring statistics are held in memory and reset when the server restarts. They are useful for the lab and short-term observation but are not a replacement for persistent production monitoring and historical metrics.
