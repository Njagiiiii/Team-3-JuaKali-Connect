#Jua Kali Connect API — Endpoint List

Team 3

Rose Njagi- 221363
Patience Naliaka Ovamba- 222191
Ryan Amani- 221741
Sean Ochieng

| Method | Path                                        | Purpose                                                      | Maps to Need                                                                                                                                      |
| ------ | ------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| POST   | `/sessions`                                 | Create an authenticated session for a user.                  | ArtistsVenue Funds needs to authenticate users in order to allow users to securely access Jua Kali Connect services.                              |
| GET    | `/artisans?search={term}&service={service}` | Return artisans matching the search term and service filter. | ArtistsVenue Funds needs to search artisan and service data in order to allow users to find suitable artisans for their event-related needs.      |
| GET    | `/artisans/{id}`                            | Return the details of a specific artisan.                    | ArtistsVenue Funds needs to search artisan and service data in order to allow users to find suitable artisans for their event-related needs.      |
| POST   | `/bookings`                                 | Create a new booking for a selected artisan and service.     | ArtistsVenue Funds needs to create booking records in order to allow users to book services from available artisans.                              |
| PATCH  | `/bookings/{id}`                            | Update an existing booking's information or status.          | ArtistsVenue Funds needs to update booking records in order to allow users to change existing bookings and keep booking information synchronized. |
