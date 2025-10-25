<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

include_once '../../../../Control/Conexion/clienteNoRegistrado.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        throw new Exception('Método no permitido');
    }

    $producto_id = $_GET['producto_id'] ?? null;

    if (!$producto_id) {
        throw new Exception('ID de producto requerido');
    }

    $sql_verificar_producto = "SELECT COUNT(*) as existe FROM Producto WHERE producto_id = ?";
    $stmt_producto = $con->prepare($sql_verificar_producto);
    $stmt_producto->execute([$producto_id]);
    $producto_existe = $stmt_producto->fetch(PDO::FETCH_ASSOC);

    if (!$producto_existe['existe']) {
        throw new Exception('Producto no encontrado');
    }

    $sql_comentarios = "SELECT
        c.comentario_id,
        c.cliente_id,
        cl.cliente_nombre,
        cl.cliente_apellido,
        c.comentario_contenido,
        c.comentario_calificacion,
        c.producto_id
    FROM Comentario c
    JOIN Cliente cl ON c.cliente_id = cl.cliente_id
    WHERE c.producto_id = ?
    ORDER BY c.comentario_id DESC";

    $stmt_comentarios = $con->prepare($sql_comentarios);
    $stmt_comentarios->execute([$producto_id]);
    $comentarios = $stmt_comentarios->fetchAll(PDO::FETCH_ASSOC);

    $sql_producto = "SELECT
        p.producto_id,
        p.producto_nombre,
        p.producto_precio,
        p.producto_categoria,
        p.producto_calificacion,
        COUNT(c2.comentario_id) as total_comentarios
    FROM Producto p
    LEFT JOIN Comentario c2 ON p.producto_id = c2.producto_id
    WHERE p.producto_id = ?
    GROUP BY p.producto_id, p.producto_nombre, p.producto_precio, p.producto_categoria, p.producto_calificacion";

    $stmt_producto_info = $con->prepare($sql_producto);
    $stmt_producto_info->execute([$producto_id]);
    $producto_info = $stmt_producto_info->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'producto' => $producto_info,
        'comentarios' => $comentarios
    ]);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
} catch (Throwable $th) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Error interno del servidor: ' . $th->getMessage()
    ]);
}
?>
