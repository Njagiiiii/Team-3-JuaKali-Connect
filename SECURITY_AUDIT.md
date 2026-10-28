# Week 9 Security Audit - Jua Kali Connect

## API authentication

- Implemented API-key authentication using the X-API-Key header.
- Separate keys are configured for Team 3 testing and Group 4.
- Missing and invalid keys return HTTP 401.
- API keys are stored in server/.env and should be excluded from Git.
- API keys identify consuming applications, not individual end users.

## Rate limiting

- Implemented per-consumer rate limiting.
- Normal limit: 100 requests per minute.
- Temporary testing limit: 3 requests per minute.
- Previously observed response sequence: 200, 200, 200, 429, 429.
- HTTP 429 includes a Retry-After header and JSON error message.
- Normal limit was restored to 100 requests per minute.
- The current test suite is not passing on this development machine.

## Route security findings

### Artisans

- SQL queries use parameterized placeholders.
- API responses use selected fields rather than SELECT *.
- Generic error messages prevent stack traces from being returned.
- GET /api/artisans/:id exposes an artisan phone number; privacy requirements should be reviewed.
- POST /api/artisans needs stronger type and length validation.
- Write permissions should be restricted by consumer role if required.

### Bookings

- INSERT and UPDATE operations use parameterized SQL.
- Booking status and ID validation are present.
- GET /api/bookings uses SELECT * and should be limited to approved response fields.
- PATCH /api/bookings/:id requires an authorization review to prevent unauthorized modifications.

### Sessions

- API-key middleware protects the sessions route.
- The session route now uses bcrypt.compare() to verify passwords against stored password hashes.
- The login route depends on a users database table, but that table is not available in the database accessible to this developer.
- Successful authentication and bcrypt verification have not been confirmed by tests.
- Customer registration is currently a frontend mock-up and does not create a database user.
- Account creation must hash passwords using bcrypt before storing them.
- Session tests remain unverified because the required database and user records are unavailable.

## Remaining risks

- API keys identify consuming applications, not individual end users.
- Record-level authorization is not yet implemented.
- In-memory rate limiting is suitable for local testing but requires a shared store for multi-instance deployment.
- Dependency vulnerability warnings require review using npm audit.
- The complete test suite must pass in an environment with the required dependencies and database configuration.
- Database-backed authentication requires a users table and securely hashed passwords.

## Conclusion

API-key authentication and rate limiting have been implemented, with earlier local checks reported for these controls. The current test suite is not passing on this development machine.

Bcrypt password verification has been added to the session route, but database-backed login remains unverified because the required users table and account records are unavailable.
