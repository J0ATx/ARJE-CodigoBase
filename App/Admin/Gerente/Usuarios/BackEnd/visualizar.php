<?php
header('Content-Type: application/json');
include '../../../../Control/Conexion/gerente.php';

try {
    $sql = "SELECT * FROM Datos_Usuarios";
    $stmt = $con->query($sql);
    $usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "usuarios" => $usuarios
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Error al obtener usuarios"
    ]);
}
