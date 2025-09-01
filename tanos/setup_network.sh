#!/bin/bash

sudo nmcli connection modify enp0s3 ipv4.method manual ipv4.addresses "192.168.1.11/24" ipv4.gateway "192.168.1.1" ipv4.dns "8.8.8.8,8.8.4.4"

sudo hostnamectl set-hostname lostrestanos

sudo nmcli connection up enp0s3

exit 0