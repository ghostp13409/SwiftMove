# SwiftMove 🚚

### _Your Rides. Your Rates. Your Rules._

**SwiftMove** is a decentralized, fair marketplace designed to revolutionize house moving services. Built _by students, for students_, it eliminates predatory platform fees and returns control to the people actually doing the work—drivers and clients.

---

## 🌟 The Problem & Our Solution

### The "Moving Trap"

Traditional platforms like Uber or expensive moving services often fail students:

- **Predatory Fees:** Platforms take up to 40%, forcing drivers to extort tips and inflating costs for clients.
- **Lack of Control:** Algorithms set prices, ignoring the actual complexity of moving.
- **Information Asymmetry:** Drivers don't know luggage volume until they arrive; clients don't know if a vehicle is compatible.

### The SwiftMove Way

- **Decentralized Pricing:** Drivers set their 'Price per KM'; Clients set their 'Max Budget'.
- **Blind Negotiation:** Prevents price gouging—matches only occur when the math works for _both_ parties.
- **Assured Compatibility:** 3D luggage volume is validated against vehicle capacity _before_ an offer is made.
- **Sustainability First:** A lean, microservices architecture with platform fees capped at ~2% just to cover server costs.

---

## 🛠 Tech Stack

### Backend (Microservices)

- **Framework:** Java 21, Spring Boot 3.4+
- **Orchestration:** Spring Cloud (Eureka Discovery, API Gateway)
- **Database:** PostgreSQL (with a "Database per Service" approach)
- **Messaging:** RabbitMQ for asynchronous communication
- **Geocoding:** Nominatim (OpenStreetMap) for address coordinates
- **Security:** JWT-based stateless authentication

### Frontend (Dashboards)

- **Framework:** React 18, Vite, TypeScript
- **Styling:** Tailwind CSS, Shadcn UI
- **State Management:** TanStack Query (React Query)
- **Icons:** Lucide React

---

## 🏗 System Architecture

SwiftMove is built on a modular **Domain-Driven Design (DDD)** architecture:

- **`api-gateway`**: Entry point for all external requests (Port 8000).
- **`auth-service`**: Handles IAM, JWT issuance, and security.
- **`eureka-server`**: Service discovery and registry.
- **`user-service`**: Manages user profiles and roles (Client, Driver, Admin).
- **`client-service`**: Manages move requests and luggage categorization.
- **`driver-service`**: Manages driver profiles, vehicles, and offers.
- **`location-service`**: Handles address geocoding and Haversine distance calculations.
- **`trip-service`**: Orchestrates the matching engine and trip lifecycle.
- **`payment-service`**: Handles secure transactions.

---

## 🚀 Getting Started

### Prerequisites

- [Docker](https://www.docker.com/get-started) & [Docker Compose](https://docs.docker.com/compose/install/)
- [Java 21 JDK](https://adoptium.net/temurin/releases/?version=21)
- [Node.js](https://nodejs.org/) (for local frontend development)

### One-Click Launch (Docker)

1. Clone the repository.
2. Create an `.env` file based on `example.env`.
3. Run the following command:
   ```bash
   docker-compose up -d
   ```
4. Access the dashboards at `http://localhost:3000` and the API Gateway at `http://localhost:8000`.

### Manual Backend Setup

If you want to run services individually:

```bash
# Build all services
mvn clean install

# Run specific service (e.g., Auth)
cd src/backend/auth-service
mvn spring-boot:run
```

---

## 📸 Demo & Screenshots

|                   Client Dashboard                   |                   Driver Dashboard                    |
| :--------------------------------------------------: | :---------------------------------------------------: |
| ![Client Dashboard](docs/demo_docs/media/image2.png) | ![Driver Dashboard](docs/demo_docs/media/image13.png) |

_For a full walkthrough, check our [User Guide](docs/demo_docs/user_guides.md)._

---

## 👥 The Team

- **Parth Gajjar** - Lead Developer (System Design & Orchestration)
- **Carlos Flores** - Architect (R&D & Frontend Infrastructure)
- **Annlin George** - UX Engineer (Client Experience & Backend)

---

<!-- TODO: Add License -->
