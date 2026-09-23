Contract Deviations

Changes Made to the OpenAPI Contract

Before implementing the Week 5 GET endpoints, the Week 4 API contract was corrected to align with the agreed endpoint list.

1. GET /artisans search parameter

The query parameter for `GET /artisans` was changed from `service` to `search`.

**Original:**

`
GET /artisans?service={term}&location={location}

**Updated:**

GET /artisans?search={term}&location={location}

The `search` parameter allows the API to search by artisan name or specialty, while `location` remains an optional location filter.

2. GET /artisans 404 response

A `404 Not Found` response was added to `GET /artisans` for cases where no matching artisans are found.

**Added response:**

404 - No matching artisans found

3. Rating field

The `rating` field was retained in the OpenAPI contract. The database initially did not contain a rating column, so the database was updated to support the existing contract field. This was an implementation/database change rather than a change to the API contract.

The final GET responses were implemented and verified against the corrected OpenAPI contract.

Week 6 — Write Endpoints

No changes were made to the OpenAPI contract during the Week 6 implementation and testing of the write endpoints.

The existing POST /bookings and PATCH /bookings/{id} contract definitions were used to implement request validation, successful write responses and error responses.
