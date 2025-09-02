<?php
// listarPedidos.php - Lista todos los pedidos activos (no entregados) para cocina
header('Content-Type: application/json');
require_once '../../../../Control/Conexión/conexion.php';

$sql = "SELECT p.idPedido, pf.idMesa, pf.idUsuario as idMozo, p.estado, p.horaIngreso, p.horaFinalizacion,
    GROUP_CONCAT(t.idProducto) as productos,
    GROUP_CONCAT(prod.nombre) as nombres_productos,
    GROUP_CONCAT(e.especificacion) as comentarios
FROM Pedido p
JOIN PedidoFisico pf ON p.idPedido = pf.idPedido
LEFT JOIN Tiene t ON p.idPedido = t.idPedido
LEFT JOIN Productos prod ON t.idProducto = prod.idProducto
LEFT JOIN EspecificacionesPedido ep ON p.idPedido = ep.idPedido
LEFT JOIN Especificaciones e ON ep.idEspecificacion = e.idEspecificacion
WHERE p.estado != 'entregado'
GROUP BY p.idPedido, pf.idMesa, pf.idUsuario, p.estado, p.horaIngreso, p.horaFinalizacion
ORDER BY p.horaIngreso DESC";

$stmt = $con->query($sql);
$pedidos = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode(["success" => true, "data" => $pedidos]);
