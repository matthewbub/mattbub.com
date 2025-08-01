Summary of Steps:

- Build: `docker build -t matthewbub .`
- If you have a running container, stop it with `docker ps` to find the container ID, then `docker kill <container_id>`
- Remove the old container if needed: `docker rm <container_id>`
- Rebuild after changes: `docker build -t matthewbub .`
- Run: `docker run -p 8090:8090 matthewbub`
