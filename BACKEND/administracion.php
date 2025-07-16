<?php

    include_once 'control/conexion.php';

    $archivo = $_FILES['archivo'];
    $nombre = basename($archivo['name']);
    $destino = 'uploads/' . $nombre;
    
    if (!is_dir('uploads')) {
        mkdir('uploads', 0777, true);
    }

















       
    // include_once 'control/conexion.php';
    
    // if (isset($_FILES['archivo']) && $_FILES['archivo']['error'] === UPLOAD_ERR_OK) {
    //     $archivo = $_FILES['archivo'];
    //     $nombre = basename($archivo['name']);
    //     $destino = 'uploads/' . $nombre;
    
    //     // Allowed MIME types and extensions
    //     $allowedTypes = [
    //         'image/jpeg' => 'jpg',
    //         'image/png'  => 'png',
    //         'application/pdf' => 'pdf'
    //     ];
    //     $fileType = mime_content_type($archivo['tmp_name']);
    //     $fileExt = strtolower(pathinfo($nombre, PATHINFO_EXTENSION));
    
    //     if (array_key_exists($fileType, $allowedTypes) && $allowedTypes[$fileType] === $fileExt) {
    //         if (!is_dir('uploads')) {
    //             mkdir('uploads', 0777, true);
    //         }
    //         if (move_uploaded_file($archivo['tmp_name'], $destino)) {
    //             echo "Archivo subido correctamente.";
    //         } else {
    //             echo "Error al mover el archivo.";
    //         }
    //     } else {
    //         echo "Tipo de archivo no permitido.";
    //     }
    // } else {
    //     echo "No se ha subido ningún archivo o hubo un error.";
    // }
    
?>
