<?php
include '../../../Control/Conexión/conexion.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['idMesa'], $data['capacidad'], $data['estadoActual'], $data['ubicacion'])) {
    http_response_code(400);
    echo json_encode(["error" => "Faltan datos"]);
    exit;
}

try {
    $sql = "UPDATE Mesa SET mesa_alcance = ?, mesa_estado = ?, mesa_ubicacion = ? WHERE mesa_id = ?";
    $stmt = $con->prepare($sql);
    $stmt->execute([$data['capacidad'], $data['estadoActual'], $data['ubicacion'], $data['idMesa']]);

    echo json_encode(["mensaje" => "Mesa actualizada"]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}

