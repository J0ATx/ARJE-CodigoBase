<?php
require_once '../../../../Control/Conexion/empleado.php';

$response = array();

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['productId'])) {
    try {
        $productId = $_POST['productId'];


        $stmt = $con->prepare("SELECT * FROM Producto WHERE producto_id = ?");
        $stmt->execute([$productId]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $imagePath = null;
        $imageDir = '../../../../Recursos/productos/';
        $files = glob($imageDir . $row['producto_id'] . '.*');
        if (!empty($files)) {
            $imagePath = str_replace('', '', $files[0]);
        }
        if ($row) {
            $producto = array(
                'producto_id' => (int)$row['producto_id'],
                'producto_nombre' => $row['producto_nombre'],
                'producto_precio' => (float)$row['producto_precio'],
                'producto_calificacion' => isset($row['producto_calificacion']) ? (float)$row['producto_calificacion'] : null,
                'producto_categoria' => $row['producto_categoria'],
                'producto_receta' => $row['producto_receta'],
                'producto_tiempo_preparacion' => $row['producto_tiempo_preparacion'],
                'ingredientes' => [],
                'imagen_url' => $imagePath
            );

            $stmt = $con->prepare("SELECT s.stock_nombre, c.consume_cantidad, c.consume_medida
                                   FROM Consume c JOIN Stock s ON c.stock_id = s.stock_id
                                   WHERE c.producto_id = ?");
            $stmt->execute([$productId]);
            $producto['ingredientes'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $response['success'] = true;
            $response['producto'] = $producto;
        } else {
            $response['success'] = false;
            $response['message'] = 'Producto no encontrado';
        }
    } catch (PDOException $e) {
        $response['success'] = false;
        $response['message'] = 'Error en la base de datos: ' . $e->getMessage();
    }
} else {
    $response['success'] = false;
    $response['message'] = 'Solicitud inválida';
}

header('Content-Type: application/json');
echo json_encode($response);
