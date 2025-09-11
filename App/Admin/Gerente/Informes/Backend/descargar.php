<?php
    $nom = 'informe.pdf';
    $contenido = 'Esto es contenido de ejemplo en el archivo';

    $archivo = fopen($nom, 'w');

    if ($archivo) {
    // Escribir el contenido en el archivo
    fwrite($archivo, $contenido);
    
    // Cerrar el archivo
    fclose($archivo);
    
    } else {
        echo "No se pudo abrir el archivo para escritura.";
    }
?>