## Deploy

Minimum specs i've tested this with on Vultr with a Docker application running on Ubuntu 24.04

- Cores 1 vCPU
- Memory 1 GB
- Storage 25 GB

---

Read all the steps before you start.

1. SSH into the server
2. Install git https://git-scm.com/downloads/linux
3. Clone this repo `git clone https://github.com/matthewbub/matthewbub.com.git`
4. Follow the [Docker steps](#docker-steps) below
5. Configure the [Cloud-level Firewall](#vultr) rules in Vultr
6. Configure the [Host-level Firewall](#ufw) rules via UFW
7. Install nginx

## Docker steps

- Build: `docker build -t matthewbub .`
- If you have a running container, stop it with `docker ps` to find the container ID, then `docker kill <container_id>`
- Remove the old container if needed: `docker rm <container_id>`
- Rebuild after changes: `docker build -t matthewbub .`
- Run: `docker run -p 8090:8090 matthewbub`

## Firewall rules

1. Vultr Firewall: Block unwanted traffic early (major ports/protocols)
2. UFW: Fine-grained control and application-specific rules

### Vultr

Add these firewall rules to the Vultr instance

- Location: At the infrastructure/network level, before traffic reaches your server
- Scope: Applied to the entire VPS from Vultr's network

| Port        | Protocol | Action | Source       | What it does                                                            |
| ----------- | -------- | ------ | ------------ | ----------------------------------------------------------------------- |
| **22**      | TCP      | accept | 0.0.0.0/0    | Allows SSH access from anywhere (used for remote login and management). |
| **80**      | TCP      | accept | 0.0.0.0/0    | Allows HTTP traffic (unencrypted websites).                             |
| **443**     | TCP      | accept | 0.0.0.0/0    | Allows HTTPS traffic (secure websites).                                 |
| **8090**    | TCP      | accept | 0.0.0.0/0    | Allows access to your Go web server from anywhere.                      |
| **8090**    | TCP      | accept | `YOUR_IP/32` | (Optional) Restricts access to the Go server to your IP only (safer).   |
| **0–65535** | any      | drop   | 0.0.0.0/0    | Denies all other incoming traffic not explicitly allowed above.         |

### UFW

- Location: On your actual server/VPS operating system
- Scope: Controls traffic after it reaches your server

Run these commands to set the same rules at the server level.

```sh
sudo ufw --force reset    # Clear all existing rules
sudo ufw allow 22         # SSH access
sudo ufw allow 80         # HTTP traffic
sudo ufw allow 443        # HTTPS traffic
sudo ufw allow 8090       # Custom application port
sudo ufw enable           # Activate the firewall
```

## Nginx

```sh
# ubuntu specific
sudo apt install nginx
sudo apt update
sudo apt install nginx
sudo systemctl status nginx
sudo vim /etc/nginx/sites-available/mattbub.com
```

then within the file, write

```
server {
    listen 80;
    server_name mattbub.com www.mattbub.com;

    location / {
        proxy_pass http://localhost:8090;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

the, enable the site and restart nginx

```
sudo ln -s /etc/nginx/sites-available/mattbub.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Cloudflare

I'm using a domain hosted on Cloudflare. If you're domain is hosted elsewhere, this won't be applicable.

- Navigate to SSL/TLS -> Edge Certificates.
- Scroll to "Always Use HTTPS" switch and ensure it is enabled.

## Page Counter

Uses a session browser cookie with a TTL of 5 mins. **Y?** I opted for this route over tracking IPs because if you and your friend were both on the site and are in the same room theres a good chance you'll fall under the same IP and thus would only count as one page view.
