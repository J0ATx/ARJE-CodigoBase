#!/bin/bash

# Weekly Differential Backup Script
SRC_DIR="/usr/bin"
BACKUP_DIR="/Respaldos"
DATE=$(date +"%Y-%m-%d")
DIFF_DIR="$BACKUP_DIR/differential"
FULL_BACKUP="$BACKUP_DIR/full"
SNAPSHOT_FILE="$BACKUP_DIR/rsync-weekly.snar"

mkdir -p "$DIFF_DIR" "$FULL_BACKUP"

# Differential backup: use the last full backup as base
if [ ! -f "$SNAPSHOT_FILE" ]; then
    # If no snapshot, do a full backup
    tar --listed-incremental="$SNAPSHOT_FILE" -czpf "$FULL_BACKUP/full-$DATE.tar.gz" "$SRC_DIR"
else
    tar --listed-incremental="$SNAPSHOT_FILE" -czpf "$DIFF_DIR/diff-$DATE.tar.gz" "$SRC_DIR"
fi

# Rsync for quick sync (optional)
rsync -a --delete "$SRC_DIR/" "$BACKUP_DIR/rsync-weekly-latest/"

# Remote backup settings
REMOTE_USER="your_remote_user"
REMOTE_HOST="your.remote.server"
REMOTE_DIR="/remote/backup/path"

# Send latest full backup to remote server (if created)
if [ -f "$FULL_BACKUP/full-$DATE.tar.gz" ]; then
    scp "$FULL_BACKUP/full-$DATE.tar.gz" "$REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR/" 2>/dev/null
fi

# Send latest differential backup to remote server (if exists)
if [ -f "$DIFF_DIR/diff-$DATE.tar.gz" ]; then
    scp "$DIFF_DIR/diff-$DATE.tar.gz" "$REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR/" 2>/dev/null
fi

# Optionally, sync the latest rsync backup directory to remote
rsync -az --delete "$BACKUP_DIR/rsync-weekly-latest/" "$REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR/rsync-weekly-latest/"

# Delete all daily (incremental) backups after weekly backup
INCR_DIR="$BACKUP_DIR/incremental"
if [ -d "$INCR_DIR" ]; then
    rm -rf "$INCR_DIR"/*
fi

