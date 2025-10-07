<?php
require_once '../../../../../Control/Conexión/conexion.php';
header('Content-Type: application/json');
try {
    $stmt = $con->query('SELECT mesa_id FROM Mesa ORDER BY mesa_id');
    $mesas = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($mesas);
} catch (Exception $e) {
    echo json_encode([]);
}
