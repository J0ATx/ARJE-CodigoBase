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
        'allowed_types' => ['jpg', 'jpeg', 'png', 'gif']
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

    
    $stmt = $con->prepare("SELECT usuario_img FROM Datos_Usuarios WHERE usuario_id = ?");
    $stmt->execute([$_SESSION["usuario_id"]]);
    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
    $rutaDestino = $config['avatar']['dir'] . $usuario['usuario_img'];
    array_map('unlink', glob($config['avatar']['dir'] . $usuario['usuario_img'] . '.*'));
    
    if (!move_uploaded_file($file['tmp_name'], $rutaDestino)) {
        throw new Exception("Error al guardar la imagen de perfil");
    }


    echo json_encode([
        'success' => true,
        'message' => 'Foto de perfil actualizada correctamente',
        'avatar' => $usuario['usuario_img']
    ]);
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
