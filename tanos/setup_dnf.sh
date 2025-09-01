#!/bin/bash

if ! rpm -q dnf-automatic >/dev/null 2>&1; then
    sudo dnf install -y dnf-automatic
fi

sudo tee /etc/dnf/automatic.conf > /dev/null <<EOF
# Configuraciones de dnf-automatic
[commands]
upgrade_type = default
apply_updates = yes
reboot = when-needed
download_updates = yes
auto_install = yes
random_sleep = 360

[emitters]
emit_via = motd

[base]
debuglevel = 1
EOF

sudo mkdir -p /etc/systemd/system/dnf-automatic.timer.d/

sudo tee /etc/systemd/system/dnf-automatic.timer.d/override.conf > /dev/null <<EOF
[Timer]
# Borra la configuración por defecto
OnCalendar=
# Programa la ejecución anual el 1 de agosto a la medianoche
OnCalendar=*-08-01 00:00:00
# Agrega un retraso aleatorio de hasta 10 minutos para evitar picos de carga en el servidor de repositorios
RandomizedDelaySec=10m
# Asegura que si el sistema está apagado en la fecha, el servicio se ejecute tan pronto como se encienda
Persistent=true
EOF

sudo systemctl daemon-reload
sudo systemctl restart dnf-automatic.timer

exit 0