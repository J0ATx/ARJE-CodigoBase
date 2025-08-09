#!/bin/bash

# Monthly Full Backup Script
SRC_DIR="/usr/bin"
BACKUP_DIR="/Respaldos"
DATE=$(date +"%Y-%m-%d")
FULL_BACKUP="$BACKUP_DIR/full"

mkdir -p "$FULL_BACKUP"

# Full backup
tar -czpf "$FULL_BACKUP/full-$DATE.tar.gz" "$SRC_DIR"

# Rsync for quick sync (optional)
rsync -a --delete "$SRC_DIR/" "$BACKUP_DIR/rsync-monthly-latest/"

# Remote backup settings
REMOTE_USER="your_remote_user"
REMOTE_HOST="your.remote.server"
REMOTE_DIR="/remote/backup/path"

# Send latest full backup to remote server
scp "$FULL_BACKUP/full-$DATE.tar.gz" "$REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR/" 2>/dev/null

# Optionally, sync the latest rsync backup directory to remote
rsync -az --delete "$BACKUP_DIR/rsync-monthly-latest/" "$REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR/rsync-monthly-latest/"

# Delete all weekly (differential) backups after monthly backup
DIFF_DIR="$BACKUP_DIR/differential"
if [ -d "$DIFF_DIR" ]; then
    rm -rf "$DIFF_DIR"/*
fi