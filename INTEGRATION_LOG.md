
# Week 10 Integration Log

## Project: Jua Kali Connect
## Integration Partner: StudySync
## Activity: Week 10 — Integration

### Test 1: Initial Partner API Call

- **Endpoint:** GET /members
- **Purpose:** Verify connectivity to the partner's live API.
- **Authentication:** Skipped for today's lab, as agreed.
- **Expected Result:** A successful response containing member data.
- **Actual Result:** The API call succeeded and returned member data.
- **Status:** Successful
- **Issue Encountered:** None during the initial API call.
- **Root Cause:** Not applicable; the request worked as expected.
- **Fix:** No fix required.
- **Whose Code:** No bug identified on either side.
- **Evidence:** Successful response received from the partner API through PowerShell.

####The other part of the lab will be presented in class once the API keys have been created

# INTEGRATION LOG — Jua Kali Connect and StudySync

## Integration Overview

- **Consumer Application:** Jua Kali Connect
- **Partner Application:** StudySync
- **Feature:** Display StudySync member information on the Jua Kali Connect Customer Dashboard.
- **Partner Endpoint Called:** `GET /api/members`
- **Jua Kali Connect Endpoint:** `GET /api/partner/members`

Jua Kali Connect retrieves member information from StudySync through its own backend. The frontend requests the data from the Jua Kali Connect backend rather than calling the partner API directly.

## Configuration

The partner URL and API key are configured using backend environment variables:

- `PARTNER_URL`
- `PARTNER_API_KEY`

The API key is kept on the backend and is not exposed in frontend code. The `.env` file is not committed to the repository.

## Feature Implementation

The backend calls the StudySync members endpoint and returns the member data to the frontend.

The  Dashboard displays the member information returned by StudySync. 

## Integration Issue Recorded

| # | What broke (symptom) | Root cause | Fix | Whose code, and who fixed it |
|---|---|---|---|---|
| 1 | The partner's Cloudflare tunnel hostname could not be resolved, so Jua Kali Connect could not reach the StudySync API using that URL. | The partner's Cloudflare tunnel URL was not resolving from our machine/network. | We switched to using the partner's reachable URL while both applications were connected to the same LAN. The partner URL then worked. | Network/environment connectivity issue rather than an identified application-code bug. The teams coordinated the change; Jua Kali Connect's partner URL configuration was updated. |

## Failure Handling

The partner API was unavailable during the failure test. Jua Kali Connect handled the failed request and displayed this fallback message on the dashboard:

> StudySync is currently unavailable. 



## Failure Drill and Recovery

- The partner API could not be reached through the clouflare tunnel 
- The applications were connected to the same LAN and the partner URL was changed to the reachable LAN URL.
- The partner URL then worked and the member data could be retrieved.
- The dashboard's fallback message was used when the partner service was unavailable.


## Conclusion

The StudySync integration was connected to the Jua Kali Connect Customer Dashboard through the Jua Kali Connect backend. The main issue encountered was the partner's Cloudflare tunnel hostname failing to resolve. Switching to a reachable partner URL while both applications were on the same LAN resolved the connectivity issue.