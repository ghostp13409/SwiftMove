# SwiftMove Oracle Cloud Deployment Guide (Always Free Tier)

This guide explains how to deploy the complete SwiftMove system (microservices + frontend) on a single Oracle Cloud Ampere A1 compute instance, taking advantage of their generous free tier (4 ARM cores, 24GB RAM).

## 🚀 Architecture on Oracle Cloud
We will use **Docker Compose** to spin up all 10+ microservices, Postgres, RabbitMQ, and the React frontend in a single VM. Since the Ampere instances have 24GB of RAM, this is more than enough to handle the entire Java Spring Boot microservice suite.

---

## 🛠 Step 1: Create the Oracle Instance

1. Go to your Oracle Cloud Console.
2. Navigate to **Compute > Instances** and click **Create Instance**.
3. **Image and Shape:**
   - **Image:** Select **Ubuntu 22.04** (or Canonical Ubuntu).
   - **Shape:** Click "Change Shape", select **Ampere (ARM)** -> **VM.Standard.A1.Flex**.
   - **OCPUs:** Set to 4.
   - **Memory:** Set to 24 GB.
4. **Networking:** Choose an existing VCN or create a new one. Ensure you assign a **Public IPv4 address**.
5. **SSH Keys:** Save your generated private key so you can SSH into the machine!
6. Click **Create**.

---

## 🌍 Step 2: Open Ingress Ports (Firewall)

Oracle Cloud blocks almost all ports by default. We need to open ports for the API Gateway and the Frontend.

1. On your instance details page, click on your **Subnet** link.
2. Click on the **Default Security List**.
3. Add **Ingress Rules** for the following ports:
   - **Source CIDR:** `0.0.0.0/0`
   - **Destination Port Range:** `80` (Frontend)
   - **Destination Port Range:** `8000` (API Gateway)
   - **Destination Port Range:** `8761` (Eureka Dashboard - Optional, but useful for debugging)

Also, run these commands inside the instance later to open the Ubuntu firewall:
```bash
sudo iptables -I INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT -p tcp --dport 8000 -j ACCEPT
sudo netfilter-persistent save
```

---

## 💻 Step 3: Install Docker and Docker Compose

SSH into your new Oracle instance:
```bash
ssh -i /path/to/private-key ubuntu@<YOUR_INSTANCE_PUBLIC_IP>
```

Install Docker:
```bash
sudo apt update
sudo apt install -y docker.io docker-compose-v2 git
sudo systemctl enable --now docker
# Add your user to the docker group so you don't need sudo for docker commands
sudo usermod -aG docker $USER
newgrp docker
```

---

## 📦 Step 4: Clone and Configure

Clone your repository to the VM:
```bash
git clone https://github.com/ghostp13409/SwiftMove.git
cd SwiftMove
```

Create a `.env` file to configure the frontend's API Gateway connection. **Replace `<YOUR_INSTANCE_PUBLIC_IP>` with your Oracle machine's actual public IP address!**

```bash
cat > .env <<EOF
# The URL where the frontend will send requests.
# It must point to your API Gateway port (8000).
VITE_API_BASE_URL=http://<YOUR_INSTANCE_PUBLIC_IP>:8000
EOF
```

---

## 🚀 Step 5: Build and Deploy

The `docker-compose.yml` has been updated to automatically map all environments to internal Docker hostnames (`postgres`, `rabbitmq`, `eureka-server`).

Run everything:
```bash
# This will take a few minutes the first time to compile all Spring Boot apps
docker compose up -d --build
```

### Checking the Status

You can monitor the startup process:
```bash
docker compose ps
docker compose logs -f api-gateway
```

*Note: Spring Boot services take some time to start and register with Eureka.*

---

## ✅ Verification

Once all containers are "Up" and healthy:
1. **Frontend:** Open `http://<YOUR_INSTANCE_PUBLIC_IP>` in your browser.
2. **API Gateway:** Test `http://<YOUR_INSTANCE_PUBLIC_IP>:8000/actuator/health`
3. **Eureka:** Test `http://<YOUR_INSTANCE_PUBLIC_IP>:8761` to ensure all microservices have successfully registered.

## 🛑 Troubleshooting

- **Containers crashing:** Use `docker compose logs <service-name>` to check for Java errors.
- **Frontend can't reach Backend:** Open your browser's DevTools (F12) -> Network tab. Ensure the requests are going to your `http://<PUBLIC_IP>:8000/...` and not `localhost`. Ensure port 8000 is open in Oracle's VCN Security Rules.
