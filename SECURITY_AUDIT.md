# Week 9 Security Audit — Jua Kali Connect

## API authentication

- Implemented API-key authentication using the X-API-Key header.
- Separate keys are configured for Team 3 testing and Group 4.
- Missing and invalid keys return HTTP 401.
- API keys are stored in server/.env and excluded from Git.

## Rate limiting

- Implemented per-consumer rate limiting.
- Normal limit: 100 requests per minute.
- Tested with a temporary limit of 3 requests per minute.
- Observed: 200, 200, 200, 429, 429.
- HTTP 429 includes a Retry-After header and JSON error message.
- Restored the normal limit to 100 requests per minute.

## Route security findings

### Artisans

- SQL queries use parameterized placeholders.
- API responses use selected fields rather than SELECT \*.
- Generic error messages prevent stack traces from being returned.
- GET /api/artisans/:id exposes an artisan phone number; privacy requirements should be reviewed.
- POST /api/artisans needs stronger type and length validation.
- Write permissions should be restricted by consumer role if required.

### Bookings

- INSERT and UPDATE operations use parameterized SQL.
- Booking status and ID validation are present.
- GET /api/bookings uses SELECT \* and should be limited to approved response fields.
- PATCH /api/bookings/:id requires an authorization review to prevent unauthorized modifications.

### Sessions

- API-key middleware protects the sessions route.
- Login currently compares plaintext passwords.
- Password hashing and verification must be implemented before production deployment.
- Detailed sessions functionality testing is assigned to the backend team.

## Remaining risks

- API keys identify consuming applications, not individual end users.
- Record-level authorization is not yet implemented.
- In-memory rate limiting is suitable for local testing but requires a shared store for multi-instance deployment.
- Dependency vulnerability warnings require review using npm audit.

## Conclusion

API-key authentication and rate limiting were implemented and verified locally.
Additional security hardening is required before production deployment.
