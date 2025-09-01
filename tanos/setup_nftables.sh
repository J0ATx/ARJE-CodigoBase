#!/bin/bash

sudo systemctl stop firewalld
sudo systemctl disable firewalld

if ! command -v nft &> /dev/null; then
    sudo dnf install -y nftables
fi

sudo nft add table ip filter
sudo nft add chain ip filter input { type filter hook input priority 0 \; }
sudo nft add set ip filter denylist { type ipv4_addr \; flags dynamic, timeout \; timeout 5m \; }
sudo nft add rule ip filter input ip protocol tcp ct state new, untracked limit rate over 10/minute tadd @denylist { ip saddr }
sudo nft add rule ip filter input ip saddr @denylist drop

sudo nft list ruleset > /etc/nftables.conf

sudo systemctl enable --now nftables

exit 0