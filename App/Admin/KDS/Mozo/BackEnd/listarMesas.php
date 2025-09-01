<?php
require_once '../../../../Control/Conexión/conexion.php';
header('Content-Type: application/json');
try {
    $stmt = $con->query('SELECT idMesa FROM Mesas');
    $mesas = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($mesas);
} catch (Exception $e) {
    echo json_encode([]);
}
