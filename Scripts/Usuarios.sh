#!/bin/bash

function init() {

    case $option in
        -l | -list)
            echo "Listando usuarios..."
            cut -d: -f1 /etc/passwd
            ;;
        -a | -add)
            read -p "Ingrese el nombre del nuevo usuario: " username
            sudo adduser "$username"
            ;;
        -d | -delete)
            read -p "Ingrese el nombre del usuario a eliminar: " username
            sudo deluser "$username"
            ;;
        -g | -groups)
            echo "Listando grupos..."
            cut -d: -f1 /etc/group
            ;;
        *)
            echo "Opción no válida. Use -l, -a, -d o -g."
            exit 1
            ;;
    esac
}

init "$@"