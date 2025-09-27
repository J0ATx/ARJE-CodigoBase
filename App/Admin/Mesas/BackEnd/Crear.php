<?php
include '../../../Control/Conexión/conexion.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['capacidad'], $data['estadoActual'], $data['ubicacion'])) {
    http_response_code(400);
    echo json_encode(["error" => "Faltan datos"]);
    exit;
}

try {
    $sql = "INSERT INTO Mesa (mesa_estado, mesa_ubicacion, mesa_tiempo_uso, mesa_alcance, mesa_creacion)
            VALUES (?, ?, NULL, ?, CURDATE())";
    $stmt = $con->prepare($sql);
    $stmt->execute([$data['estadoActual'], $data['ubicacion'], $data['capacidad']]);

    echo json_encode(["mensaje" => "Mesa creada"]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>