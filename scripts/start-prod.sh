#!/bin/bash
# Production startup script for Band Equipment Management System

set -e

echo "🎵 Starting Band Equipment Management System (Production Mode)"
echo "=============================================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Load production environment
if [ -f .env.docker ]; then
    echo "📋 Loading production environment variables..."
    export $(grep -v '^#' .env.docker | xargs)
else
    echo "❌ Error: .env.docker file not found. Please create it for production deployment."
    exit 1
fi

# Security check for production secrets
if grep -q "change-in-production" .env.docker; then
    echo "⚠️  WARNING: Production secrets contain placeholder values!"
    echo "   Please update all 'change-in-production' values in .env.docker"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Create necessary directories with proper permissions
echo "📁 Creating production directories..."
mkdir -p nginx/ssl
mkdir -p backend/logs
mkdir -p data/postgres
mkdir -p data/redis
mkdir -p data/minio
mkdir -p backups

# Set proper permissions
chmod 755 data/postgres data/redis data/minio
chmod 700 nginx/ssl
chmod 755 backups

# Check for SSL certificates
if [ ! -f nginx/ssl/cert.pem ] || [ ! -f nginx/ssl/key.pem ]; then
    echo "🔐 SSL certificates not found."
    echo "For production, you should use real SSL certificates."
    echo "Generating self-signed certificates for testing..."
    
    openssl req -x509 -newkey rsa:4096 -keyout nginx/ssl/key.pem -out nginx/ssl/cert.pem \
        -sha256 -days 365 -nodes \
        -subj "/C=US/ST=State/L=City/O=BandApp/CN=$(hostname)"
    
    chmod 600 nginx/ssl/key.pem
    chmod 644 nginx/ssl/cert.pem
fi

# Pull latest production images
echo "📥 Pulling latest Docker images..."
docker-compose pull

# Start infrastructure services first
echo "🔧 Starting infrastructure services..."
docker-compose up -d db redis minio

# Wait for database to be ready with health check
echo "⏳ Waiting for database to be ready..."
timeout=60
counter=0
until docker-compose exec -T db pg_isready -U band -d banddb > /dev/null 2>&1; do
    counter=$((counter + 1))
    if [ $counter -gt $timeout ]; then
        echo "❌ Database failed to start within $timeout seconds"
        docker-compose logs db
        exit 1
    fi
    printf "."
    sleep 2
done
echo " Database ready!"

# Check Redis connectivity
echo "⏳ Checking Redis connectivity..."
timeout=30
counter=0
until docker-compose exec -T redis redis-cli -a bandredis ping | grep -q PONG; do
    counter=$((counter + 1))
    if [ $counter -gt $timeout ]; then
        echo "❌ Redis failed to start within $timeout seconds"
        docker-compose logs redis
        exit 1
    fi
    printf "."
    sleep 1
done
echo " Redis ready!"

# Check MinIO connectivity
echo "⏳ Checking MinIO connectivity..."
timeout=30
counter=0
until curl -f http://localhost:9000/minio/health/live > /dev/null 2>&1; do
    counter=$((counter + 1))
    if [ $counter -gt $timeout ]; then
        echo "❌ MinIO failed to start within $timeout seconds"
        docker-compose logs minio
        exit 1
    fi
    printf "."
    sleep 2
done
echo " MinIO ready!"

# Start backend application
echo "🚀 Starting backend application..."
docker-compose up -d --build backend

# Wait for backend health check
echo "⏳ Waiting for backend to be ready..."
timeout=120
counter=0
until curl -f http://localhost:8080/actuator/health > /dev/null 2>&1; do
    counter=$((counter + 1))
    if [ $counter -gt $timeout ]; then
        echo "❌ Backend failed to start within $timeout seconds"
        echo "Backend logs:"
        docker-compose logs --tail=20 backend
        exit 1
    fi
    printf "."
    sleep 3
done
echo " Backend ready!"

# Start frontend application
echo "🎨 Starting frontend application..."
docker-compose up -d --build frontend

# Wait for frontend
echo "⏳ Waiting for frontend to be ready..."
timeout=60
counter=0
until curl -f http://localhost:3000 > /dev/null 2>&1; do
    counter=$((counter + 1))
    if [ $counter -gt $timeout ]; then
        echo "❌ Frontend failed to start within $timeout seconds"
        echo "Frontend logs:"
        docker-compose logs --tail=20 frontend
        exit 1
    fi
    printf "."
    sleep 2
done
echo " Frontend ready!"

# Start production reverse proxy
echo "🌐 Starting production reverse proxy..."
docker-compose --profile production up -d nginx

# Final health checks
echo "🔍 Running final system health checks..."

# Check all services
services=("db" "redis" "minio" "backend" "frontend" "nginx")
for service in "${services[@]}"; do
    if docker-compose ps --services --filter "status=running" | grep -q "^${service}$"; then
        echo "   ✅ $service is running"
    else
        echo "   ❌ $service is not running"
        docker-compose logs --tail=5 $service
    fi
done

# Check external connectivity
echo ""
echo "🌍 Testing external connectivity..."
if curl -f http://localhost > /dev/null 2>&1; then
    echo "   ✅ HTTP (port 80) is accessible"
else
    echo "   ❌ HTTP (port 80) is not accessible"
fi

if curl -k -f https://localhost > /dev/null 2>&1; then
    echo "   ✅ HTTPS (port 443) is accessible"
else
    echo "   ❌ HTTPS (port 443) is not accessible"
fi

echo ""
echo "🎉 Band Equipment Management System is running in production mode!"
echo ""
echo "🌐 Access Points:"
echo "   • Main Application: http://localhost (or https://localhost)"
echo "   • Direct Frontend:  http://localhost:3000"
echo "   • API Endpoints:    http://localhost/api/"
echo "   • WebSocket:        ws://localhost/ws/"
echo "   • MinIO Console:    http://localhost:9001"
echo ""
echo "🔧 Management:"
echo "   • View all logs:    docker-compose logs -f"
echo "   • View service:     docker-compose logs -f [service-name]"
echo "   • Stop system:      docker-compose --profile production down"
echo "   • Restart service:  docker-compose restart [service-name]"
echo ""
echo "📊 Monitoring:"
echo "   • Health Check:     http://localhost/actuator/health"
echo "   • System Status:    docker-compose ps"
echo ""

# Setup log rotation reminder
echo "💡 Production Tips:"
echo "   • Monitor disk space: df -h"
echo "   • Setup log rotation for: backend/logs/"
echo "   • Backup database regularly"
echo "   • Monitor resource usage: docker stats"
echo ""