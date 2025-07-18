<?php 
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        if (isset($_FILES['favicon'])) {
            $archivo = $_FILES['favicon'];
            // $nombre = basename($archivo['name']);
            $extension = pathinfo($archivo['name'], PATHINFO_EXTENSION);
            $nombre = 'favicon.' . $extension;
            $destino = '../../Recursos/' . $nombre;

            // Crear carpeta si no existe
            // if (!is_dir('uploads')) {
            //     mkdir('uploads', 0777, true);
            // }

            if (move_uploaded_file($archivo['tmp_name'], $destino)) {
                echo $destino;
            } else {
                echo json_encode(['error' => 'Error al mover el archivo.']);
            }
        }
        if (isset($_FILES['logo'])) {
            $archivo = $_FILES['logo'];
            // $nombre = basename($archivo['name']);
            $extension = pathinfo($archivo['name'], PATHINFO_EXTENSION);
            $nombre = 'logo.' . $extension;
            $destino = '../../Recursos/' . $nombre;

            // Crear carpeta si no existe
            // if (!is_dir('uploads')) {
            //     mkdir('uploads', 0777, true);
            // }

            if (move_uploaded_file($archivo['tmp_name'], $destino)) {
                echo $destino;
            } else {
                echo json_encode(['error' => 'Error al mover el archivo.']);
            }
        } else {
            echo json_encode(['error' => 'No se ha enviado ningún archivo.']);
        }
    } else {
        echo json_encode(['error' => 'Método de solicitud no permitido.']);
    }
?>