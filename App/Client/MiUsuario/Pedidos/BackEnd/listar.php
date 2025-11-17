<?php
header('Content-Type: application/json');
require_once '../../../../Control/Session/checkSession.php';
require_once '../../../../Control/Conexion/clienteRegistrado.php';

if (!$response['logged_in'] || empty($_SESSION['usuario_id'])) {
  echo json_encode(["success"=>false,"message"=>"No autenticado"]);
  exit;
}

$email = $_SESSION['usuario_id'];

try {
  $stmt = $con->prepare('SELECT p.pedido_id, p.pedido_estado, p.pedido_especificacion, p.pedido_fecha, p.pedido_monto, p.pedido_pago, p.mesa_id
                          FROM Pedido p JOIN Efectua e ON p.pedido_id = e.pedido_id
                          WHERE e.cliente_id = ? ORDER BY p.pedido_fecha DESC');
  $stmt->execute([$email]);
  $pedidos = $stmt->fetchAll(PDO::FETCH_ASSOC);

  $itemsStmt = $con->prepare('SELECT c.producto_id, pr.producto_nombre AS nombre, c.contiene_cantidad AS cantidad, pr.producto_precio AS precio
                               FROM Contiene c JOIN Producto pr ON c.producto_id = pr.producto_id
                               WHERE c.pedido_id = ?');

  foreach ($pedidos as &$p) {
    $itemsStmt->execute([$p['pedido_id']]);
    $p['items'] = $itemsStmt->fetchAll(PDO::FETCH_ASSOC);
  }

  echo json_encode(["success"=>true, "pedidos"=>$pedidos]);
} catch (Exception $e) {
  echo json_encode(["success"=>false,"message"=>'Error: '.$e->getMessage()]);
}