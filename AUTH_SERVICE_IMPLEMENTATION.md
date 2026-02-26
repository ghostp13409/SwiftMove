# Auth Service Implementation Guide

## Overview

A complete JWT-based authentication service with email/password login and registration has been implemented for the SwiftMove application. The service handles user authentication, JWT token generation, and integrates seamlessly with the API Gateway and frontend.

## Backend Components

### 1. Auth Service Models & Database

**File:** [`src/backend/auth-service/src/main/java/com/swiftmove/authservice/model/AuthUser.java`](src/backend/auth-service/src/main/java/com/swiftmove/authservice/model/AuthUser.java)

- **Entity:** `AuthUser`
- **Table:** `auth_users`
- **Fields:**
  - `id` - Primary key (auto-generated)
  - `email` - Unique email address (required)
  - `passwordHash` - Hashed password using BCrypt (required)
  - `firstName` - User's first name
  - `lastName` - User's last name
  - `role` - User role (Client, Driver, Admin)
  - `isActive` - Account status flag
  - `createdAt` - Auto-set on creation
  - `updatedAt` - Auto-set on updates

### 2. Data Transfer Objects (DTOs)

**Location:** `src/backend/auth-service/src/main/java/com/swiftmove/authservice/dto/`

#### LoginRequest

```java
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### RegisterRequest

```java
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "Client" // Optional, defaults to Client
}
```

#### AuthResponse

```java
{
  "token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9...",
  "role": "Client",
  "userId": 1,
  "name": "John Doe",
  "email": "user@example.com"
}
```

#### UserInfoResponse

```java
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "role": "Client"
}
```

### 3. JWT Token Provider

**File:** [`src/backend/auth-service/src/main/java/com/swiftmove/authservice/util/JwtTokenProvider.java`](src/backend/auth-service/src/main/java/com/swiftmove/authservice/util/JwtTokenProvider.java)

- **Secret Key:** `5367566B59703373367639792F423F4528482B4D6251655468576D5A71347437` (BASE64 encoded)
- **Algorithm:** HMAC SHA-512
- **Expiration:** 86400000ms (24 hours, configurable via `jwt.expiration`)
- **Claims:** userId, email, role

### 4. Auth Service Business Logic

**File:** [`src/backend/auth-service/src/main/java/com/swiftmove/authservice/service/AuthService.java`](src/backend/auth-service/src/main/java/com/swiftmove/authservice/service/AuthService.java)

#### Methods:

- `register(RegisterRequest)` - Creates new user and returns JWT token
- `login(LoginRequest)` - Authenticates user and returns JWT token
- `getUserInfo(Long userId)` - Retrieves user information

### 5. Auth Controller

**File:** [`src/backend/auth-service/src/main/java/com/swiftmove/authservice/controller/AuthController.java`](src/backend/auth-service/src/main/java/com/swiftmove/authservice/controller/AuthController.java)

#### Endpoints:

| Method | Endpoint         | Request           | Response                     | Auth Required |
| ------ | ---------------- | ----------------- | ---------------------------- | ------------- |
| POST   | `/auth/login`    | `LoginRequest`    | `AuthResponse`               | No            |
| POST   | `/auth/register` | `RegisterRequest` | `AuthResponse`               | No            |
| POST   | `/auth/logout`   | Empty body        | 200 OK                       | Yes           |
| GET    | `/auth/check`    | None              | `{isAuthenticated: boolean}` | No            |
| GET    | `/auth/me`       | None              | `UserInfoResponse`           | Yes           |

### 6. Security Configuration

**File:** [`src/backend/auth-service/src/main/java/com/swiftmove/authservice/config/SecurityConfig.java`](src/backend/auth-service/src/main/java/com/swiftmove/authservice/config/SecurityConfig.java)

- **Password Encoder:** BCryptPasswordEncoder
- **CORS:** Enabled for all origins
- **Dependencies:** Spring Security, Spring Security Crypto

### 7. Application Properties

**File:** [`src/backend/auth-service/src/main/resources/application.properties`](src/backend/auth-service/src/main/resources/application.properties)

```properties
spring.application.name=auth-service
server.port=8080

