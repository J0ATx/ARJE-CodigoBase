<?php
include '../../../Control/Conexión/conexion.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['idMesa'])) {
    http_response_code(400);
    echo json_encode(["error" => "Falta idMesa"]);
    exit;
}

try {
    $stmt = $con->prepare("DELETE FROM Mesas WHERE idMesa = ?");
    $stmt->execute([$data['idMesa']]);
    echo json_encode(["mensaje" => "Mesa eliminada"]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>