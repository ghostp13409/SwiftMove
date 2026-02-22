# Auth Service API Quick Reference

## Base URL

```
http://localhost:8000/v1/auth
```

## Endpoints

### 1. Login

**Endpoint:** `POST /v1/auth/login`

**Request:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response (200):**

```json
{
  "token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9...",
  "role": "Client",
  "userId": 1,
  "name": "John Doe",
  "email": "user@example.com"
}
```

**Error Response (401):**

```json
{
  "error": "Invalid email or password"
}
```

---

### 2. Register

**Endpoint:** `POST /v1/auth/register`

**Request:**

```json
{
  "email": "newuser@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "Client"
}
```

**Success Response (201):**

```json
{
  "token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9...",
  "role": "Client",
  "userId": 2,
  "name": "John Doe",
  "email": "newuser@example.com"
}
```

**Error Response (400):**

```json
{
  "error": "Email already registered"
}
```

---

### 3. Logout

**Endpoint:** `POST /v1/auth/logout`

**Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:** Empty `{}`

**Success Response (200):**

```
HTTP/1.1 200 OK
```

**Note:** JWT tokens are stateless. Logout is handled on the client-side by removing the token from localStorage.

---

### 4. Check Authentication Status

**Endpoint:** `GET /v1/auth/check`

**Headers:**

```
Authorization: Bearer <token> (optional)
```

**Success Response (200):**

```json
{
  "isAuthenticated": true
}
```

**Not Authenticated Response (200):**

```json
{
  "isAuthenticated": false
}
```

---

### 5. Get Current User Info

**Endpoint:** `GET /v1/auth/me`

**Headers (Required):**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Success Response (200):**

```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "role": "Client"
}
```

**Error Response (401):**

```
HTTP/1.1 401 Unauthorized
```

---

## Authentication Header Format

All protected endpoints require the `Authorization` header with Bearer token:

```
Authorization: Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyQGV4YW1wbGUuY29tIiwicm9sZSI6IkNsaWVudCIsInVzZXJJZCI6MSwiaWF0IjoxNjE2MjM5MDIyLCJleHAiOjE2MTYzMjU0MjJ9.signature
```

## Common HTTP Status Codes

| Code | Meaning               | Scenario                                     |
| ---- | --------------------- | -------------------------------------------- |
| 200  | OK                    | Successful request                           |
| 201  | Created               | Successful registration                      |
| 400  | Bad Request           | Invalid input or email already exists        |
| 401  | Unauthorized          | Invalid credentials or missing/invalid token |
| 500  | Internal Server Error | Server-side error                            |

## JWT Token Structure

JWT tokens consist of three parts separated by dots:

```
header.payload.signature
```

**Header:**

```json
{
  "alg": "HS512",
  "typ": "JWT"
}
```

**Payload (Claims):**

```json
{
  "sub": "user@example.com",
  "userId": 1,
  "email": "user@example.com",
  "role": "Client",
  "iat": 1616239022,
  "exp": 1616325422
}
```

**Signature:** HMAC-SHA512 signed using the secret key

## Token Expiration

- **Expires In:** 24 hours (86400000 milliseconds)
- **Configurable Via:** `jwt.expiration` property in application.properties
- **Action on Expiration:** Token becomes invalid, user must login again

## Role Types

- **Client** - Regular user requesting moving services
- **Driver** - Driver offering moving services
- **Admin** - Administrator with system access

## Frontend Integration Example

```typescript
// Login
const { login } = useAuth();
await login("user@example.com", "password123");

// Register
const { register } = useAuth();
await register("newuser@example.com", "password123", "John", "Doe", "Client");

// Logout
const { logout } = useAuth();
await logout();

// Check authentication
const { isAuthenticated, role } = useAuth();
if (isAuthenticated) {
  console.log(`User role: ${role}`);
}
```

## cURL Examples

### Login

```bash
curl -X POST http://localhost:8000/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Register

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

### Get Current User

```bash
curl -X GET http://localhost:8000/v1/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9..."
```

### Check Auth Status

```bash
curl -X GET http://localhost:8000/v1/auth/check
```

### Logout

```bash
curl -X POST http://localhost:8000/v1/auth/logout \
  -H "Authorization: Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{}'
```

## Service Configuration

**Auth Service Port:** 8080
**API Gateway Port:** 8000
**Database:** PostgreSQL on localhost:5432
**Database Name:** postgres

## Environment Variables (Optional)

```bash
# Eureka Service Discovery
EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://localhost:8761/eureka

# Database
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/postgres
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=postgres

# JWT
JWT_EXPIRATION=86400000

# Server Port
PORT=8080
```

## Troubleshooting

### "Email already registered"

- Use a different email or login with existing account

### "Invalid email or password"

- Verify email and password are correct (case-sensitive)

### "401 Unauthorized" on protected endpoints

- Ensure token is included in Authorization header
- Check if token has expired (24 hours)
- Verify token format: `Bearer <token>`

### "CORS error"

- CORS is enabled for all origins
- Check browser console for detailed error
- Ensure Content-Type header is set correctly

## Files Modified/Created

### Backend

- ✅ `src/backend/auth-service/pom.xml` - Added JWT dependencies
- ✅ `src/backend/auth-service/src/main/java/com/swiftmove/authservice/model/AuthUser.java`
- ✅ `src/backend/auth-service/src/main/java/com/swiftmove/authservice/dto/LoginRequest.java`
- ✅ `src/backend/auth-service/src/main/java/com/swiftmove/authservice/dto/RegisterRequest.java`
- ✅ `src/backend/auth-service/src/main/java/com/swiftmove/authservice/dto/AuthResponse.java`
- ✅ `src/backend/auth-service/src/main/java/com/swiftmove/authservice/dto/UserInfoResponse.java`
- ✅ `src/backend/auth-service/src/main/java/com/swiftmove/authservice/repo/AuthUserRepository.java`
- ✅ `src/backend/auth-service/src/main/java/com/swiftmove/authservice/util/JwtTokenProvider.java`
- ✅ `src/backend/auth-service/src/main/java/com/swiftmove/authservice/service/AuthService.java`
- ✅ `src/backend/auth-service/src/main/java/com/swiftmove/authservice/controller/AuthController.java`
- ✅ `src/backend/auth-service/src/main/java/com/swiftmove/authservice/config/SecurityConfig.java`
- ✅ `src/backend/auth-service/src/main/resources/application.properties` - Updated configuration
- ✅ `src/backend/api-gateway/src/main/resources/application.properties` - Added auth service route
- ✅ `src/backend/api-gateway/src/main/java/com/swiftmove/apigateway/filter/JwtAuthenticationFilter.java` - Updated whitelist

### Frontend

- ✅ `src/frontend/src/services/authService.ts` - Added login/register methods
- ✅ `src/frontend/src/context/AuthContext.tsx` - Added login/register functions

## Next Steps

1. Build and test the auth service:

   ```bash
   cd src/backend/auth-service
   mvn clean install
   ```

2. Start the services in order:
   - Eureka Server
   - Auth Service
   - API Gateway
   - Other microservices

3. Test endpoints using provided cURL examples

4. Integrate with frontend forms (login/register pages)

5. For production: Implement email verification, password reset, and refresh tokens
