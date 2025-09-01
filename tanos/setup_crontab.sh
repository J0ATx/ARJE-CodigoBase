#!/bin/bash

CRON_FILE="/etc/cron.d/backups_automaticos"

DAILY_BACKUP="0 2 * * * root /bin/bash respaldo_diario"
WEEKLY_BACKUP="0 3 * * 0 root /bin/bash respaldo_semanal"
MONTHLY_BACKUP="0 4 1 * * root /bin/bash respaldo_mensual"

sudo tee "$CRON_FILE" > /dev/null <<EOF
# Automated system-wide crontab configuration for backups
$DAILY_BACKUP
$WEEKLY_BACKUP
$MONTHLY_BACKUP
EOF

sudo chmod 644 "$CRON_FILE"
sudo chown root:root "$CRON_FILE"

exit 0