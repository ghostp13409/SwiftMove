# SwiftMove: Project Context for Gemini

This document provides essential context and instructions for AI agents working on the **SwiftMove** project—a microservices-based platform designed to simplify house moving services.

---

## 🚀 Project Overview

**SwiftMove** is a full-stack application that connects clients looking to move with drivers who can provide transportation and moving assistance. The system is built using a modern microservices architecture, following Domain-Driven Design (DDD) principles.

### Architecture & Tech Stack
- **Backend:** Java 21, Spring Boot (3.4+), Spring Cloud (API Gateway, Eureka Discovery, Config Server).
- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Shadcn UI, TanStack Query.
- **Database:** PostgreSQL (with a "Database per Service" approach).
- **Orchestration:** Docker & Docker Compose.
- **Core Logic:**
    - **Geocoding:** Nominatim integration for address coordinates.
    - **Distance:** Haversine formula for air distance; matching logic based on Strategy Pattern.
    - **Matching:** Orchestrated via `trip-service` considering capacity, range, price, and furniture requirements.

---

## 📂 Directory Structure

- `src/backend/`: Contains individual Spring Boot microservices.
    - `api-gateway`: Entry point for all requests.
    - `auth-service`: IAM and security.
    - `eureka-server`: Service discovery.
    - `config-service`: Centralized configuration.
    - `client-service`: Manages move requests and luggage.
    - `driver-service`: Manages driver profiles and vehicles.
    - `location-service`: Handles addresses and geocoding.
    - `trip-service`: Orchestrates matching and trip lifecycle.
- `src/swiftmove-dashboards/`: The primary React frontend application.
- `Planning/`: DDD designs, ER diagrams, and business logic documentation.
- `docs/`: API endpoint documentation and changelogs.
- `Scripts/`: SQL migrations, seed data, and utility scripts.

---

## 🛠 Building and Running

### Prerequisites
- Java 21+
- Node.js (with `npm` or `bun`)
- Docker & Docker Compose
- Maven

### Infrastructure (Postgres & Eureka)
```bash
docker-compose up -d postgres eureka-server
```

### Backend Services
To build all services:
```bash
cd src/backend && mvn clean install
```
To run a specific service (e.g., `client-service`):
```bash
cd src/backend/client-service && mvn spring-boot:run
```
*Note: Ensure `eureka-server` and `config-service` are running before starting business services.*

### Frontend
```bash
cd src/swiftmove-dashboards
npm install
npm run dev
```

---

## 📏 Development Conventions

### Backend (Spring Boot)
- **DDD Compliance:** Respect the bounded contexts defined in `Planning/DDD_Microservices_Design.md`.
- **API Standards:** Use RESTful principles. Group controllers by resource.
- **DTOs:** Always use Data Transfer Objects (DTOs) for external communication.
- **Validation:** Use `jakarta.validation` annotations on DTOs.
- **Error Handling:** Use a centralized `@ControllerAdvice` for consistent error responses.

### Frontend (React)
- **Components:** Use Shadcn UI components located in `src/components/ui/`.
- **Styling:** Use Tailwind CSS utility classes. Avoid custom CSS unless necessary.
- **State Management:** Use TanStack Query (React Query) for server state and standard React hooks for local state.
- **Icons:** Use `lucide-react` for all icons.
- **Types:** Strictly type all props, state, and API responses.

### Integration
- **API Gateway:** All frontend calls should go through the API Gateway (port 8080 or as configured).
- **Geocoding:** Use the `location-service` for all address-related operations.

---

## 📝 Ongoing Tasks & Roadmap
- [ ] Complete containerization of all microservices in `docker-compose.yml`.
- [ ] Implement caching for pricing logic in `trip-service`.
- [ ] Integrate OSRM for road-accurate distance calculations.
- [ ] Finalize frontend integration for `suggest-budget` and `browse-requests` endpoints.

---

## 📖 Reference Documentation
- `Planning/DDD_Microservices_Design.md`: Detailed architecture.
- `AI_Notes/current_state.md`: Up-to-date implementation status.
- `docs/backend_endpoints.md`: API documentation.

---

## 🎨 Design Context

### Users
- **Clients:** Individuals or families moving homes. They need a stress-free, intuitive interface to manage luggage, budgets, and driver offers.
- **Drivers:** Independent moving professionals. They require a functional, high-utility dashboard to browse requests, manage vehicles, and track active trips.
- **Admins:** Platform oversight users who need clear data visualizations and efficient management of all system entities.

### Brand Personality
- **Professional:** Evokes trust and reliability in a high-stakes service (moving personal belongings).
- **Modern:** Utilizes contemporary UI patterns (Supabase-inspired) to feel current and tech-forward.
- **Clean:** Focuses on clarity and reducing cognitive load during the potentially stressful moving process.

### Aesthetic Direction
- **Visual Tone:** Supabase-inspired minimalism. High-quality typography, subtle borders, and a precise layout.
- **Color Palette:** A "Zinc" base (shades of gray/slate) paired with "Emerald" or "Teal" accents for a fresh, professional feel.
- **Theme:** Emphasizes "Ease of Moving." The UI should feel lightweight and helpful, moving away from heavy industrial or overly "logistics-heavy" aesthetics toward a service-oriented, lifestyle feel.

### Design Principles
1. **Functional Minimalism:** Every element must serve a purpose. Avoid unnecessary styling, heavy gradients, or "tacky" decorations.
2. **Trust through Precision:** Use consistent spacing, perfect alignments, and standardized Shadcn UI components to create a sense of professional order.
3. **Clarity & Hierarchy:** Leverage white space (or dark space) and typography rather than color to define sections and importance.
4. **Accessible by Default:** Strictly adhere to WCAG 2.2 AA standards, ensuring high contrast ratios (especially for emerald/teal accents) and robust keyboard navigation.
5. **Human-Centric Logistics:** Use iconography (Lucide) and copy that makes moving feel like a helpful service rather than a complex mechanical operation.

