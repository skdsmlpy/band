#!/bin/bash
# Development startup script for Band Equipment Management System

set -e

echo "🎵 Starting Band Equipment Management System (Development Mode)"
echo "=============================================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Load development environment
if [ -f .env.development ]; then
    echo "📋 Loading development environment variables..."
    set -a
    source .env.development
    set +a
else
    echo "⚠️  Warning: .env.development file not found. Using default values."
fi

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p nginx/ssl
mkdir -p backend/logs
mkdir -p data/postgres
mkdir -p data/redis
mkdir -p data/minio

# Generate self-signed certificates for development (if they don't exist)
if [ ! -f nginx/ssl/cert.pem ]; then
    echo "🔐 Generating self-signed SSL certificates for development..."
    openssl req -x509 -newkey rsa:4096 -keyout nginx/ssl/key.pem -out nginx/ssl/cert.pem \
        -sha256 -days 365 -nodes \
        -subj "/C=US/ST=State/L=City/O=BandApp/CN=localhost"
fi

# Pull latest images
echo "📥 Pulling latest Docker images..."
docker-compose pull

# Start development services (excluding production nginx)
echo "🚀 Starting development services..."
docker-compose up -d --build db redis minio

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
timeout=60
counter=0
until docker-compose exec -T db pg_isready -U band -d banddb > /dev/null 2>&1; do
    counter=$((counter + 1))
    if [ $counter -gt $timeout ]; then
        echo "❌ Database failed to start within $timeout seconds"
        exit 1
    fi
    printf "."
    sleep 1
done
echo " Database ready!"

# Start backend
echo "🔧 Starting backend application..."
docker-compose up -d --build backend

# Wait for backend to be ready
echo "⏳ Waiting for backend to be ready..."
timeout=120
counter=0
until curl -f http://localhost:8080/actuator/health > /dev/null 2>&1; do
    counter=$((counter + 1))
    if [ $counter -gt $timeout ]; then
        echo "❌ Backend failed to start within $timeout seconds"
        docker-compose logs backend
        exit 1
    fi
    printf "."
    sleep 2
done
echo " Backend ready!"

# Start frontend
echo "🎨 Starting frontend application..."
docker-compose up -d --build frontend

# Wait for frontend to be ready
echo "⏳ Waiting for frontend to be ready..."
timeout=60
counter=0
until curl -f http://localhost:3000 > /dev/null 2>&1; do
    counter=$((counter + 1))
    if [ $counter -gt $timeout ]; then
        echo "❌ Frontend failed to start within $timeout seconds"
        docker-compose logs frontend
        exit 1
    fi
    printf "."
    sleep 2
done
echo " Frontend ready!"

echo ""
echo "✅ Band Equipment Management System is running!"
echo ""
echo "📱 Services Available:"
echo "   • Frontend:        http://localhost:3000"
echo "   • Backend API:     http://localhost:8080"
echo "   • Database:        localhost:5432 (user: band, db: banddb)"
echo "   • Redis:           localhost:6379"
echo "   • MinIO Console:   http://localhost:9001 (bandminio/bandminio123)"
echo "   • MinIO API:       http://localhost:9000"
echo ""
echo "🔍 Monitoring:"
echo "   • Health Check:    http://localhost:8080/actuator/health"
echo "   • API Docs:        http://localhost:8080/swagger-ui.html"
echo "   • WebSocket Test:  ws://localhost:8080/ws"
echo ""
echo "📊 View logs with: docker-compose logs -f [service-name]"
echo "🛑 Stop with: docker-compose down"
echo ""

# Show initial logs
echo "📋 Recent logs:"
docker-compose logs --tail=10