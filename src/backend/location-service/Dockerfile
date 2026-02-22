# Use an official Java runtime as a base image
FROM eclipse-temurin:17-jdk-alpine AS build

# Set the working directory in the container
WORKDIR /app

# Copy the built JAR file into the container
# Replace 'your-app-name.jar' with your actual filena   me
COPY target/*.jar app.jar

# Specify the command to run your application
ENTRYPOINT ["java", "-jar", "app.jar"]