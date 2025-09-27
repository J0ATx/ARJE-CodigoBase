<?php
require_once '../../../Control/Conexión/conexion.php';

$response = array();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $search = isset($_POST['search']) ? trim($_POST['search']) : '';

        if ($search === '') {
            $sql = "
                SELECT 
                    s.stock_id AS idIngrediente,
                    s.stock_nombre AS nombre,
                    s.stock_caducidad AS caducidad,
                    sc.stock_cantidad AS stock,
                    sc.stock_medida AS medida
                FROM Stock s
                LEFT JOIN Stock_Cantidad sc ON sc.stock_id = s.stock_id
                ORDER BY s.stock_nombre
            ";
            $stmt = $con->query($sql);
        } else {
            $sql = "
                SELECT 
                    s.stock_id AS idIngrediente,
                    s.stock_nombre AS nombre,
                    s.stock_caducidad AS caducidad,
                    sc.stock_cantidad AS stock,
                    sc.stock_medida AS medida
                FROM Stock s
                LEFT JOIN Stock_Cantidad sc ON sc.stock_id = s.stock_id
                WHERE s.stock_nombre LIKE ?
                ORDER BY s.stock_nombre
            ";
            $stmt = $con->prepare($sql);
            $stmt->execute(['%' . $search . '%']);
        }

        $response['success'] = true;
        $response['ingredientes'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        $response['success'] = false;
        $response['message'] = 'Error al cargar los ingredientes: ' . $e->getMessage();
    }
} else {
    $response['success'] = false;
    $response['message'] = 'Método no permitido';
}

header('Content-Type: application/json');
echo json_encode($response);
