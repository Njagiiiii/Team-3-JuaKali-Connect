
# Jua Kali Connect API

## 1. Overview

Jua Kali Connect is a REST API for a platform that connects customers with skilled artisans across different trades. It supports artisan registration and search, retrieving artisan details, booking services, and user login. The backend uses Node.js, Express, and MySQL, with OpenAPI documentation for developers integrating with the API.

## 2. Authentication

### Week 9 API-key authentication

Every API request requires an `X-API-Key` header.

- `TEAM_TEST_API_KEY`: Team 3 internal testing.
- `DOWNSTREAM_API_KEY`: Group 4 integration.

Store real keys in `server/.env`, never in Git.

Example request:

```powershell
curl.exe -i -H "X-API-Key: YOUR_ASSIGNED_KEY" http://localhost:5000/api/artisans
```

Missing or incorrect keys return HTTP 401:

```json
{"message":"Missing or invalid API key"}
```

### Rate limiting

Each authenticated consumer is allowed 100 requests per minute by default.
Exceeding this limit returns HTTP 429 with a `Retry-After` header:

```json
{"message":"Too many requests. Please try again later."}
```

Set `RATE_LIMIT_MAX=100` in `server/.env`.

### Sessions

`POST /api/sessions` also requires an API key. It does not currently issue a Bearer token.
Password hashing and detailed login testing are outstanding security tasks.
## 3. API Endpoints

The local API base URL is:

`http://localhost:5000/api`

### 3.1 Create a booking

**Method:** `POST`

**Endpoint:** `/api/bookings`

Creates a booking for an artisan and service.

Request:

```powershell
curl.exe -i -X POST "http://localhost:5000/api/bookings" -H "Content-Type: application/json" -d "{\"artisan_name\":\"Sean\",\"service\":\"Plumbing\",\"status\":\"pending\"}"
```

Expected successful response shape (HTTP `201`):

```json
{
  "id": 4,
  "artisan_name": "Sean",
  "service": "Plumbing",
  "status": "pending"
}
```

The returned ID and values above are examples, not a verified live response. Capture the actual response before submitting the final README.

### 3.2 List bookings

**Method:** `GET`

**Endpoint:** `/api/bookings`

Returns bookings stored in the database.

Request:

```powershell
curl.exe -i "http://localhost:5000/api/bookings"
```

A successful request is expected to return HTTP `200` and a JSON array of booking records. The actual response depends on the database contents.

This route exists in the implementation but is not currently included in `public/openapi.yaml`.

### 3.3 Update a booking

**Method:** `PATCH`

**Endpoint:** `/api/bookings/{id}`

Updates the status of an existing booking. Replace `1` with the ID of a booking that exists in the database.

Request:

```powershell
curl.exe -i -X PATCH "http://localhost:5000/api/bookings/1" -H "Content-Type: application/json" -d "{\"status\":\"completed\"}"
```

Expected successful response shape (HTTP `200`):

```json
{
  "message": "Booking updated"
}
```

The booking must exist, and the status must be valid. Verify the response against the running implementation.

### 3.4 Search artisans

**Method:** `GET`

**Endpoint:** `/api/artisans`

Searches artisans by name or specialty and can filter results by location.

Request:

```powershell
curl.exe -i "http://localhost:5000/api/artisans?search=plumbing&location=Nairobi"
```

A successful request is expected to return HTTP `200` and a JSON array of matching artisans.

Example response shape:

```json
[
  {
    "id": 3,
    "name": "Sean",
    "service": "Plumbing",
    "rating": 4.8
  }
]
```

The data above is illustrative and has not been verified against the live database. The actual field names and response must match the implementation.

### 3.5 Get an artisan by ID

**Method:** `GET`

**Endpoint:** `/api/artisans/{id}`

Retrieves details for one artisan. Replace `3` with an existing artisan ID.

Request:

```powershell
curl.exe -i "http://localhost:5000/api/artisans/3"
```

A successful request is expected to return HTTP `200` and a JSON object containing the artisan's details.

Example response shape:

