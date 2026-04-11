# ================================
# Stage 1: Build
# ================================
FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /app

# Copy Maven wrapper and pom.xml first (layer caching)
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./

# Ensure the Maven wrapper script is executable on Unix hosts
RUN chmod +x mvnw

# Download dependencies (cached unless pom.xml changes)
RUN ./mvnw dependency:go-offline -B

# Copy source and build
COPY src/ src/
RUN ./mvnw clean package -DskipTests -B

# ================================
# Stage 2: Runtime
# ================================
FROM eclipse-temurin:21-jre-alpine AS runtime

WORKDIR /app

# Create a non-root user for security
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copy the built JAR from builder stage
COPY --from=builder /app/target/*.jar app.jar

# Expose the port (overridable via env)
EXPOSE ${SERVER_PORT:-8080}

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${SERVER_PORT:-8080}/actuator/health || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]
