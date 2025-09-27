<?php
require_once '../../../../Control/Conexión/conexion.php';

$response = array();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $stmt = $con->query("SELECT DISTINCT producto_categoria FROM Producto WHERE producto_categoria IS NOT NULL AND producto_categoria <> '' ORDER BY producto_categoria");
        $rows = $stmt->fetchAll(PDO::FETCH_COLUMN);
        $response['success'] = true;
        $response['categorias'] = $rows;
    } catch (PDOException $e) {
        $response['success'] = false;
        $response['message'] = 'Error al obtener categorías: ' . $e->getMessage();
    }
} else {
    $response['success'] = false;
    $response['message'] = 'Método no permitido';
}

header('Content-Type: application/json');
echo json_encode($response);
