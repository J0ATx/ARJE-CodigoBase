<?php
require_once '../../../../../Control/Conexión/conexion.php';
header('Content-Type: application/json');
try {
    $stmt = $con->query('SELECT producto_id, producto_nombre FROM Producto ORDER BY producto_nombre');
    $productos = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($productos);
} catch (Exception $e) {
    echo json_encode([]);
}
