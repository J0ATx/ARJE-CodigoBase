#!/bin/bash

sudo systemctl stop firewalld
sudo systemctl disable firewalld

if ! command -v nft &> /dev/null; then
    echo "nftables no está instalado. Procediendo con la instalación..."
    sudo dnf install -y nftables
fi

NFT_RULES="
flush ruleset

table ip filter {
    set denylist {
        type ipv4_addr
        size 65535
        flags dynamic, timeout
        timeout 5m
        }
        
    chain input {
        type filter hook input priority filter; policy accept;
        ip protocol tcp ct state new,untracked limit rate over 10/minute burst 5 packets add @denylist { ip saddr }
        ip saddr @denylist drop
    }
}
"

echo "$NFT_RULES" | sudo tee /etc/nftables.conf > /dev/null

sudo systemctl enable --now nftables

exit 0