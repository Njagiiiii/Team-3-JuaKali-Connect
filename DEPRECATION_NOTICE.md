# API Deprecation Notice — Jua Kali Connect

**Date issued:** 9 November 2026

**Affected endpoints:**

- `GET /api/artisans`
- `GET /api/v1/artisans`

**Replacement endpoint:** `GET /api/v2/artisans`

**Proposed sunset date:** 24 November 2026

## 1. Summary

Jua Kali Connect is introducing API version 2 (v2) for the artisans endpoint.

The response format is changing from a bare JSON array to a JSON object containing artisan records under a `data` property and the number of returned records under a `count` property.

The existing unversioned endpoint and v1 endpoint will remain available during the migration period.

## 2. What is changing?

### Previous response — v1

Endpoint: `GET /api/v1/artisans`

The endpoint returns a bare JSON array:

```json
[
  {
    "id": 1,
    "name": "John",
    "service": "Carpentry",
    "rating": 4.5
  }
]
```

### New response — v2

Endpoint: `GET /api/v2/artisans`

The endpoint returns an object containing `data` and `count`:

```json
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
```

The artisan fields remain the same, but their location in the response has changed.

## 3. Why is this change being made?

The new response structure provides room for additional response metadata and makes future pagination easier to introduce.

This is a breaking change because existing consumers may expect the response itself to be an array. Code that directly calls `.map()` on the response will need to be updated.

## 4. Migration instructions

Consumers should:

1. Change their request URL to `/api/v2/artisans`.
2. Continue providing their API key through the `X-API-Key` request header.
3. Update their response handling to read artisan records from `response.data`.
4. Use `response.count` to access the number of returned artisans.
5. Test their integration against v2 before completing the migration.

### Example code change

**Previous v1 approach:**

```javascript
const artisans = await response.json();
artisans.map((artisan) => artisan.name);
```

**New v2 approach:**

```javascript
const result = await response.json();
result.data.map((artisan) => artisan.name);
```

The `search` and `location` query parameters remain supported in v2.

## 5. Migration timeline

- **9 November 2026:** Deprecation notice issued.
- **9–23 November 2026:** Proposed migration and testing period.
- **24 November 2026:** Proposed sunset date for the old unversioned endpoint and v1.

The affected endpoints currently return deprecation headers identifying the replacement endpoint and proposed sunset date.

The sunset date is a planned retirement date. Automatic shutdown of the old endpoints has not yet been implemented.

## 6. Questions and support

If you have questions or encounter migration difficulties, contact the Jua Kali Connect development team through your integration partner.

Please acknowledge receipt of this notice and confirm whether your integration will require changes.

Thank you,

**Jua Kali Connect Development Team**
