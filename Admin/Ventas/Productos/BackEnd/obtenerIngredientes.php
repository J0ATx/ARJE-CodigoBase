<?php
require_once '../../../../Control/Conexión/conexion.php';

$response = array();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $stmt = $con->query("SELECT * FROM Ingredientes ORDER BY nombre");
        $response['success'] = true;
        $response['ingredientes'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        $response['success'] = false;
        $response['message'] = 'Error al obtener ingredientes: ' . $e->getMessage();
    }
} else {
    $response['success'] = false;
    $response['message'] = 'Método no permitido';
}

header('Content-Type: application/json');
echo json_encode($response);
