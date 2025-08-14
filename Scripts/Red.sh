#!/bin/bash

function init() {
    case $@ in
        -c | -configure)
            echo "Configuring network settings..."
            # Add your network configuration commands here
            ;;
        -s | -status)
            echo "Checking network status..."
            nmcli general status
            ;;
        -r | -reset)
            echo "Resetting network settings..."
            nmcli connection reload
            ;;
        -h | -help)
            echo "Usage: $0 [option]"
            echo "Options:"
            echo "  -c, --configure   Configure network settings"
            echo "  -s, --status      Check network status"
            echo "  -r, --reset       Reset network settings"
            echo "  -h, --help        Show this help message"
            ;;
        *)
            echo "Invalid option. Use -h or --help for available options."
            exit 1
            ;;
    esac
}

init "$2"