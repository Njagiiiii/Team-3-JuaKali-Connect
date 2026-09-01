#Jua Kali Connect API — Endpoint List

Team 3

Rose Njagi- 221363
Patience Naliaka Ovamba- 222191
Ryan Amani- 221741
Sean Ochieng

 # Jua Kali Connect API — Endpoint List


| POST   | `/sessions`                                   | Authenticate a user and create a session. Returns **201 Created** on success, **401 Unauthorized** for invalid credentials.                                 | “ArtistsVenue Funds needs to authenticate users in order to allow users to securely access Jua Kali Connect services.”                              |
| GET    | `/artisans?search={term}&location={location}` | Return artisans matching the search term and optional location. Returns **200 OK** on success and **404 Not Found** if no matching resources are available. | “ArtistsVenue Funds needs to search artisan and service data in order to allow users to find suitable artisans for their event-related needs.”      |
| GET    | `/artisans/{id}`                              | Return the profile and service details of one artisan. Returns **200 OK** on success and **404 Not Found** if the artisan does not exist.                   | “ArtistsVenue Funds needs to search artisan and service data in order to allow users to find suitable artisans for their event-related needs.”      |
| POST   | `/bookings`                                   | Create a booking for an artisan and service. Returns **201 Created** on success and **400 Bad Request** for invalid booking data.                           | “ArtistsVenue Funds needs to create booking records in order to allow users to book services from available artisans.”                              |
| PATCH  | `/bookings/{id}`                              | Update an existing booking's information or status. Returns **200 OK** on success and **404 Not Found** if the booking does not exist.                      | “ArtistsVenue Funds needs to update booking records in order to allow users to change existing bookings and keep booking information synchronized.” |

## Peer Review Feedback and Revisions

* The reviewer confirmed that the endpoint paths use nouns, the HTTP methods are appropriate, query parameters are used correctly, and the endpoints map clearly to the identified needs.
* **Revision made:** Appropriate success and error status codes were added to each endpoint.
* **CRUD feedback:** No additional DELETE endpoint was added because it would not map to a specific Week 2 need. The existing POST and PATCH endpoints cover the required create and update operations identified by the downstream partner.
