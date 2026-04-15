# Eureka Service Registration Fix

## Problem

Services were not registering with the Eureka server despite having Eureka client dependencies and configuration. Only the API Gateway was appearing in Eureka.

## Root Cause

In Spring Boot 4.0.3 with Spring Cloud 2025.1.0, Eureka client registration is **disabled by default**. The services had the configuration properties but were missing the critical enablement flags.

## Solution Applied

### 1. Updated Service Configuration Files

Added the following properties to all microservice `application.properties` files:

```properties
eureka.client.enabled=true
eureka.client.register-with-eureka=true
eureka.client.fetch-registry=true
eureka.instance.hostname=${HOSTNAME:SERVICE_NAME}
```

**Services Updated:**

- `auth-service/src/main/resources/application.properties`
- `user-service/src/main/resources/application.properties`
- `client-service/src/main/resources/application.properties`
- `driver-service/src/main/resources/application.properties`
- `location-service/src/main/resources/application.properties`
- `payment-service/src/main/resources/application.properties`
- `trip-service/src/main/resources/application.properties`
- `notification-service/src/main/resources/application.properties`

### 2. Updated API Gateway YAML Configuration

Updated `api-gateway/src/main/resources/application.yml` with:

```yaml
eureka:
  client:
    enabled: true
    register-with-eureka: true
    fetch-registry: true
    service-url:
      defaultZone: ${EUREKA_URI:http://eureka-server:8761/eureka}
  instance:
    prefer-ip-address: true
    hostname: ${HOSTNAME:api-gateway}
```

### 3. Updated Docker Compose Configuration

Added `HOSTNAME` environment variable to each service in `docker-compose.yml`:

```yaml
environment:
  <<: *backend-env
  HOSTNAME: service-name
```

This ensures each service registers with its container name as the hostname, which is critical for service discovery in Docker networks.

## Property Descriptions

| Property                             | Purpose                                                              |
| ------------------------------------ | -------------------------------------------------------------------- |
| `eureka.client.enabled`              | Enables Eureka client functionality (DEFAULT: false in Spring 4.0.3) |
| `eureka.client.register-with-eureka` | Registers this service with Eureka                                   |
| `eureka.client.fetch-registry`       | Fetches the registry from Eureka server                              |
| `eureka.instance.hostname`           | Instance hostname for registration                                   |
| `eureka.instance.prefer-ip-address`  | Uses IP address instead of hostname                                  |

## Next Steps

1. **Rebuild Docker images:**

   ```bash
   docker-compose down
   docker-compose build
   docker-compose up
   ```

2. **Verify registration:**
   - Access Eureka dashboard: http://eureka-server:8761
   - All services should now appear in the registered instances list

3. **Check logs for confirmation:**
   ```bash
   docker logs SERVICE_NAME | grep -i eureka
   ```

## Notes

- The `HOSTNAME` environment variable is injected from Docker Compose and used by the `eureka.instance.hostname` property
- Services communicate using the internal Docker network (eureka-server:8761)
- The notification-service RabbitMQ configuration was also updated to use environment variables for Docker compatibility
