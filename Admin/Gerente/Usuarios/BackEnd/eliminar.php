<?php
include '../../../../Control/Conexión/conexion.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['idUsuario'])) {
    http_response_code(400);
    echo json_encode(["error" => "Falta idUsuario"]);
    exit;
}

try {
    $stmt = $con->prepare("DELETE FROM Usuario WHERE idUsuario = ?");
    $stmt->execute([$data['idUsuario']]);
    echo json_encode(["mensaje" => "Usuario eliminado"]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>