#!/bin/bash

function init() {
    case $@ in
        -i | -install)
            echo "Iniciando la instalación de los scripts..."
            cd /
            git clone --no-checkout https://github.com/J0ATx/Proyecto-Final-2025-Los3tanos.git
            cd /Proyecto-Final-2025-Los3tanos
            git sparse-checkout init --cone
            git sparse-checkout set Scripts
            git checkout
            ;;
        -u | -update)
            echo "Actualizando los scripts y la aplicación..."
            cd /
            git clone --no-checkout https://github.com/J0ATx/Proyecto-Final-2025-Los3tanos.git
            cd /Proyecto-Final-2025-Los3tanos
            git sparse-checkout init --cone
            git sparse-checkout set Scripts
            git checkout
            ;;
        -h | -help)
            echo "Uso: $0 [opción]"
            echo "Opciones:"
            echo "  -i, --install    Iniciar la instalación de los scripts"
            echo "  -u, --update     Actualizar los scripts y la aplicación"
            echo "  -h, --help       Mostrar este mensaje de ayuda"
            ;;
        *)
            echo "Opción no válida. Use -h o --help para ver las opciones disponibles."
            exit 1
            ;;
    esac
}

init "$2"