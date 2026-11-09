# Week 13 - API Versioning Decision

## Part A: Selected Breaking Change

Endpoint: GET /artisans

### Current v1 response

The endpoint returns a bare JSON array of artisan objects.

### Proposed v2 response

The endpoint will return an object containing:

- data: an array of artisan objects
- count: the number of returned artisans

Example:
{
"data": [
{
"id": 1,
"name": "John",
"service": "Carpentry",
"rating": 4.5
}
],
"count": 1
}

## Why this change was selected

The response wrapper provides a consistent structure for metadata and makes future pagination easier to introduce.

## Why it is breaking

Existing consumers may use array operations such as .map() directly on the response. In v2, the array is inside the data property, so those consumers must update their code.

## Compatibility plan

- Keep the existing unversioned endpoint unchanged.
- Provide the original response structure through /api/v1/artisans.
- Provide the new response structure through /api/v2/artisans.
- Apply existing API-key authentication and rate limiting to both versions.
- Add deprecation headers to v1.
- Keep v1 available during the migration period.

## Existing behaviour to preserve

- Search query parameter.
- Location query parameter.
- 404 response when no matching artisans are found.
- Existing artisan fields and database mapping.

## Reflection

The most important lesson from this versioning exercise is that changing an API response can break existing applications even when the endpoint URL stays the same. For example, a consumer that expects a bare array and calls `.map()` directly will fail when the response becomes an object containing `data` and `count`.

Keeping the original response available through the unversioned endpoint and `/api/v1/artisans` allows existing consumers to continue working while new consumers can use `/api/v2/artisans`. This reduces the risk of introducing a breaking change without warning.

The automated tests helped verify that v1 retains its array response, v2 returns the wrapped response, authentication remains enforced, and deprecation headers are applied only to the older endpoints. Monitoring also confirmed that requests to all three endpoints are recorded.

One limitation is that the response comparison used saved responses captured after implementation, rather than a historical pre-change snapshot. Also, the proposed sunset date is documented, but automatic removal of v1 has not been implemented.

Overall, API versioning provides a controlled way to introduce improvements while preserving compatibility and making migration easier to manage.
