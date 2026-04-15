# Cloudflare Tunnel Routing Fix

## Problem

Frontend loads from `https://swiftorg.me` but API calls to `https://api.swiftorg.me` return 404 errors. The Cloudflare tunnel was not properly routing traffic to the API Gateway.

## Root Cause

The Cloudflare tunnel was using token-based authentication without explicit ingress routing rules. Without a config file, the tunnel didn't know how to route:

- `api.swiftorg.me` → API Gateway
- `swiftorg.me` → Frontend

## Solution

### 1. Created Cloudflare Tunnel Config File

Created [`cloudflare-tunnel-config.yaml`](cloudflare-tunnel-config.yaml) with proper ingress routing rules:

```yaml
tunnel: swiftmove-tunnel
credentials-file: /etc/cloudflared/cred.json

ingress:
  # API Gateway - MUST come before frontend catch-all
  - hostname: api.swiftorg.me
    service: http://api-gateway:8000

  # Frontend routes
  - hostname: swiftorg.me
    service: http://frontend:3000

  - hostname: www.swiftorg.me
    service: http://frontend:3000

  # Catch-all for unmatched routes
  - service: http_status:404
```

**Key Points:**

- API Gateway route must come BEFORE frontend routes (order matters in Cloudflare)
- `http://api-gateway:8000` - Uses Docker internal DNS to reach the api-gateway service
- `http://frontend:3000` - Uses Docker internal DNS to reach the frontend service
- Credentials file path matches what Cloudflare tunnel expects

### 2. Updated Docker Compose

Modified [`docker-compose.yml`](docker-compose.yml) tunnel service:

```yaml
tunnel:
  image: cloudflare/cloudflared:latest
  container_name: swiftmove-tunnel
  restart: always
  command: tunnel --config /etc/cloudflared/config.yaml run
  environment:
    - TUNNEL_TOKEN=${CLOUDFLARE_TUNNEL_TOKEN}
  volumes:
    - ./cloudflare-tunnel-config.yaml:/etc/cloudflared/config.yaml:ro
  depends_on:
    - frontend
    - api-gateway
```

**Changes:**

- Added `--config /etc/cloudflared/config.yaml` to the command
- Mounted the config file as read-only volume
- Ensured dependencies are correct

## Traffic Flow

```
User Browser (swiftorg.me)
    ↓
Cloudflare Edge (Zero Trust Tunnel)
    ↓ (routes based on hostname)
    ├─→ api.swiftorg.me → api-gateway:8000
    │                      ↓
    │                    Spring Cloud Gateway
    │                      ↓
    │                    Microservices (auth, user, client, etc)
    │
    └─→ swiftorg.me → frontend:3000
                      ↓
                    React App
                      ↓
                    Makes API calls to api.swiftorg.me
```

## Deployment Instructions

1. **Stop current containers:**

   ```bash
   docker-compose down
   ```

2. **Rebuild and restart:**

   ```bash
   docker-compose up --build
   ```

3. **Verify tunnel is running:**

   ```bash
   docker logs swiftmove-tunnel | grep -i "tunnel"
   ```

4. **Test API connectivity:**
   ```bash
   # From your browser, open DevTools → Network tab
   # Try login/register
   # API calls should go to https://api.swiftorg.me/auth/**
   ```

## Troubleshooting

### API calls still returning 404

- Check tunnel logs: `docker logs swiftmove-tunnel`
- Verify config file is mounted: `docker exec swiftmove-tunnel cat /etc/cloudflared/config.yaml`
- Ensure API Gateway is healthy: `docker logs api-gateway`

### Frontend not loading

- Check that `frontend` service is running: `docker ps | grep frontend`
- Verify frontend port is 3000: `docker port frontend`
- Check Cloudflare tunnel logs

### Service discovery issues

- Ensure all services are on the same Docker network (default `default`)
- Check that Eureka registration is fixed (see EUREKA_FIX_SUMMARY.md)

## DNS Configuration Note

Ensure your Cloudflare DNS records are set up correctly:

- `swiftorg.me` → Points to Cloudflare tunnel
- `api.swiftorg.me` → Points to Cloudflare tunnel
- Both should route through the tunnel which then distributes to appropriate services
