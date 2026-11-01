
# WEEK 11 – RESILIENCE TESTING NOTES

## 1. Failure Testing Results

A local stand-in partner API was created using Express and configured to simulate different service conditions. The stand-in partner runs on port 4000 and supports four modes: `ok`, `slow`, `flaky` and `error`.

### Test Results

| Test Scenario | Expected Behaviour | Observed Result | Status |
|---|---|---|---|
| Partner available (ok) | Return member data successfully | Anna and Ben were returned successfully | Passed |
| Partner stopped | Application should use previously cached data | Anna and Ben remained available with `stale: true` | Passed |
| Slow partner | Request should time out instead of waiting indefinitely | Partner delayed responses by approximately 10 seconds; backend timeout and retry handling took approximately 5.187 seconds | Passed |
| Flaky partner | Temporary failures should trigger retries | First two requests returned HTTP 503, while the third succeeded | Passed |
| Partner error (HTTP 500) | Server errors should trigger retries and then use cached data | Three attempts were made before cached member data was returned | Passed |

### Response Time Measurements

- Normal partner response time: 0.0444 seconds (approximately 44 ms).
- Slow partner response time: approximately 10.04 seconds.
- Observed backend duration during the slow-mode timeout and retry test: 5.1867 seconds.

---

## 2. Timeout and Retry Configuration

### Timeout Configuration

A timeout of 1500 milliseconds (1.5 seconds) was implemented using:

`AbortSignal.timeout(1500)`

The normal partner response time was approximately 44 milliseconds, while the slow partner took approximately 10 seconds.

A timeout of 1500 milliseconds was selected because it allows considerably more time than a normal response requires while preventing the application from waiting too long for an unresponsive partner service.

### Retry Configuration

A reusable retry helper was implemented in:

`server/resilientFetch.js`

The following retry settings were used:

- Maximum retries: 2 retries after the initial request.
- Maximum attempts: 3 attempts in total.
- Initial retry delay: 200 milliseconds.
- Backoff strategy: exponential backoff.
- First retry delay: 200 milliseconds.
- Second retry delay: 400 milliseconds.
- Total backoff delay: 600 milliseconds.

The helper retries GET requests when they experience timeouts, connection failures or the following HTTP status codes:

- 429 – Too Many Requests
- 500 – Internal Server Error
- 502 – Bad Gateway
- 503 – Service Unavailable
- 504 – Gateway Timeout

For HTTP 429 responses, the helper also considers the `Retry-After` header and caps the wait at 5 seconds.

Requests that modify data, such as POST, PUT, PATCH and DELETE, are not automatically retried.

### Worst-Case Waiting Time

With a 1500 ms timeout, two retries and exponential backoff, the expected maximum waiting time is:

Initial request:

1500 ms

First retry:

1500 ms + 200 ms delay

Second retry:

1500 ms + 400 ms delay

Total:

1500 + 1500 + 200 + 1500 + 400 = 5100 ms

Therefore, the expected maximum waiting time is approximately 5.1 seconds, excluding small execution and network overheads.

### Actual Measurement

The observed duration during the slow-mode test was:

5.1867 seconds (approximately 5.19 seconds).

This is close to the expected 5.1 seconds. The small difference is attributable to request-processing and execution overhead.

The retry mechanism was also verified using error mode. The stand-in partner logs confirmed three attempts: one initial request and two retries.

---

## 3. What Would a Real User Experience Without This Code?

1. Without the resilience code, a user opening the StudySync Partner Dashboard while the partner API is unavailable would see a loading screen that continues waiting for a response.
2. If the request eventually times out or fails, the Dashboard would display an error instead of Anna and Ben's member information.
3. The user would have to wait for the request to fail before knowing that the partner service is unavailable.
4. The user might refresh the Dashboard repeatedly, hoping that the partner service becomes available.
5. Each refresh would make another request to the failing partner API, potentially causing further delays and frustration.
6. The user would have no previously retrieved member information to refer to until the partner service recovered.

---

## 4. What You Did Not Build

A circuit breaker was not implemented; it would act as a switch that temporarily stops requests to a partner API after repeated failures and occasionally allows a test request to check whether the service has recovered, whereas our implementation still attempts every request up to three times before falling back to cached data.

