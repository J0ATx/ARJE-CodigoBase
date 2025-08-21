<?php
require_once '../../../../Control/Conexión/conexion.php';

$response = array();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $stmt = $con->prepare("SELECT * FROM Productos WHERE idProducto = ?");
        $stmt->execute([$_POST['id']]);
        
        $producto = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($producto) {
            $stmt = $con->prepare("
                SELECT i.*, inc.cantidad
                FROM Ingredientes i
                JOIN Incluye inc ON i.idIngrediente = inc.idIngrediente
                WHERE inc.idProducto = ?
            ");
            $stmt->execute([$_POST['id']]);
            $ingredientes = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            $stmt = $con->prepare("
                SELECT r.*, rp.paso, rp.idPaso
                FROM Recetas r
                LEFT JOIN RecetasPasos rp ON r.idReceta = rp.idReceta
                WHERE r.idProducto = ?
                ORDER BY rp.idPaso
            ");
            $stmt->execute([$_POST['id']]);
            $pasos = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $producto['ingredientes'] = $ingredientes;
            $producto['pasos'] = $pasos;
            
            $response['success'] = true;
            $response['producto'] = $producto;
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
