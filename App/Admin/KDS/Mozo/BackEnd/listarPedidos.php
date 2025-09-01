<?php
// listarPedidos.php - Lista todos los pedidos activos (no entregados)
header('Content-Type: application/json');
require_once '../../../../Control/Conexión/conexion.php';

// Consulta para obtener los pedidos activos
$sql = "SELECT 
            p.idPedido, 
            pf.idMesa, 
            pf.idUsuario as idMozo, 
            p.estado, 
            p.horaIngreso, 
            p.horaFinalizacion,
            GROUP_CONCAT(DISTINCT e.especificacion SEPARATOR ', ') as especificaciones
        FROM Pedido p
        JOIN PedidoFisico pf ON p.idPedido = pf.idPedido
        LEFT JOIN EspecificacionesPedido ep ON p.idPedido = ep.idPedido
        LEFT JOIN Especificaciones e ON ep.idEspecificacion = e.idEspecificacion
        WHERE p.estado != 'entregado'
        GROUP BY p.idPedido
        ORDER BY p.horaIngreso DESC";

$stmt = $con->query($sql);
$pedidos = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Para cada pedido, obtener los productos
foreach ($pedidos as &$pedido) {
    // Obtener los productos del pedido
    $sqlProd = "SELECT t.idProducto, pr.nombre
                FROM Tiene t
                JOIN Productos pr ON t.idProducto = pr.idProducto
                WHERE t.idPedido = ?";
    
    $stmtProd = $con->prepare($sqlProd);
    $stmtProd->execute([$pedido['idPedido']]);
    
    $productos = [];
    while ($row = $stmtProd->fetch(PDO::FETCH_ASSOC)) {
        $productos[] = [
            'idProducto' => $row['idProducto'],
            'nombre' => $row['nombre']
        ];
    }
    
    $pedido['productos'] = $productos;
    $pedido['especificacion'] = $pedido['especificaciones'] ?? '';
    unset($pedido['especificaciones']);
}

unset($pedido);
echo json_encode(["success" => true, "data" => $pedidos]);
