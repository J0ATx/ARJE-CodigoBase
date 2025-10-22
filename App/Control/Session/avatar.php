<?php
require_once "../Conexion/clienteRegistrado.php";
session_start();

if (!isset($_SESSION["usuario_id"])) {
    http_response_code(403);
    exit("Acceso no autorizado");
}

header('Content-Type: application/json');

try {
    $img = $_SESSION['img'];
    $avatar = "default.png";
    foreach ($files = glob("../../Recursos/avatars/$img.*") as $path){
        $avatar = basename($path);
    }
    echo json_encode([
        'success' => true,
        'avatar' => $avatar ?? "default.png"
    ]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}