# SwiftMove Google Cloud Platform (GCP) Deployment Guide (Free Tier)

This guide explains how to deploy the SwiftMove system (microservices + frontend) on Google Cloud Platform (GCP) using the "Always Free" Compute Engine tier.

## ⚠️ CRITICAL WARNING: RAM Limitations on GCP Free Tier
The GCP "Always Free" tier provides one **e2-micro** virtual machine instance per month. 
- **Specs:** 2 vCPUs, **1 GB of RAM**.
- **The Problem:** You have a Postgres database, RabbitMQ, a React frontend, and **10 Spring Boot Java microservices**. Java microservices typically consume 250MB - 512MB of RAM *each*. Running all of this on 1 GB of RAM will immediately cause the server to crash with **Out Of Memory (OOM)** errors.
- **The Solution:** We **must** create a large Swap file (using the hard drive as slow RAM). This will prevent crashes, but **the application will run very slowly** because disk I/O is much slower than actual RAM. 

*(Note: This is why the Oracle Cloud Free Tier with 24GB RAM was highly recommended for this specific architecture).*

---

## 🛠 Step 1: Create the GCP Free Tier Instance

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Navigate to **Compute Engine** > **VM instances** and click **Create Instance**.
3. **Name:** `swiftmove-vm`
4. **Region & Zone:** You **MUST** select one of the following regions to qualify for the Free Tier:
   - `us-west1` (Oregon)
   - `us-central1` (Iowa)
   - `us-east1` (South Carolina)
5. **Machine Configuration:**
   - Series: **E2**
   - Machine type: **e2-micro** (2 vCPU, 1 GB memory)
6. **Boot Disk:** 
   - OS: **Ubuntu**
   - Version: **Ubuntu 22.04 LTS**
   - Boot disk type: **Standard persistent disk** (up to 30 GB is free). Set size to **30 GB**.
7. **Firewall:**
   - Check **Allow HTTP traffic**.
   - Check **Allow HTTPS traffic**.
8. Click **Create**.

---

## 🌍 Step 2: Open Custom Ports (VPC Firewall)

We need to open port 8000 for the API Gateway and 8761 for the Eureka Server.

1. In GCP Console, go to **VPC network** > **Firewall**.
2. Click **Create Firewall Rule**.
3. **Name:** `allow-swiftmove-ports`
4. **Targets:** `All instances in the network`
5. **Source IPv4 ranges:** `0.0.0.0/0`
6. **Protocols and ports:**
   - Check **tcp** and enter: `8000, 8761`
7. Click **Create**.

---

## 💻 Step 3: Connect and Setup Swap Space (Crucial!)

1. Go back to **Compute Engine** > **VM instances**.
2. Click the **SSH** button next to your `swiftmove-vm` instance to open a web terminal.

**First, we must create a 8GB Swap File so the microservices don't crash the server:**
```bash
sudo fallocate -l 8G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Make the swap file permanent across reboots
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Verify swap is active (you should see an 8GB swap space)
free -h
```

---

## 📦 Step 4: Install Docker and Docker Compose

```bash
sudo apt update
sudo apt install -y docker.io docker-compose-v2 git
sudo systemctl enable --now docker

# Add your user to the docker group
sudo usermod -aG docker $USER
newgrp docker
```

---

## 🚀 Step 5: Clone, Configure, and Deploy

1. **Clone the repository:**
```bash
git clone https://github.com/ghostp13409/SwiftMove.git
cd SwiftMove
```

2. **Configure the Frontend connection:**
Find your VM's **External IP address** from the GCP Compute Engine dashboard. Create the `.env` file and replace `<YOUR_GCP_EXTERNAL_IP>` with that IP:

```bash
cat > .env <<EOF
# The URL where the frontend will send requests.
VITE_API_BASE_URL=http://<YOUR_GCP_EXTERNAL_IP>:8000
EOF
```

3. **Start the application:**
```bash
# This will take a LONG time because of the limited CPU and RAM (using Swap)
docker compose up -d --build
```

### Monitoring Startup
Because we are relying heavily on swap space, the Spring Boot applications will take several minutes to compile and start up. You can monitor the progress:
```bash
docker compose ps
docker compose logs -f api-gateway
```

---

## ✅ Verification

Once all containers are finally running:
1. **Frontend:** Open `http://<YOUR_GCP_EXTERNAL_IP>` in your browser.
2. **API Gateway:** Test `http://<YOUR_GCP_EXTERNAL_IP>:8000/actuator/health`
3. **Eureka:** Test `http://<YOUR_GCP_EXTERNAL_IP>:8761` 

## 🛑 Troubleshooting

- **Server becomes completely unresponsive:** This means the 1GB RAM + 8GB Swap was still exhausted, or the disk I/O limit was reached. You may need to restart the VM from the GCP console. If this persists, running 10+ Spring Boot services on an e2-micro is practically impossible, and you will need to upgrade the VM (which costs money) or use the Oracle Cloud Free Tier.
- **Docker build fails with Error 137:** This is an Out Of Memory (OOM) error during compilation. Ensure the swap file was created successfully (`free -h`).
