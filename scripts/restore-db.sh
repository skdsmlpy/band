#!/bin/bash
# Database restore script for Band Equipment Management System

set -e

BACKUP_DIR="./backups"
BACKUP_FILE="$1"

echo "🔄 Starting database restore..."
echo "=============================="

# Check if backup file is provided
if [ -z "$BACKUP_FILE" ]; then
    echo "❌ Usage: $0 <backup_file>"
    echo ""
    echo "📚 Available backups:"
    ls -la "$BACKUP_DIR"/banddb_backup_*.sql.gz 2>/dev/null || echo "   No backups found"
    exit 1
fi

# Check if backup file exists
if [ ! -f "$BACKUP_DIR/$BACKUP_FILE" ]; then
    echo "❌ Backup file not found: $BACKUP_DIR/$BACKUP_FILE"
    echo ""
    echo "📚 Available backups:"
    ls -la "$BACKUP_DIR"/banddb_backup_*.sql.gz 2>/dev/null || echo "   No backups found"
    exit 1
fi

# Check if database container is running
if ! docker-compose ps db | grep -q "Up"; then
    echo "❌ Database container is not running. Please start the system first."
    exit 1
fi

# Warning about data loss
echo "⚠️  WARNING: This will replace ALL data in the database!"
echo "📁 Restoring from: $BACKUP_DIR/$BACKUP_FILE"
echo "📊 Backup size: $(du -h "$BACKUP_DIR/$BACKUP_FILE" | cut -f1)"
echo ""
read -p "Are you sure you want to continue? (y/N): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "🚫 Restore cancelled."
    exit 0
fi

# Stop backend to prevent connections
echo "⏸️  Stopping backend to prevent database connections..."
docker-compose stop backend

# Wait a moment for connections to close
sleep 3

echo "🔄 Starting restore process..."

# Decompress and restore
if [[ "$BACKUP_FILE" == *.gz ]]; then
    echo "📂 Decompressing and restoring backup..."
    gunzip -c "$BACKUP_DIR/$BACKUP_FILE" | docker-compose exec -T db psql -U band -d banddb
else
    echo "📂 Restoring backup..."
    cat "$BACKUP_DIR/$BACKUP_FILE" | docker-compose exec -T db psql -U band -d banddb
fi

# Check if restore was successful
if [ $? -eq 0 ]; then
    echo "✅ Database restore completed successfully!"
else
    echo "❌ Database restore failed!"
    echo "🔧 Starting backend service..."
    docker-compose start backend
    exit 1
fi

# Restart backend
echo "🚀 Starting backend service..."
docker-compose start backend

# Wait for backend to be ready
echo "⏳ Waiting for backend to be ready..."
timeout=60
counter=0
until curl -f http://localhost:8080/actuator/health > /dev/null 2>&1; do
    counter=$((counter + 1))
    if [ $counter -gt $timeout ]; then
        echo "❌ Backend failed to start within $timeout seconds"
        docker-compose logs --tail=10 backend
        echo "⚠️  Database was restored but backend may have issues"
        exit 1
    fi
    printf "."
    sleep 2
done
echo " Backend ready!"

echo ""
echo "🎉 Database restore completed successfully!"
echo ""
echo "📊 Restore Summary:"
echo "   • Source: $BACKUP_DIR/$BACKUP_FILE"
echo "   • Date: $(date)"
echo "   • Status: ✅ Success"
echo ""
echo "🔍 Verify the restore by checking:"
echo "   • Application: http://localhost:3000"
echo "   • API Health: http://localhost:8080/actuator/health"
echo ""