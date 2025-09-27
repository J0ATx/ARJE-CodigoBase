<?php
require_once '../../../Control/Conexión/conexion.php';

$response = array();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $sql = "
            SELECT 
                s.stock_id AS idIngrediente,
                s.stock_nombre AS nombre,
                s.stock_caducidad AS caducidad,
                sc.stock_cantidad AS stock,
                sc.stock_medida AS medida
            FROM Stock s
            LEFT JOIN Stock_Cantidad sc ON sc.stock_id = s.stock_id
            WHERE s.stock_id = ?
        ";
        $stmt = $con->prepare($sql);
        $stmt->execute([$_POST['id']]);

        $ingrediente = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($ingrediente) {
            $response['success'] = true;
            $response['ingrediente'] = $ingrediente;
        } else {
            $response['success'] = false;
            $response['message'] = 'Ingrediente no encontrado';
        }
    } catch (PDOException $e) {
        $response['success'] = false;
        $response['message'] = 'Error al obtener el ingrediente: ' . $e->getMessage();
    }
} else {
    $response['success'] = false;
    $response['message'] = 'Método no permitido';
}

header('Content-Type: application/json');
echo json_encode($response);
