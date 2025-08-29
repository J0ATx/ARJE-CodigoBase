#!/bin/bash
# Automated SSH configuration
SSHD_CONFIG="/etc/ssh/sshd_config"
cp $SSHD_CONFIG $SSHD_CONFIG.bak
sed -i 's/^#Port 22/Port 22/' $SSHD_CONFIG
sed -i 's/^#PermitRootLogin.*/PermitRootLogin no/' $SSHD_CONFIG
sed -i 's/^#PasswordAuthentication.*/PasswordAuthentication no/' $SSHD_CONFIG
systemctl restart sshd
