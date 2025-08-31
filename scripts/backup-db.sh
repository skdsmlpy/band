#!/bin/bash
# Database backup script for Band Equipment Management System

set -e

BACKUP_DIR="./backups"
DATE=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="banddb_backup_${DATE}.sql"
RETENTION_DAYS=${RETENTION_DAYS:-30}

echo "🗄️  Starting database backup..."
echo "=============================="

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Check if database container is running
if ! docker-compose ps db | grep -q "Up"; then
    echo "❌ Database container is not running. Please start the system first."
    exit 1
fi

# Create database backup
echo "📊 Creating backup: $BACKUP_FILE"
docker-compose exec -T db pg_dump -U band -d banddb --verbose --clean --if-exists > "$BACKUP_DIR/$BACKUP_FILE"

# Check if backup was successful
if [ $? -eq 0 ] && [ -s "$BACKUP_DIR/$BACKUP_FILE" ]; then
    echo "✅ Backup created successfully!"
    
    # Compress the backup
    echo "🗜️  Compressing backup..."
    gzip "$BACKUP_DIR/$BACKUP_FILE"
    BACKUP_FILE="${BACKUP_FILE}.gz"
    
    echo "📁 Backup saved as: $BACKUP_DIR/$BACKUP_FILE"
    echo "💾 Backup size: $(du -h "$BACKUP_DIR/$BACKUP_FILE" | cut -f1)"
else
    echo "❌ Backup failed!"
    rm -f "$BACKUP_DIR/$BACKUP_FILE"
    exit 1
fi

# Clean up old backups
echo ""
echo "🧹 Cleaning up backups older than $RETENTION_DAYS days..."
find "$BACKUP_DIR" -name "banddb_backup_*.sql.gz" -type f -mtime +$RETENTION_DAYS -delete
REMAINING_BACKUPS=$(find "$BACKUP_DIR" -name "banddb_backup_*.sql.gz" -type f | wc -l)
echo "📚 $REMAINING_BACKUPS backup(s) retained"

# Display backup information
echo ""
echo "📋 Backup Summary:"
echo "   • File: $BACKUP_DIR/$BACKUP_FILE"
echo "   • Date: $(date)"
echo "   • Size: $(du -h "$BACKUP_DIR/$BACKUP_FILE" | cut -f1)"
echo ""
echo "🔄 To restore this backup, use:"
echo "   ./scripts/restore-db.sh $BACKUP_FILE"
echo ""