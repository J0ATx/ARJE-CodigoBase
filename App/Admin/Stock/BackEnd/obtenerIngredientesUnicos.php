<?php
require_once '../../../Control/Conexión/conexion.php';

$response = array();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        // Obtener ingredientes únicos con su medida más común
        $sql = "
            SELECT 
                s.stock_nombre as nombre,
                sc.stock_medida as medida,
                COUNT(*) as num_lotes
            FROM Stock s
            INNER JOIN Stock_Cantidad sc ON s.stock_id = sc.stock_id
            GROUP BY s.stock_nombre, sc.stock_medida
            ORDER BY s.stock_nombre, num_lotes DESC
        ";
        $stmt = $con->query($sql);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Agrupar por nombre y tomar la medida más usada
        $ingredientes = [];
        foreach ($rows as $row) {
            $nombre = $row['nombre'];
            if (!isset($ingredientes[$nombre])) {
                $ingredientes[$nombre] = [
                    'nombre' => $nombre,
                    'medida' => $row['medida'],
                    'num_lotes' => (int)$row['num_lotes']
                ];
            }
        }
        
        $response['success'] = true;
        $response['ingredientes'] = array_values($ingredientes);
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
