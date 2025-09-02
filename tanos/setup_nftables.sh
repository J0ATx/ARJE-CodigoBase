#!/bin/bash

echo "Deteniendo y deshabilitando firewalld..."
sudo systemctl stop firewalld
sudo systemctl disable firewalld

if ! command -v nft &> /dev/null; then
    echo "nftables no está instalado. Procediendo con la instalación..."
    sudo dnf install -y nftables
fi

NFT_RULES="
flush ruleset

table ip filter {
    chain input {
        type filter hook input priority 0;
    }

    set denylist {
        type ipv4_addr;
        flags dynamic, timeout;
        timeout 5m;
    }

    # Bloquea temporalmente a IPs que intenten más de 10 conexiones nuevas por minuto
    rule input tcp dport ssh ct state new, untracked limit rate over 10/minute add @denylist { ip saddr }
    
    # Descarta todo el tráfico de las IPs en la lista negra
    rule input ip saddr @denylist drop
}
"

echo "$NFT_RULES" | sudo tee /etc/nftables.conf > /dev/null

sudo systemctl enable --now nftables

exit 0