```json
{
  "id": 3,
  "name": "Sean",
  "service": "Plumbing",
  "phone": "+254712345678",
  "rating": 4.8
}
```

The values above are examples, not verified live data.

### 3.6 Register an artisan

**Method:** `POST`

**Endpoint:** `/api/artisans`

Registers a new artisan. This route exists in the implementation but is not currently included in `public/openapi.yaml`.

Request:

```powershell
curl.exe -i -X POST "http://localhost:5000/api/artisans" -H "Content-Type: application/json" -d "{\"full_name\":\"Example Artisan\",\"phone\":\"+254712345678\",\"location\":\"Nairobi\",\"years_experience\":5,\"bio\":\"Experienced plumbing professional\",\"specialty\":\"Plumbing\",\"agreed_to_code_of_conduct\":true}"
```

A successful request is expected to return HTTP `201` and the registration result, including the newly created artisan's ID.

The example submits new data. Run it only against a database where you have permission to create records.

## 4. Error Response Reference

The API returns JSON error responses. Depending on the endpoint, the error may use an `error` or `message` field.

Example missing booking fields response:

```json
{
  "message": "artisan_name and service are required"
}
```

Example invalid login response:

```json
{
  "error": "Invalid email or password"
}
```

Example database failure response:

```json
{
  "error": "Failed to fetch artisans"
}
```

These are examples based on the current documentation and must be checked against actual endpoint responses.

Common HTTP status codes:

| Status | Meaning |
|---|---|
| `200` | Request completed successfully |
| `201` | Resource created or login accepted |
| `400` | Invalid or incomplete request |
| `401` | Missing/invalid API key or invalid login credentials |
| `404` | Resource or matching results not found |
| `429` | Rate limit exceeded; wait for Retry-After |
| `500` | Server or database error |

Callers should check the HTTP status code as well as the response body to determine whether a request succeeded.

## 5. Running the API Locally

### Prerequisites

Install:

- Git
- Node.js and npm
- MySQL, or access to a reachable MySQL database containing the required tables

### Step 1: Clone the repository

Replace `<REPOSITORY_URL>` with the actual Git repository URL.

```bash
git clone <REPOSITORY_URL>
cd Team-3-JuaKali-Connect
```

### Step 2: Install dependencies

```bash
cd server
npm install
```

### Step 3: Configure the environment

Create a file named `.env` inside the `server` directory.

Add the database settings supplied by your project administrator:

```dotenv
DB_HOST=your_database_host
DB_USER=your_database_username
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
DB_PORT=3306
PORT=5000
```

Replace the placeholder values with valid settings. `DB_HOST=localhost` works only when the database is accessible on the same computer.

The database must be reachable from the API server and contain the tables required by the application.

Do not commit the real `.env` file or publish database credentials.

### Step 4: Start the API

Run this command from inside the `server` directory:

```bash
npm start
```

The default server address is:

`http://localhost:5000`

### Step 5: Check the server

Open the following URL in a browser:

`http://localhost:5000/`

Or run:

```powershell
curl.exe -i "http://localhost:5000/"
```

The root endpoint is expected to return `API is running` if that response is configured in the current implementation.

A successful health check confirms that the server is reachable. It does not prove that the database connection or database-dependent endpoints work.

### Step 6: Open the API documentation

When the server is running, open:

`http://localhost:5000/api-docs`

The OpenAPI specification is stored at `public/openapi.yaml`, and the generated static documentation is at `public/api-docs.html`.

The static HTML file can be opened without starting the server, but sending API requests requires a running, reachable API.

## 6. OpenAPI Contract

The current OpenAPI specification documents these five operations:

- `POST /bookings`
- `PATCH /bookings/{id}`
- `POST /sessions`
- `GET /artisans`
- `GET /artisans/{id}`



## Week 9 Environment Variables

Add `TEAM_TEST_API_KEY`, `DOWNSTREAM_API_KEY`, and `RATE_LIMIT_MAX=100` to `server/.env`.
See `server/.env.example` for placeholders and `SECURITY_AUDIT.md` for the security review.
Existing request examples above must include the `X-API-Key` header when executed.
