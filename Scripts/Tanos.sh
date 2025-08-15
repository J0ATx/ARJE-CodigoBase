#!/bin/bash

function init() {

echo "
          ██╗      ██████╗ ███████╗    ██████╗     ████████╗ █████╗ ███╗   ██╗ ██████╗ ███████╗          
          ██║     ██╔═══██╗██╔════╝    ╚════██╗    ╚══██╔══╝██╔══██╗████╗  ██║██╔═══██╗██╔════╝          
█████╗    ██║     ██║   ██║███████╗     █████╔╝       ██║   ███████║██╔██╗ ██║██║   ██║███████╗    █████╗
╚════╝    ██║     ██║   ██║╚════██║     ╚═══██╗       ██║   ██╔══██║██║╚██╗██║██║   ██║╚════██║    ╚════╝
          ███████╗╚██████╔╝███████║    ██████╔╝       ██║   ██║  ██║██║ ╚████║╚██████╔╝███████║          
          ╚══════╝ ╚═════╝ ╚══════╝    ╚═════╝        ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝ ╚══════╝          
"                                                            
    read -p "Ingrese su opción: " option

    case $option in
        -S | -services)
            ./Servicios.sh "$2"
            ;;
        -P | -processes)
            ./Procesos.sh "$2"
            ;;
        -N | -network)
            ./Red.sh "$2"
            ;;
        -L | -logs)
            ./Registros.sh "$2"
            ;;
        -U | -users)
            ./Usuarios.sh "$2"
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
        -R | -restore)
            ./Restaurar.sh
            ;;
        -I | -install)
            ./Instalacion.sh
            ;;
        -E | -exit)
            echo "Saliendo..."
            exit 0
            ;;
        -H | -help)
            echo "Opciones disponibles:"
            echo "-S, -services: Ver servicios"
            echo "-P, -processes: Ver procesos"
            echo "-R, -network: Ver red"
            echo "-L, -logs: Ver registros"
            echo "-U, -users: Ver usuarios"
            echo "-M, -monthly-backup: Realizar respaldo mensual"
            echo "-D, -daily-backup: Realizar respaldo diario"
            echo "-W, -weekly-backup: Realizar respaldo semanal"
            echo "-I, -install: Instalar dependencias"
            echo "-E, -exit: Salir del script"
            echo "-H, -help: Mostrar esta ayuda"
            init "$@"
            ;;
        *)
            echo "Opción no válida. Por favor, intente de nuevo."
            init "$@"
            ;;
    esac
}

if [ "$#" -eq 0 ]; then
    echo "Por favor, especifique una opción."
    init "$@"
fi