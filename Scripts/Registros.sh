#!/bin/bash

# Adinistración de logs del sistema
function init() {
    case "$1" in
        -v|--view)
            echo "Mostrando los últimos 10 registros del sistema:"
            journalctl -n 10
            ;;
        -c|--clear)
            echo "Limpiando los registros del sistema (requiere privilegios de superusuario)..."
            sudo journalctl --vacuum-time=1s
            echo "Registros limpiados."
            ;;
        -e|--export)
            FILENAME="system_logs_$(date +%Y%m%d_%H%M%S).log"
            echo "Exportando registros del sistema a $FILENAME..."
            journalctl > "$FILENAME"
            echo "Registros exportados a $FILENAME."
            ;;
        *)
            echo "Uso: $0 { -v | --view | -c | --clear | -e | --export }"
            echo "  -v, --view     Ver los últimos 10 registros del sistema"
            echo "  -c, --clear    Limpiar los registros del sistema (requiere privilegios de superusuario)"
            echo "  -e, --export   Exportar todos los registros del sistema a un archivo"
            exit 1
            ;;
    esac
}

init "$@"