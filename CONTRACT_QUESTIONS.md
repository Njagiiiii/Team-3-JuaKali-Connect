# Contract Questions

## 1. User ID vs Member ID

The contract uses `userId` in `/users/{userId}/reliability-score` and `/users/{userId}/activity`, while other endpoints use `member`, `member_id`, and `assigned_to`.

**Question:** Are `userId`, `member_id`, `member`, and `assigned_to` referring to the same user/member identifier, or are they different identifiers?

## 2. Invalid Calendar Date Range

The `/calendar-events` endpoint requires `from` and `to` dates and documents a 400 response for invalid date-range parameters.

**Question:** What response should we expect if the `from` date is later than the `to` date? Should this return `400 Bad Request`?

## 3. Meaning of Nullable Group Fields

The contract allows `group_id`, `group_name`, and `shared_with_group` to be nullable.

**Question:** When these fields are `null`, does this mean that the user or flashcard deck has no group associated with it, and should the frontend handle it as an ungrouped member/deck?