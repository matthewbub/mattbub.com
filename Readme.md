## Docker steps

- Build: `docker build -t matthewbub .`
- If you have a running container, stop it with `docker ps` to find the container ID, then `docker kill <container_id>`
- Remove the old container if needed: `docker rm <container_id>`
- Rebuild after changes: `docker build -t matthewbub .`
- Run: `docker run -p 8090:8090 matthewbub`

## Page Counter

Uses a session browser cookie with a TTL of 5 mins. **Y?** I opted for this route over tracking IPs because if you and your friend were both on the site and are in the same room theres a good chance you'll fall under the same IP and thus would only count as one page view.
