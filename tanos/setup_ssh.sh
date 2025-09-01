#!/bin/bash

if ! command -v sshd >/dev/null 2>&1; then
    dnf install -y openssh-server
fi

SSHD_CONFIG="/etc/ssh/sshd_config"
cp $SSHD_CONFIG $SSHD_CONFIG.bak

sed -i 's/^#Port 22/Port 33264/' $SSHD_CONFIG
sed -i '/Port/!s/Port 22/Port 33264/' $SSHD_CONFIG
sed -i 's/^#Protocol 2/Protocol 2/' $SSHD_CONFIG
sed -i 's/^#PasswordAuthentication.*/PasswordAuthentication no/' $SSHD_CONFIG
sed -i 's/^#PubkeyAuthentication.*/PubkeyAuthentication yes/' $SSHD_CONFIG
sed -i 's/^#PermitRootLogin.*/PermitRootLogin no/' $SSHD_CONFIG
echo "AllowUsers operario" >> $SSHD_CONFIG
sed -i 's/^#MaxAuthTries 6/MaxAuthTries 3/' $SSHD_CONFIG
sed -i 's/^#LogLevel INFO/LogLevel VERBOSE/' $SSHD_CONFIG

systemctl restart sshd

exit 0