<?php
// listarPedidos.php - Lista todos los pedidos activos (no entregados) para cocina
header('Content-Type: application/json');
require_once '../../../../Control/Conexión/conexion.php';

$sql = "
    SELECT 
        p.pedido_id AS idPedido,
        p.mesa_id AS idMesa,
        p.personal_id AS idMozo,
        p.pedido_estado AS estado,
        GROUP_CONCAT(c.producto_id) AS productos,
        GROUP_CONCAT(pr.producto_nombre) AS nombres_productos,
        p.pedido_especificacion AS comentarios,
        p.pedido_fecha AS fecha
    FROM Pedido p
    LEFT JOIN Contiene c ON p.pedido_id = c.pedido_id
    LEFT JOIN Producto pr ON c.producto_id = pr.producto_id
    WHERE p.pedido_estado != 'Pagado'
    GROUP BY p.pedido_id, p.mesa_id, p.personal_id, p.pedido_estado, p.pedido_especificacion
    ORDER BY p.pedido_id DESC
";

try {
    $stmt = $con->query($sql);
    $pedidos = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(["success" => true, "data" => $pedidos]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
