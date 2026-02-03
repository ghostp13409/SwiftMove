# Domain-Driven Design Microservices Architecture for SwiftMove

## Overview

This document outlines a proposed Domain-Driven Design (DDD) microservices architecture for the SwiftMove moving service platform. The design is based on the business requirements from `Overview.md` and the entity-relationship model in `ErdDiagram.md`. The architecture decomposes the system into bounded contexts, each implemented as a microservice, to promote scalability, maintainability, and alignment with business domains.

## Bounded Contexts and Microservices

### 1. Identity and Access Management (IAM) Microservice

**Bounded Context:** User authentication, authorization, and profile management.

**Responsibilities:**

- User registration and login
- Role-based access control (Client, Driver, Admin)
- User profile management (including addresses)
- Password hashing and security

**Aggregates:**

- **User Aggregate:** Root entity `User` with value objects `Address`, `UserRole`.
- **Authentication Aggregate:** Handles login sessions and tokens.

**Domain Events:**

- `UserRegistered`
- `UserLoggedIn`
- `UserProfileUpdated`

**External Integrations:** None directly, but provides JWT tokens for other services.

### 2. Driver Management Microservice

**Bounded Context:** Driver-specific information and capabilities.

**Responsibilities:**

- Managing driver profiles (experience, license, range)
- Associating drivers with users
- Driver availability and status

**Aggregates:**

- **Driver Aggregate:** Root entity `Driver` (extending User) with `DriverInfo` entity, value object `Range`.

**Domain Events:**

- `DriverProfileCreated`
- `DriverProfileUpdated`

**Dependencies:** IAM Microservice (for user data).

### 3. Vehicle Management Microservice

**Bounded Context:** Vehicle ownership and specifications.

**Responsibilities:**

- Managing vehicles owned by drivers
- Vehicle types and capabilities (e.g., capacity, weight limits)
- Vehicle activation/deactivation

**Aggregates:**

- **Vehicle Aggregate:** Root entity `Vehicle` with `VehicleType` entity, value objects `PricePerKm`, `Capacity`.
- **VehicleType Aggregate:** Defines types like "Truck", "Van".

**Domain Events:**

- `VehicleAdded`
- `VehicleUpdated`
- `VehicleDeactivated`

**Dependencies:** Driver Management Microservice.

### 4. Move Request Management Microservice

**Bounded Context:** Client-initiated move requests.

**Responsibilities:**

- Creating and managing move requests
- Associating luggage entries with requests
- Request status tracking
- Client-specific request operations

**Aggregates:**

- **MoveRequest Aggregate:** Root entity `MoveRequest` with entities `LuggageEntry`, value objects `Address` (from/to), `MoveDate`, `MaxBudget`.
- **LuggageEntry Aggregate:** Includes `LuggageType` and `Quantity`.

**Domain Events:**

- `MoveRequestCreated`
- `MoveRequestUpdated`
- `MoveRequestCancelled`

**Dependencies:** IAM Microservice (for client data), Map Service (for distance calculations).

### 5. Offer Management Microservice

**Bounded Context:** Driver offers on move requests.

**Responsibilities:**

- Drivers creating offers on requests
- Offer pricing and status management
- Matching offers to requests based on driver range and vehicle capabilities

**Aggregates:**

- **MoveOffer Aggregate:** Root entity `MoveOffer` with value objects `Price`, `OfferedDate`, `Status`.

**Domain Events:**

- `MoveOfferCreated`
- `MoveOfferAccepted`
- `MoveOfferRejected`

**Dependencies:** Move Request Management, Vehicle Management, Driver Management, Map Service.

### 6. Trip Management Microservice

**Bounded Context:** Executed move trips.

**Responsibilities:**

- Creating trips upon offer acceptance
- Trip status tracking and management
- Coordinating between client, driver, and vehicle

**Aggregates:**

- **MoveTrip Aggregate:** Root entity `MoveTrip` linking `MoveRequest` and `MoveOffer`, with `Status`.

**Domain Events:**

- `TripCreated`
- `TripStarted`
- `TripCompleted`
- `TripCancelled`

**Dependencies:** Offer Management, Move Request Management.

### 7. Payment Microservice

**Bounded Context:** Financial transactions for trips.

**Responsibilities:**

- Processing payments for completed trips
- Handling refunds and disputes
- Integrating with external payment gateways

**Aggregates:**

- **Payment Aggregate:** Root entity `Payment` with value objects `Amount`, `Status`, `TransactionId`.

**Domain Events:**

- `PaymentProcessed`
- `PaymentFailed`
- `RefundIssued`

**Dependencies:** Trip Management.

### 8. Notification Microservice

**Bounded Context:** User communications.

**Responsibilities:**

- Sending notifications (email, SMS, push) for events like offer creation, acceptance, trip updates
- Managing user notification preferences

**Aggregates:**

- **Notification Aggregate:** Root entity `Notification` with value objects `Type`, `Recipient`, `Content`.

**Domain Events:**

- `NotificationSent`

**Dependencies:** All other microservices (listens to domain events).

### 9. Admin Management Microservice

**Bounded Context:** Administrative oversight.

**Responsibilities:**

- Managing all entities (users, drivers, vehicles, requests, offers, trips)
- Reporting and analytics
- System-wide configurations

**Aggregates:**

- **Admin Aggregate:** Provides read/write access to all domain objects across contexts.

**Domain Events:**

- `EntityManaged` (generic for admin actions)

**Dependencies:** All microservices.

## External Services

### Map Service

- Calculates distances between addresses.
- Used by Move Request and Offer Management for pricing and range checks.
- Could be a third-party API (e.g., Google Maps) or a custom microservice.

### Payment Gateway

- Integrated into Payment Microservice for actual transaction processing.

### Notification Provider

- Email/SMS services integrated into Notification Microservice.

## Inter-Service Communication

- **Synchronous:** RESTful APIs for queries and commands within bounded contexts.
- **Asynchronous:** Event-driven architecture using a message broker (e.g., RabbitMQ, Kafka) for domain events.
  - Example: When a `MoveOfferAccepted` event is published, Trip Management subscribes to create a trip.
- **API Gateway:** For external client access, routing requests to appropriate microservices.

## Data Management

- Each microservice owns its database (Database per Service pattern).
- Use CQRS and Event Sourcing where appropriate for complex domains (e.g., Trip Management).
- Shared read models via event subscriptions for cross-service queries.

## Security and Cross-Cutting Concerns

- Authentication via IAM microservice.
- Authorization using roles and permissions.
- Logging and monitoring across services.
- API versioning for backward compatibility.

## Deployment and Scaling

- Containerization with Docker/Kubernetes.
- Independent scaling of microservices based on load.
- Blue-green deployments for zero-downtime updates.

## Next Steps

1. Refine aggregates and domain models with domain experts.
2. Implement proof-of-concept for core microservices (IAM, Move Request, Offer).
3. Set up event infrastructure.
4. Integrate external services.
5. Define API contracts and data schemas.
