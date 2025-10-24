<?php
require_once "../../../Control/Conexion/clienteRegistrado.php";
session_start();

if (!isset($_SESSION["usuario_id"])) {
    http_response_code(403);
    exit("Acceso no autorizado");
}

header('Content-Type: application/json');

$config = [
    'avatar' => [
        'dir' => '../../../Recursos/avatars/',
        'max_size' => 2 * 1024 * 1024,
        'allowed_types' => ['jpg', 'jpeg', 'png']
    ]
];

try {
    if (!isset($_FILES['fotoPerfil']) || $_FILES['fotoPerfil']['error'] !== UPLOAD_ERR_OK) {
        throw new Exception("No se ha subido ninguna imagen o hubo un error");
    }

    $file = $_FILES['fotoPerfil'];
    $fileExt = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    
    if (!in_array($fileExt, $config['avatar']['allowed_types'])) {
        throw new Exception("Tipo de archivo no permitido. Formatos aceptados: " .
            implode(', ', $config['avatar']['allowed_types']));
    }

    if ($file['size'] > $config['avatar']['max_size']) {
        throw new Exception("El archivo es demasiado grande. Tamaño máximo: 2MB");
    }

    
    $rutaDestino = $config['avatar']['dir'] . $_SESSION['img'] . "." . $fileExt;
    array_map('unlink', glob($config['avatar']['dir'] . $_SESSION['img'] . '.*'));
    
    if (!move_uploaded_file($file['tmp_name'], $rutaDestino)) {
        echo json_encode([$file['tmp_name']]);
    }


    echo json_encode([
        'success' => true,
        'message' => 'Foto de perfil actualizada correctamente',
        'avatar' => $_SESSION['img'] . "." . $fileExt,
        'name' => $file['tmp_name']
    ]);
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}