# SwiftMove

## Technical Documentation Report

**Parth**
**Annlin**
**Carlos**

**INFO3220**

---

## 1. Executive Summary

SwiftMove is a microservice-based moving platform with a React dashboard frontend and a Spring Boot 4 / Spring Cloud 2025.1 backend. The backend uses Eureka for service discovery and Spring Cloud Gateway as the single external entry point. Core business domains implemented include authentication/users, clients & move-requests, drivers & offers/vehicles, trips & matching, and addresses with geocoding.

---

## Tech Stack

- **Backend:** Java 21, Spring Boot, Spring
- **Service Discovery:** Spring Cloud Netflix Eureka
- **API Gateway:** Spring Cloud Gateway
- **Frontend:** Vite + React 18 + TypeScript
- **Database:** PostgreSQL (via Docker)
- **Geocoding:** Nominatim (OpenStreetMap)
- **Messaging Broker:** RabbitMQ (planned for async communication, not yet implemented)
- **Microservices:** Docker Compose for local orchestration (not fully utilized yet)
- **Build Tool:** Maven
- **Testing:** JUnit

## 2. Repository Layout

### Backend Microservices

Located in `src/backend/service`, plus infrastructure:

- `src/backend/api-gateway`
- `src/backend/eureka-server`
- `src/backend/config-service` — config server, not fully wired into clients

### Frontend Dashboard

- `src/swiftmove-dashboards` — Vite / React / TypeScript / shadcn / Tailwind

---

## 3. Runtime Topology (Local)

### External Entry Point

- **API Gateway:** http://127.0.0.1:8000 — CORS configured for Vite/React dev ports

### Service Discovery

- **Eureka Server:** runs on port 8761
- Services register with Eureka and are routed by the gateway via `lb://<service-name>`

### Database

- `docker-compose.yml` provisions Postgres on port 5432
- Several services connect to:
  `jdbc:postgresql://127.0.0.1:5432/postgres`
- Uses `ddl-auto=update` — dev-friendly but riskier for production

---

## 4. Backend Services

### 4.1 api-gateway

**Purpose:** edge routing, intended JWT enforcement, and CORS
**Port:** 8000

#### Routing

- `/auth/**` → auth-service
- `/users/**` → user-service
- `/trips/**` → trip-service
- `/addresses/**` → location-service
- `/clients/**` → client-service
- `/drivers/**` → driver-service

#### JWT Filter

Implemented in `JwtAuthenticationFilter` validates `Authorization: Bearer` tokens except for public endpoints. It is implemented as a `GatewayFilter`; ensure it is actually attached to routes or implemented as a global filter, otherwise auth may not be enforced at the gateway.

#### JWT Secret Risk

Gateway uses a hard-coded base64 secret constant in `JwtUtil`, while `auth-service` uses `jwt.secret` from config. These values do not obviously match.

---

### 4.2 eureka-server

**Purpose:** service registry using Netflix Eureka
**Port:** 8761

Configured to:

- Not register itself
- Not fetch registry

---

### 4.3 config-service

**Purpose:** Spring Cloud Config Server
**Port:** 8888

Configured with:

- `spring.cloud.config.server.git.uri` pointing to a tree URL (not typically cloneable)

Note: No evidence of other services using config-server as a config client yet.

---

### 4.4 auth-service

**Purpose:** authentication and token issuance
**Port:** 8090

#### Endpoints (`/auth`)

- `POST /auth/register` — creates user via user-service, returns token + user info
- `POST /auth/login` — validates password hash, returns token + user info
- `POST /auth/logout` — stateless; client deletes token
- `GET /auth/check` — validates token
- `GET /auth/me` — extracts userId from JWT and fetches user details

#### Inter-service Dependency

- Feign → user-service (`createUser`, `getUserByEmail`, `getUserById`)

#### Security Config

- Spring Security is configured as **permit all**
- Enforcement expected via gateway or callers

---

### 4.5 user-service

**Purpose:** user CRUD and lookup
**Port:** 8070

#### Endpoints (`/users`)

- `GET /users`
- `GET /users/{id}`
- `GET /users/byEmail?email=...`
- `POST /users`
- `PUT /users/{id}`
- `DELETE /users/{id}`

#### Model

- Table: `users`
- Includes: role (Postgres enum), addressId, timestamps

#### Security Config

- Currently permit all
- Must be reconfigured for production

#### Mismatch to Fix

- `AddressClient` uses:
  - `@FeignClient(name='address-service')`
  - path `/address/{id}`
