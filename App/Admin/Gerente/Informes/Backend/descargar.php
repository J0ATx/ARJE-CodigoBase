<?php
    $nom = 'informe.pdf';
    $contenido = 'Esto es contenido de ejemplo en el archivo';

    $archivo = fopen($nom, 'w');

    if ($archivo) {
    fwrite($archivo, $contenido);
    
    fclose($archivo);
    
    } else {
        echo "No se pudo abrir el archivo para escritura.";
    }
?>
