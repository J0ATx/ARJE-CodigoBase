<?php
require_once '../../../../Control/Conexión/conexion.php';

$response = array();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $stmt = $con->prepare("SELECT * FROM Producto WHERE producto_id = ?");
        $stmt->execute([$_POST['id']]);
        $producto = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($producto) {
            // Map to new response structure
            $prod = array(
                'producto_id' => (int)$producto['producto_id'],
                'producto_nombre' => $producto['producto_nombre'],
                'producto_precio' => (float)$producto['producto_precio'],
                'producto_categoria' => $producto['producto_categoria'],
                'producto_receta' => $producto['producto_receta'],
                'producto_tiempo_preparacion' => $producto['producto_tiempo_preparacion'],
                'producto_calificacion' => isset($producto['producto_calificacion']) ? (float)$producto['producto_calificacion'] : null,
                'ingredientes' => []
            );

            // Ingredients from Consume + Stock
            $stmt = $con->prepare("SELECT c.stock_id, s.stock_nombre, c.consume_cantidad, c.consume_medida
                                   FROM Consume c JOIN Stock s ON c.stock_id = s.stock_id
                                   WHERE c.producto_id = ?");
            $stmt->execute([$_POST['id']]);
            $prod['ingredientes'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            $response['success'] = true;
            $response['producto'] = $prod;
        } else {
            $response['success'] = false;
            $response['message'] = 'Producto no encontrado';
        }
    } catch (PDOException $e) {
        $response['success'] = false;
        $response['message'] = 'Error al obtener el producto: ' . $e->getMessage();
    }
} else {
    $response['success'] = false;
    $response['message'] = 'Método no permitido';
}

header('Content-Type: application/json');
echo json_encode($response);
