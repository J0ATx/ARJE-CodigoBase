#!/bin/bash
# Automated nftables configuration
nft flush ruleset
nft add table inet filter
nft add chain inet filter input { type filter hook input priority 0; }
nft add chain inet filter forward { type filter hook forward priority 0; }
nft add chain inet filter output { type filter hook output priority 0; }
nft add rule inet filter input ct state established,related accept
nft add rule inet filter input iif lo accept
nft add rule inet filter input ip protocol icmp accept
nft add rule inet filter input tcp dport 22 accept
nft add rule inet filter input drop
