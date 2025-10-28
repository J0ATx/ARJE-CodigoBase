<?php
require_once '../../../../Control/Conexion/empleado.php';

$response = array();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $sql = "
            SELECT 
                MAX(s.stock_id) as stock_id,
                s.stock_nombre,
                sc.stock_medida,
                SUM(sc.stock_cantidad) as cantidad_total
            FROM Stock s
            INNER JOIN Stock_Cantidad sc ON sc.stock_id = s.stock_id
            WHERE sc.stock_cantidad > 0
            GROUP BY s.stock_nombre, sc.stock_medida
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
