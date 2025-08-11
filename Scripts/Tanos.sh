#!/bin/bash

function init() {


██╗      ██████╗ ███████╗    ██████╗     ████████╗ █████╗ ███╗   ██╗ ██████╗ ███████╗
██║     ██╔═══██╗██╔════╝    ╚════██╗    ╚══██╔══╝██╔══██╗████╗  ██║██╔═══██╗██╔════╝
██║     ██║   ██║███████╗     █████╔╝       ██║   ███████║██╔██╗ ██║██║   ██║███████╗
██║     ██║   ██║╚════██║     ╚═══██╗       ██║   ██╔══██║██║╚██╗██║██║   ██║╚════██║
███████╗╚██████╔╝███████║    ██████╔╝       ██║   ██║  ██║██║ ╚████║╚██████╔╝███████║
╚══════╝ ╚═════╝ ╚══════╝    ╚═════╝        ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝ ╚══════╝
                                                                                     
    read -p "Ingrese su opción: " option

    case $option in
        -S | -services)
            ./Servicios.sh "$@"
            ;;
        -P | -processes)
            ./Procesos.sh "$@"
            ;;
        -R | -network)
            ./Red.sh "$@"
            ;;
        -L | -logs)
            ./Registros.sh "$@"
            ;;
        -U | -users)
            ./Usuarios.sh "$@"
            ;;
        -M | -monthly-backup)
            ./RespaldoMensual.sh
            ;;
        -D | -daily-backup)
            ./RespaldoDiario.sh
            ;;
        -W | -weekly-backup)
            ./RespaldoSemanal.sh
            ;;
        -I | -install)
            ./Instalacion.sh
            ;;
        5)
            echo "Saliendo..."
            exit 0
            ;;
        *)
            echo "Opción no válida. Por favor, intente de nuevo."
            init "$@"
            ;;
    esac

if [ "$#" -eq 0 ]; then
    echo "Por favor, especifique una opción."
    exit 1
fi