- Actual service:
  - `location-service`
  - path `/addresses/{id}`

---

### 4.6 location-service

**Purpose:** addresses and automatic geocoding
**Port:** 8050

#### Endpoints (`/addresses`)

- Full CRUD: GET, GET/{id}, POST, PUT/{id}, DELETE/{id}

#### Model

- Table: `addresses`
- Fields: address lines, city, state, country, postal, latitude, longitude, timestamps

#### Geocoding

- Uses Nominatim (OpenStreetMap)
- Custom User-Agent
- Fallback from full query to simpler query

---

### 4.7 client-service

**Purpose:** client views, move-requests, and luggage management
**Port:** 8002

#### Key Endpoints (`/clients`)

- `/clients/me`
- `/clients/move-requests`
- `/clients/move-requests/active`
- `/clients/move-requests/{id}` (CRUD)
- `/clients/move-requests/luggage*`

#### Inter-service Dependencies

- Feign → auth-service (`/auth/me`)
- Feign → location-service (coordinates for distance)

#### Model

- Table: `move_requests`
- Includes: address IDs, cached lat/lon, distance, maxBudget, status, hasFurniture

#### Distance Calculation

- Uses Haversine formula after fetching coordinates

---

### 4.8 driver-service

**Purpose:** driver data, vehicles, offers, trip creation
**Port:** 8003

#### Key Endpoints (`/drivers`)

- Drivers: `/drivers`, `/drivers/{id}`, `/drivers/me`
- DriverInfo: `/drivers/info/*`
- Vehicles: `/drivers/vehicles*`, `/drivers/vehicle-types*`
- MoveOffers: `/drivers/move-offers*`

#### Inter-service Dependencies

- Feign → auth-service
- Feign → client-service
- Feign → trip-service
- Feign → user-service

#### MoveOffer Flow — Creating

- Prevents duplicate offers
- Validates furniture capability
- Recalculates price
- Updates request status

#### MoveOffer Flow — Accepting

- Sets offer to ACCEPTED
- Updates request status
- Creates trip (SCHEDULED)

---

### 4.9 trip-service

**Purpose:** trips, matching engine, budget suggestion
**Port:** 8060

#### Endpoints (`/trips`)

- `GET /trips`
- `GET /trips/{id}`
- `POST /trips`
- `GET /trips/client/{clientId}`
- `GET /trips/driver/{driverId}`
- `GET /trips/allTrips`
- `PATCH /trips/{id}/status`
- `GET /trips/browse-requests`
- `POST /trips/suggest-budget`

#### Inter-service Dependencies

- Feign → client-service
- Feign → driver-service
- Feign → location-service
- Feign → user-service

#### Matching Design

- Uses `MoveRequestMatcher` strategies
- Filters requests by:
  - status
  - existing offers
  - vehicle compatibility

#### Budget Suggestion

- Uses distance × avg price/km
- Rates vary for furniture vs general

---

## 5. Frontend Dashboard

### Stack

- **FrontEnd**: Vite + React 18 + TypeScript
- shadcn-ui / Radix UI
- Axios + React Query
- Role normalization utilities

### API Integration

- `API_BASE_URL = http://127.0.0.1:8000`
- JWT stored in `localStorage`
- On 401 → logout + redirect

### Notable Endpoints

- `/auth/*`
- `/clients/*`
- `/drivers/*`
- `/trips/*`
- `/addresses/*`
- `/users/*`

---

## 6. Data Model

Shared Postgres instance.

### Core Tables

- `users`
- `addresses`
- `move_requests`
- `move_offers`
- `move_trips`
- `driver_infos`
- `vehicles`
- `vehicle_types`
- `luggage_entries`
- `luggage_types`

### Schema Note

- Uses Postgres enums:
  - `move_status_enum`
  - `vehicle_type_enum`
  - `luggage_type_enum`

Recommended: use **Flyway or Liquibase** for migrations.

---

## 7. Security Model

### Current State

- JWT issued by auth-service
- Sent via frontend to gateway
- Backend services mostly `permit all`

### Gaps and Risks

- JWT secret mismatch
- Gateway filter may not be applied
- Feign calls not consistently authenticated

---

## 8. Operational & Deployment Notes

- `docker-compose.yml` runs:
  - Postgres
  - Eureka

- Other services are commented out

- Uses `127.0.0.1` for connections
  - ❗ Will not work in containers
  - Must use service hostnames (Docker DNS)
