
# 222191  Naliaka Patience Ovamba Retrospective Report

## 1. The Hardest Part of the Lifecycle

For our team, the hardest stage was Integration. We depended on another team's application, but getting the two systems to communicate was not always reliable. Most labs were done during online classes, so team members were in different places and on different networks. We used Cloudflare tunnel links to access each other's APIs, but the partner's link sometimes failed to resolve. On our side, as the team providing an API, we also had to create new Cloudflare links when the old ones stopped working or changed.

This made it difficult to know whether a failed request was caused by our code, the partner's server or the network. 

## 2. One Real Cross-Team Issue

A major issue happened when we were integrating with StudySync, our upstream partner. We used the Cloudflare tunnel URL they had shared, but the hostname could not be resolved. Our Jua Kali Connect backend therefore could not reach their API. At first, it was difficult to tell whether the problem was in our code or the connection to their server.

After checking the URL, we found that the tunnel was not resolving. We switched to a reachable URL while both applications were connected to the same LAN. With both teams on the same network, the partner URL worked and we could retrieve the member information. This was mainly a connectivity problem rather than a bug in one team's code.

I also had problems testing POST requests. After investigating, I realised that the failures had more than one possible cause. The connection was sometimes unstable, and I was also using table names that did not match those on the partner's server. This made it harder to identify why a request was failing. We had to check the connection and confirm that we were using the correct names when communicating with the other system.

The teams worked through the connection issue by changing how we accessed the partner API and using the same LAN. 

## 3. What I Would Design Differently

If I started again, I would find out much earlier how we planned to use data from the partner system. We should have agreed during planning which information we needed, which endpoint would provide it and how the returned fields would fit into our application. We only understood some of these details properly when we reached integration, which meant considering changes quite late in development.

I would also agree on table names and request and response formats with the partner team before testing POST requests. For online sessions, I would plan how we would access each other's APIs instead of depending on temporary tunnel links without a backup arrangement. 


## 4. My Contribution

I would rate my contribution 6/10. Much of my work was around the StudySync integration. I worked on the Jua Kali Connect backend endpoint that requests member information and connected that information to the Customer Dashboard. I tested requests using PowerShell, checked the partner URL when it failed and worked through the changes needed to connect through the same LAN.

I helped document the integration in `INTEGRATION_LOG.md` and prepare the related presentation points. 

I did not personally handle every part of the AIP labs. Other group members carried parts of the work shown in our presentation, including areas I was not directly responsible for, such as parts of monitoring, security and versioning. I also depended on their contributions. I chose 6 rather than 10 because I made a meaningful contribution and took responsibility for specific tasks, but the project was a team effort and other members handled work that I did not.
