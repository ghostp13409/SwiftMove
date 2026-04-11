# SwiftMove Railway Deployment Guide

This guide explains how to deploy the SwiftMove microservices and React frontend to Railway.

## 🚀 Overview

The system consists of:
- **Infrastructure:** Postgres, RabbitMQ, Eureka Server.
- **Backend Microservices:** API Gateway, Auth, User, Client, Driver, Location, Trip, Payment, Notification.
- **Frontend:** React (Vite) Dashboard.

---

## 🛠 Prerequisites

1.  A [Railway](https://railway.app/) account.
2.  Your GitHub repository linked to Railway.

---

## 🏗 Step 1: Infrastructure Setup

### 1. Postgres Database
1.  In your Railway project, click **+ New** > **Database** > **Add PostgreSQL**.
2.  Railway will automatically provide `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, and `PGPASSWORD`. Our microservices are already configured to use these.

### 2. RabbitMQ
1.  Click **+ New** > **Database** > **Add RabbitMQ**.
2.  Railway will provide `RABBITMQ_HOST`, `RABBITMQ_PORT`, etc.
3.  **Note:** You might need to manually map these in the Shared Variables if the names differ.

### 3. Eureka Server
1.  Click **+ New** > **GitHub Repo** > Select your repo.
2.  **Root Directory:** `src/backend/eureka-server`.
3.  Railway should detect the `Dockerfile`.
4.  Under **Variables**, ensure `PORT` is set (Railway does this automatically).
5.  Go to **Settings** > **Networking** > **Generate Domain**. This will be your public Eureka URL.
6.  **Internal URL:** Note the internal hostname (e.g., `eureka-server.railway.internal`).

---

## 📡 Step 2: Backend Microservices

For **EACH** microservice (API Gateway, User, etc.):

1.  Click **+ New** > **GitHub Repo** > Select your repo.
2.  **Root Directory:** `src/backend/<service-name>` (e.g., `src/backend/api-gateway`).
3.  **Variables:**
    - `EUREKA_URI`: Set this to your Eureka internal URL: `http://eureka-server.railway.internal:8761/eureka`
    - `SPRING_CONFIG_IMPORT`: (Optional) `optional:file:../config/application.properties` (If you use the shared config file).
    - **Note:** Railway's Postgres and RabbitMQ variables are automatically shared if they are in the same project.

### Special Case: API Gateway
- Generate a public domain for the `api-gateway`. This will be the entry point for your frontend.
- Example: `https://api-gateway-production.up.railway.app`

---

## 💻 Step 3: Frontend Deployment

1.  Click **+ New** > **GitHub Repo** > Select your repo.
2.  **Root Directory:** `src/swiftmove-dashboards`.
3.  **Variables:**
    - `VITE_API_BASE_URL`: Set this to your **API Gateway's Public URL**.
      Example: `https://api-gateway-production.up.railway.app`
4.  Railway should detect it as a Node.js project. Ensure the build command is `npm run build` and start command is `npm run preview` or similar (Vite default).

---

## 📝 Configuration Summary

| Variable | Description | Example Value |
| :--- | :--- | :--- |
| `EUREKA_URI` | Internal URL for service discovery | `http://eureka-server.railway.internal:8761/eureka` |
| `VITE_API_BASE_URL` | Frontend link to Backend | `https://api-gateway-production.up.railway.app` |
| `PGHOST` / `PGPORT` | Postgres connection details | (Automatically set by Railway) |
| `RABBITMQ_HOST` | RabbitMQ connection details | (Automatically set by Railway) |

---

## ⚠️ Important Notes

- **Build Context:** If Railway fails to find the `../config/application.properties` during build, it will use the defaults in the individual `application.properties`. You can override any property by adding it as an Environment Variable in the Railway dashboard (e.g., `SPRING_DATASOURCE_URL`).
- **Startup Order:** Infrastructure (Postgres, RabbitMQ, Eureka) should be running before the business services start.
- **Memory Limits:** Microservices can be memory-intensive. You might need to adjust the plan if services crash with OutOfMemory errors.

---

## ✅ Verification

1.  Check the **Eureka Dashboard** (via its public domain) to see if all services have registered.
2.  Test the **API Gateway** health check: `https://your-gateway-url/actuator/health`.
3.  Open the **Frontend** URL and try to log in.
