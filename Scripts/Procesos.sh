#!/bin/bash

function init() {
    case $@ in
        -l | -list)
            echo "Listando procesos..."
            ps aux
            ;;
        -k | -kill)
            if [ -z "$2" ]; then
                echo "Por favor, especifique un PID para matar el proceso."
                exit 1
            fi
            echo "Matando el proceso con PID: $2"
            kill "$2"
            echo "Proceso $2 detenido."
            ;;
        -s | -status)
            if [ -z "$2" ]; then
                echo "Por favor, especifique un PID para verificar su estado."
                exit 1
            fi
            echo "Verificando el estado del proceso con PID: $2"
            ps -p "$2" -o pid,comm,state
            ;;
        -h | -help)
            echo "Uso: $0 [opción] [PID]"
            echo "Opciones:"
            echo "  -l, --list       Listar todos los procesos"
            echo "  -k, --kill       Matar un proceso por su PID"
            echo "  -s, --status     Verificar el estado de un proceso por su PID"
            echo "  -h, --help       Mostrar este mensaje de ayuda"
            ;;
        *)
            echo "Opción no válida. Use -h o --help para ver las opciones disponibles."
            exit 1
            ;;
    esac
}

init "$@"