# Eureka Discovery
eureka.client.service-url.defaultZone=http://localhost:8761/eureka

# PostgreSQL Database
spring.datasource.url=jdbc:postgresql://localhost:5432/postgres
spring.datasource.username=postgres
spring.datasource.password=postgres
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA/Hibernate
spring.jpa.show-sql=true
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# JWT
jwt.expiration=86400000

# Logging
logging.level.com.swiftmove.authservice=DEBUG
```

## API Gateway Configuration

**File:** [`src/backend/api-gateway/src/main/resources/application.properties`](src/backend/api-gateway/src/main/resources/application.properties)

Added route configuration:

```properties
spring.cloud.gateway.server.webflux.routes[0].id=auth-service
spring.cloud.gateway.server.webflux.routes[0].uri=lb://auth-service
spring.cloud.gateway.server.webflux.routes[0].predicates[0]=Path=/v1/auth/**
```

**JWT Filter Whitelist:** Updated to include auth endpoints that bypass JWT validation:

- `/v1/auth/login` - Public endpoint for login
- `/v1/auth/register` - Public endpoint for registration
- `/v1/auth/logout` - Public endpoint (token sent in header)
- `/v1/auth/check` - Public endpoint for auth status check
- `/eureka` - Service discovery

## Frontend Integration

### Frontend Auth Service

**File:** [`src/frontend/src/services/authService.ts`](src/frontend/src/services/authService.ts)

#### Methods:

- `login(credentials: LoginRequest)` - Login with email/password
- `register(credentials: RegisterRequest)` - Register new account
- `logout()` - Logout user
- `checkAuth()` - Check authentication status
- `getCurrentUser()` - Get current user info
- `setAuthData()` - Store auth data in localStorage
- `getToken()` - Retrieve stored JWT token
- `getRole()` - Retrieve stored user role

#### API Endpoints Called:

- `POST ${API_BASE_URL}/v1/auth/login`
- `POST ${API_BASE_URL}/v1/auth/register`
- `POST ${API_BASE_URL}/v1/auth/logout`
- `GET ${API_BASE_URL}/v1/auth/check`
- `GET ${API_BASE_URL}/v1/auth/me`

### Auth Context

**File:** [`src/frontend/src/context/AuthContext.tsx`](src/frontend/src/context/AuthContext.tsx)

#### Context Methods:

- `login(email, password)` - Authenticate user
- `register(email, password, firstName, lastName, role?)` - Register new user
- `logout()` - Logout current user
- `loginWithGoogle()` - OAuth login (existing)
- `loginAsTestUser(userType)` - Test login (existing)
- `checkAuth()` - Check auth status
- `isAdmin()` - Check if user is admin

#### Context State:

- `isAuthenticated` - Authentication status
- `role` - User role
- `userId` - User ID
- `name` - User's full name
- `email` - User's email
- `isLoading` - Loading state

## API Gateway Routes Summary

| Route ID         | Service                  | Path                                           | Port |
| ---------------- | ------------------------ | ---------------------------------------------- | ---- |
| auth-service     | auth-service             | `/v1/auth/**`                                  | 8080 |
| user-service     | user-service             | `/users/**`                                    | 8070 |
| location-service | location-service         | `/address/**`                                  | -    |
| trip-service     | tripManagement-service   | `/trips/**`                                    | -    |
| client-service   | clientManagement-service | `/client/**`                                   | -    |
| driver-service   | driver-service           | `/drivers/**`, `/move-offer/**`, `/vehicle/**` | -    |

API Gateway runs on port **8000**

## Database Requirements

Create the following table in PostgreSQL:

```sql
CREATE TABLE auth_users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_auth_users_email ON auth_users(email);
```

## Authentication Flow

### Login Flow

1. User submits email/password
2. Frontend calls `POST /v1/auth/login` via API Gateway
3. Auth service validates credentials against database
4. On success, JWT token is generated with user claims
5. Token is returned with user info
6. Frontend stores token in localStorage
7. All subsequent requests include `Authorization: Bearer <token>` header

### Register Flow

1. User submits registration details
2. Frontend calls `POST /v1/auth/register` via API Gateway
3. Auth service validates email uniqueness
4. Password is hashed using BCrypt
5. User is created in database
6. JWT token is generated
7. Token and user info returned
8. Frontend automatically logs in user

### Request Protection

- API Gateway checks for `Authorization` header on protected endpoints
- JWT token is validated using JwtUtil
- Invalid/expired tokens receive 401 Unauthorized response
- Public endpoints (login, register, check, logout) bypass JWT validation

## Error Handling

### Common HTTP Responses

| Status                    | Scenario                                         |
| ------------------------- | ------------------------------------------------ |
| 200 OK                    | Successful login/logout/check                    |
| 201 Created               | Successful registration                          |
| 400 Bad Request           | Invalid input or email already registered        |
| 401 Unauthorized          | Invalid credentials or missing/invalid JWT token |
| 500 Internal Server Error | Server-side error                                |

## Testing the Auth Service

### Test Login

```bash
curl -X POST http://localhost:8000/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Test Registration

```bash
curl -X POST http://localhost:8000/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "role": "Client"
  }'
```

### Test Protected Endpoint

```bash
curl -X GET http://localhost:8000/v1/auth/me \
  -H "Authorization: Bearer <your_jwt_token>"
```

## Dependencies Added to pom.xml

```xml
<!-- JWT Support -->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.12.3</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.12.3</version>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.12.3</version>
    <scope>runtime</scope>
</dependency>

<!-- Password Encoding -->
<dependency>
    <groupId>org.springframework.security</groupId>
    <artifactId>spring-security-crypto</artifactId>
</dependency>
```

## Next Steps for Production

1. **Move JWT Secret to Environment Variables** - Use `@Value` annotation to load from properties
2. **Add Rate Limiting** - Prevent brute force attacks on login/register endpoints
3. **Add Email Verification** - Verify email addresses before account activation
4. **Add Password Reset** - Implement forgot password flow
5. **Add Refresh Tokens** - Implement token refresh mechanism
6. **Add Audit Logging** - Log authentication events for security monitoring
7. **HTTPS Configuration** - Ensure all endpoints use HTTPS in production
8. **Database Connection Pooling** - Configure HikariCP for better performance
9. **Add Unit/Integration Tests** - Test all authentication flows
10. **API Documentation** - Generate Swagger/OpenAPI documentation

## File Structure

```
src/backend/auth-service/
├── src/main/java/com/swiftmove/authservice/
│   ├── AuthServiceApplication.java
│   ├── config/
│   │   └── SecurityConfig.java
│   ├── controller/
│   │   └── AuthController.java
│   ├── dto/
│   │   ├── LoginRequest.java
│   │   ├── RegisterRequest.java
│   │   ├── AuthResponse.java
│   │   └── UserInfoResponse.java
│   ├── model/
│   │   └── AuthUser.java
│   ├── repo/
│   │   └── AuthUserRepository.java
│   ├── service/
│   │   └── AuthService.java
│   └── util/
│       └── JwtTokenProvider.java
├── src/main/resources/
│   └── application.properties
└── pom.xml
```

## Support & Troubleshooting

### Issue: "Email already registered"

- **Cause:** User tries to register with existing email
- **Solution:** Use different email or login with existing account

### Issue: "Invalid email or password"

- **Cause:** Wrong credentials provided
- **Solution:** Verify email and password are correct

### Issue: "401 Unauthorized" on protected endpoints

- **Cause:** Missing or invalid JWT token
- **Solution:** Include valid token in `Authorization: Bearer <token>` header

### Issue: CORS errors

- **Cause:** Cross-origin requests blocked
- **Solution:** CORS is enabled for all origins in SecurityConfig

For more details, refer to the Spring Security documentation and JJWT library documentation.
