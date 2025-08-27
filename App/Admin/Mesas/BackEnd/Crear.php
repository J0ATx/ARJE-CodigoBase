<?php
include '../../../Control/Conexión/conexion.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['capacidad'], $data['estadoActual'], $data['ubicacion'])) {
    http_response_code(400);
    echo json_encode(["error" => "Faltan datos"]);
    exit;
}

try {
    $fechUsoOcupadoReservado = null; 
    $stmt = $con->prepare("INSERT INTO Mesas (capacidad, estadoActual, ubicacion, fechUsoOcupadoReservado) VALUES (?, ?, ?, ?)");
    $stmt->execute([$data['capacidad'], $data['estadoActual'], $data['ubicacion'], $fechUsoOcupadoReservado]);
    echo json_encode(["mensaje" => "Mesa creada"]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>