Njagi Rose Melisa Kendi - 221363 - ICS 2A - Team 3
Github link - https://github.com/Njagiiiii/Team-3-JuaKali-Connect

# Retrospective Report – Jua Kali Connect Project

## 1. The Hardest Part of the Lifecycle

The hardest stage of the Jua Kali Connect project for me was Integration. As the Backend Lead for Team 3, I initially thought that once our API endpoints were working locally, connecting our system to other teams would be relatively straightforward. However, I realised that having a functioning API and having an API that works reliably with another team's system are two different things.

Our team was part of an integration ring where we consumed data from Team 2 (StudySync) and provided data to Team 4 (ArtistsVenue Fund). This meant that we had to consider not only whether our endpoints worked, but also whether other teams could successfully communicate with them. We had to manage API keys, endpoint URLs, response formats and server availability. One challenge was using Cloudflare Tunnel to expose our local server so that partner teams could access it. The temporary tunnel URLs could change, meaning that an old URL in our environment configuration could prevent communication between the systems.

I also learnt that integration problems are not always caused by incorrect code. Sometimes the problem is an outdated URL, an incorrectly configured environment variable or a mismatch between what one API sends and what another expects. This stage required repeated communication, testing and troubleshooting. It taught me to think beyond my own code and consider the entire system.

## 2. One Real Cross-Team Issue

One issue I experienced during integration involved connecting our API to Team 2's StudySync service. Our system needed to retrieve member information from their API. StudySync exposed a `GET /api/members` endpoint, while we exposed the information through our own `GET /api/partner/members` endpoint.

During preparation for the integration demonstration, we had to deal with changing Cloudflare Tunnel URLs. The URL we had previously been using was different from the newer tunnel address provided during setup. This meant that our existing partner configuration could point to an outdated address, preventing our system from reaching the current StudySync service.

I identified the problem by checking the partner URL configured in our environment and comparing it with the current tunnel address. The solution was to use the updated partner address, ensure the correct endpoint and API key were configured, and restart our server before testing the request again. This experience showed me why environment configuration is important when working with distributed systems.

We also had to make sure our integration could handle situations where the partner service was unavailable. Rather than allowing the endpoint to crash, we implemented retries, a timeout and a fallback using the last successfully retrieved member data. This allowed our API to return saved data with a `stale` indicator when the live service could not be reached.

The main lesson I took from this experience was that integration requires continuous coordination. A change in one team's environment can affect another team's ability to use its service, even when the code itself has not changed.

## 3. What I Would Design Differently

If I were starting Jua Kali Connect again, I would place greater emphasis on agreeing on API contracts and testing integration much earlier. I would want both teams to agree on endpoint paths, required headers, response structures and error formats before implementing the integration. This would reduce the time spent trying to determine whether a problem originates from our code or a partner's API.

I would also introduce integration tests earlier in the project instead of relying heavily on manual testing during later weeks. For example, I would test the partner connection, API-key authentication and expected response structure as soon as the first endpoints were available. This would make it easier to identify configuration and compatibility problems before they became urgent.

Another thing I would keep is our use of environment variables for sensitive configuration. Keeping API keys and partner URLs outside the committed source code was an important security practice. I would also retain our monitoring and versioning implementations because they made the system easier to maintain.

During Week 13, we introduced API versioning by keeping the original artisan endpoint available while introducing `/api/v2/artisans`. The original version continued returning a bare array, while version 2 returned a structured response containing `data` and `count`. We also introduced deprecation headers to notify consumers that the older version would eventually be retired. I would keep this approach because it allows changes to be introduced without immediately breaking existing consumers.

## 4. My Contribution

I would rate my contribution to this project **8/10**. As the Backend Lead, I took responsibility for understanding and developing the backend side of Jua Kali Connect and ensuring that our API could communicate with other systems.

My work involved contributing to the artisan, booking and session API functionality, working with the Express server, configuring API-key authentication and rate limiting, and participating in partner integration. I also worked on exposing our API through Cloudflare Tunnel, testing partner requests and troubleshooting connectivity and configuration issues.

As the project progressed, I participated in implementing request monitoring and the protected `/stats` endpoint. This allowed us to record request methods, paths, status codes, response times and caller identifiers without exposing actual API keys. I also worked on API versioning, maintaining compatibility between the original and newer artisan endpoints, and ensuring that the changes were documented.

I contributed to testing, reviewing API responses, preparing documentation and getting the backend ready for the final demonstration. However, I also recognise that my contribution was not perfect. Some testing and troubleshooting happened later than they should have, and I sometimes needed assistance when dealing with unfamiliar implementation details or unexpected failures. Other team members also contributed to areas of the project that I did not independently handle, and their work helped us complete the overall system.

Overall, this project taught me that being a Backend Lead involves more than writing endpoints. It requires responsibility for reliability, security, communication, documentation and compatibility with other systems. I have gained a better understanding of how individual components work together in a real software development lifecycle, and I would approach future projects with earlier testing, clearer agreements and more consistent integration throughout development.
