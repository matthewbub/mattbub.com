# mattbub.com

## Local dev

- Run Go server - `go run main.go`
- Run Web server - `pnpm run dev`

## Prod

See [Deploy](/Deploy.md) docs for prod

## Versioning

Visit https://mattbub.com/version.txt to get the latest version in prod

Currently, we're using the latest commit from `main` at the time of build. I currently don't have a need for the X.X.X format right now.

## Page Counter

Uses a session browser cookie with a TTL of 5 mins. **Y?** I opted for this route over tracking IPs because if you and your friend were both on the site and are in the same room theres a good chance you'll fall under the same IP and thus would only count as one page view.

## query messages in prod

```sh
docker exec -it <container_name> sqlite3 /root/data/app.db "SELECT * FROM contact_form_submissions LIMIT 10;"
```
