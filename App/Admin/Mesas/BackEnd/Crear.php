<?php
include '../../../Control/Conexion/empleado.php';
require_once '../../../Componentes/permissions.php';

requireWritePermission('mesas');

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['capacidad'], $data['estadoActual'], $data['reservable'])) {
    http_response_code(400);
    echo json_encode(["error" => "Faltan datos"]);
    exit;
}

try {
    $sql = "INSERT INTO Mesa (mesa_estado, mesa_tiempo_uso, mesa_alcance, mesa_creacion, mesa_reservable)
            VALUES (?, NULL, ?, CURDATE(), ?)";
    $stmt = $con->prepare($sql);
    $stmt->execute([$data['estadoActual'], $data['capacidad'], $data['reservable']]);

    echo json_encode(["mensaje" => "Mesa creada"]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>
