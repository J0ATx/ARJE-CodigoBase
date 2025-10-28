<?php
header('Content-Type: application/json');
require_once '../../../../../Control/Conexion/empleado.php';

$sql = "SELECT 
            p.pedido_id AS idPedido,
            p.mesa_id AS idMesa,
            p.personal_id AS idMozo,
            CONCAT(per.personal_nombre, ' ', per.personal_apellido) AS nombreMozo,
            p.pedido_estado AS estado,
            p.pedido_especificacion AS especificacion,
            p.pedido_monto AS monto,
            p.pedido_fecha AS fecha
        FROM Pedido p
        LEFT JOIN Personal per ON p.personal_id = per.personal_id
        WHERE p.pedido_estado != 'Pagado'
        ORDER BY p.pedido_id DESC";

$stmt = $con->query($sql);
$pedidos = $stmt->fetchAll(PDO::FETCH_ASSOC);

foreach ($pedidos as &$pedido) {
    $sqlProd = "SELECT c.producto_id, pr.producto_nombre, c.contiene_cantidad
                FROM Contiene c
                JOIN Producto pr ON c.producto_id = pr.producto_id
                WHERE c.pedido_id = ?";
    
    $stmtProd = $con->prepare($sqlProd);
    $stmtProd->execute([$pedido['idPedido']]);
    
    $productos = [];
    while ($row = $stmtProd->fetch(PDO::FETCH_ASSOC)) {
        $productos[] = [
            'idProducto' => (int)$row['producto_id'],
            'nombre' => $row['producto_nombre'],
            'contiene_cantidad' => (int)$row['contiene_cantidad']
        ];
    }
    
    $pedido['productos'] = $productos;

    $sqlClientes = "SELECT cliente_id FROM Efectua WHERE pedido_id = ?";
    $stmtClientes = $con->prepare($sqlClientes);
    $stmtClientes->execute([$pedido['idPedido']]);
    $pedido['clientes'] = $stmtClientes->fetchAll(PDO::FETCH_COLUMN);
}

unset($pedido);
echo json_encode(["success" => true, "data" => $pedidos]);
