#!/bin/bash

SRC_DIR="/usr/bin"
BACKUP_DIR="/Respaldos"
DATE=$(date +"%Y-%m-%d")
INCR_DIR="$BACKUP_DIR/incremental"
FULL_BACKUP="$BACKUP_DIR/full"
SNAPSHOT_FILE="$BACKUP_DIR/rsync.snar"

mkdir -p "$INCR_DIR" "$FULL_BACKUP"

# Full backup if no snapshot exists
if [ ! -f "$SNAPSHOT_FILE" ]; then
    tar --listed-incremental="$SNAPSHOT_FILE" -czpf "$FULL_BACKUP/full-$DATE.tar.gz" "$SRC_DIR"
else
    tar --listed-incremental="$SNAPSHOT_FILE" -czpf "$INCR_DIR/incr-$DATE.tar.gz" "$SRC_DIR"
fi

# Rsync for quick incremental sync (optional, for redundancy)
rsync -a --delete "$SRC_DIR/" "$BACKUP_DIR/rsync-latest/"

# Remote backup settings
REMOTE_USER="your_remote_user"
REMOTE_HOST="your.remote.server"
REMOTE_DIR="/remote/backup/path"

# Send latest full backup to remote server
scp "$FULL_BACKUP/full-$DATE.tar.gz" "$REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR/" 2>/dev/null

# Send latest incremental backup to remote server (if exists)
if [ -f "$INCR_DIR/incr-$DATE.tar.gz" ]; then
    scp "$INCR_DIR/incr-$DATE.tar.gz" "$REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR/" 2>/dev/null
fi

# Optionally, sync the latest rsync backup directory to remote
rsync -az --delete "$BACKUP_DIR/rsync-latest/" "$REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR/rsync-latest/"