# Monitoring Notes

## 1. Which endpoint do you think will be the slowest, and why?

I predict that `GET /api/artisans` will be the slowest endpoint.

Reason:
- It performs a database search that may include filtering by search term and location.
- The endpoint uses SQL `LIKE` operations when searching by artisan name or specialty.
- As the number of artisan records grows, searching and filtering data will likely take longer than fetching a single record.
- The endpoint may return multiple results, which increases database and response processing time.

## 2. Which endpoint do you think will produce the most errors, and why?

I predict that `POST /api/sessions` will produce the most errors.

Reason:
- Authentication endpoints commonly receive invalid credentials.
- Users may enter incorrect usernames or passwords.
- Missing request fields can also result in validation failures.
- Failed authentication attempts return `401 Unauthorized`, making this endpoint likely to generate the highest number of client errors.

## Expected Trends

- Most frequent successful request: `GET /api/artisans`
- Most common client error: `401 Unauthorized` from `POST /api/sessions`
- Most common server error source: database connectivity issues
- Highest average response time: `GET /api/artisans`