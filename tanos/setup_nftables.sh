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
        type filter hook input priority filter;
        policy drop;
        ct state related,established accept
        iifname "lo" accept
        ct state invalid drop
        tcp dport { 80, 443, 3306, 33264, 5000} accept
        ip protocol tcp ct state new,untracked limit rate over 10/minute burst 5 packets add @denylist { ip saddr }
        ip saddr @denylist drop
    }

    chain output {
        type filter hook output priority filter;
        policy drop;
        ct state related,established accept;
        udp dport 53 accept;
        tcp dport { 80, 443 } accept;
        tcp dport 33264 accept;
        tcp dport 3306 accept;
    }
}
"

echo "$NFT_RULES" | sudo tee /etc/nftables.conf > /dev/null

sudo systemctl enable --now nftables

exit 0