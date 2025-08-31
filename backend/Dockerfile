# Build stage
FROM maven:3.9.8-eclipse-temurin-21 as build

# Set working directory
WORKDIR /workspace

# Copy Maven configuration
COPY pom.xml .

# Download dependencies (cached layer)
RUN mvn -q -e -DskipTests dependency:go-offline

# Copy source code
COPY src ./src

# Build the application
RUN mvn -q -DskipTests clean package -Dspring.profiles.active=docker

# Verify the JAR was created
RUN ls -la target/

# Runtime stage
FROM eclipse-temurin:21-jre-alpine

# Install curl for health checks and create app user
RUN apk add --no-cache curl tzdata && \
    addgroup -g 1001 -S appgroup && \
    adduser -S -D -H -u 1001 -h /app -s /sbin/nologin -G appgroup -g appuser appuser

# Set working directory
WORKDIR /app

# Create logs directory
RUN mkdir -p /app/logs && chown -R appuser:appgroup /app

# Set timezone
ENV TZ=America/New_York

# JVM optimizations for containers
ENV JAVA_OPTS="-XX:+UseContainerSupport \
               -XX:MaxRAMPercentage=75.0 \
               -XX:+UseG1GC \
               -XX:G1HeapRegionSize=16m \
               -XX:+UseStringDeduplication \
               -XX:+OptimizeStringConcat \
               -Djava.security.egd=file:/dev/./urandom \
               -Dspring.backgroundpreinitializer.ignore=true"

# Application environment
ENV SPRING_PROFILES_ACTIVE=docker
ENV SERVER_PORT=8080

# Copy the JAR file from build stage
COPY --from=build --chown=appuser:appgroup /workspace/target/*.jar /app/app.jar

# Switch to non-root user
USER appuser

# Expose the application port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=45s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

# Run the application
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app/app.jar"]
