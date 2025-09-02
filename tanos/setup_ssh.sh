#!/bin/bash

if ! command -v sshd >/dev/null 2>&1; then
    dnf install -y openssh-server
fi

SSHD_CONFIG="/etc/ssh/sshd_config"
sudo cp $SSHD_CONFIG $SSHD_CONFIG.bak

sudo sed -i 's/^#Port 22/Port 33264/' $SSHD_CONFIG
sudo sed -i '/Port/!s/Port 22/Port 33264/' $SSHD_CONFIG
sudo sed -i 's/^#Protocol 2/Protocol 2/' $SSHD_CONFIG
sudo sed -i 's/^#PubkeyAuthentication.*/PubkeyAuthentication yes/' $SSHD_CONFIG
sudo sed -i 's/^#PasswordAuthentication.*/PasswordAuthentication no/' $SSHD_CONFIG
sudo sed -i 's/^#PermitRootLogin.*/PermitRootLogin no/' $SSHD_CONFIG
sudo echo "AllowUsers operario" >> $SSHD_CONFIG
sudo sed -i 's/^#MaxAuthTries 6/MaxAuthTries 3/' $SSHD_CONFIG
sudo sed -i 's/^#LogLevel INFO/LogLevel VERBOSE/' $SSHD_CONFIG

systemctl restart sshd

exit 0