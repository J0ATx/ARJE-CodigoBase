<?php
require_once '../../../../Control/Conexión/conexion.php';

$response = array();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        // stock_medida se almacena en la tabla Stock_Cantidad según NUEVA.sql
        // Obtenemos una medida representativa por stock (si existen varias, tomamos la primera por orden alfabético)
        $sql = "
            SELECT s.stock_id, s.stock_nombre, MIN(sc.stock_medida) AS stock_medida
            FROM Stock s
            LEFT JOIN Stock_Cantidad sc ON sc.stock_id = s.stock_id
            GROUP BY s.stock_id, s.stock_nombre
            ORDER BY s.stock_nombre
        ";
        $stmt = $con->query($sql);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $response['success'] = true;
        $response['stock'] = $rows;
    } catch (PDOException $e) {
        $response['success'] = false;
        $response['message'] = 'Error al obtener stock: ' . $e->getMessage();
    }
} else {
    $response['success'] = false;
    $response['message'] = 'Método no permitido';
}

header('Content-Type: application/json');
echo json_encode($response);
