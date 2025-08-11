#!/bin/bash

function init() {
    case $@ in
        -l | -list)
            echo "Listando servicios..."
            systemctl list-units --type=service --all
            ;;
        -s | -status)
            if [ -z "$2" ]; then
                echo "Por favor, especifique un servicio para verificar su estado."
                exit 1
            fi
            echo "Verificando el estado del servicio: $2"
            systemctl status "$2"
            ;;
        -r | -restart)
            if [ -z "$2" ]; then
                echo "Por favor, especifique un servicio para reiniciar."
                exit 1
            fi
            echo "Reiniciando el servicio: $2"
            systemctl restart "$2"
            echo "Servicio $2 reiniciado."
            ;;
        -k | -kill)
            if [ -z "$2" ]; then
                echo "Por favor, especifique un servicio para detener."
                exit 1
            fi
            echo "Deteniendo el servicio: $2"
            systemctl stop "$2"
            echo "Servicio $2 detenido."
            ;;
        -a | -active)
            echo "Listando servicios activos..."
            systemctl list-units --type=service --state=active
            ;;
        -h | -help)
            echo "Uso: $0 [opción] [servicio]"
            echo "Opciones:"
            echo "  -l, --list       Listar todos los servicios"
            echo "  -s, --status     Verificar el estado de un servicio"
            echo "  -r, --restart    Reiniciar un servicio"
            echo "  -k, --kill       Detener un servicio"
            echo "  -a, --active     Listar servicios activos"
            echo "  -h, --help       Mostrar este mensaje de ayuda"
            ;;
        *)
            echo "Opción no válida. Use -h o --help para ver las opciones disponibles."
            exit 1
            ;;
    esac
}

init "$@"