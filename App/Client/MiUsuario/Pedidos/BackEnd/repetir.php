<?php
header('Content-Type: application/json');
require_once '../../../../Control/Session/checkSession.php';
require_once '../../../../Control/Conexion/clienteRegistrado.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  echo json_encode(["success"=>false,"message"=>"Método no permitido"]);
  exit;
}

if (!$response['logged_in'] || empty($_SESSION['usuario_id'])) {
  echo json_encode(["success"=>false,"message"=>"No autenticado"]);
  exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$pedidoId = isset($data['pedido_id']) ? (int)$data['pedido_id'] : 0;
$metodo = isset($data['metodo']) ? $data['metodo'] : null;
$email = $_SESSION['usuario_id'];

if ($pedidoId <= 0 || !$metodo || !in_array($metodo, ['Efectivo','Tarjeta'])) {
  echo json_encode(["success"=>false,"message"=>"Datos inválidos"]);
  exit;
}

try {
  $con->beginTransaction();

  $q = $con->prepare('SELECT p.pedido_id, p.mesa_id, p.pedido_especificacion
                      FROM Pedido p JOIN Efectua e ON p.pedido_id = e.pedido_id
                      WHERE p.pedido_id = ? AND e.cliente_id = ?');
  $q->execute([$pedidoId, $email]);
  $orig = $q->fetch(PDO::FETCH_ASSOC);
  if (!$orig) { $con->rollBack(); echo json_encode(["success"=>false,"message"=>"Pedido no encontrado"]); exit; }

  if (!empty($orig['mesa_id'])) { $con->rollBack(); echo json_encode(["success"=>false,"message"=>"Solo se pueden repetir pedidos TakeAway"]); exit; }

  $itemsQ = $con->prepare('SELECT producto_id, contiene_cantidad FROM Contiene WHERE pedido_id = ?');
  $itemsQ->execute([$pedidoId]);
  $items = $itemsQ->fetchAll(PDO::FETCH_ASSOC);
  if (empty($items)) { $con->rollBack(); echo json_encode(["success"=>false,"message"=>"Pedido sin productos"]); exit; }

  $monto = 0.0;
  $precioQ = $con->prepare('SELECT producto_precio FROM Producto WHERE producto_id = ?');
  foreach ($items as $it) {
    $pid = (int)$it['producto_id'];
    $cant = (int)$it['contiene_cantidad'];
    if ($pid<=0 || $cant<=0) continue;
    $precioQ->execute([$pid]);
    $precio = (float)$precioQ->fetchColumn();
    $monto += $precio * $cant;
  }

  $obs = trim((string)$orig['pedido_especificacion']);
  $pref = 'TAKE_AWAY: Repetición del pedido #'.$pedidoId.( $obs ? ('. '.$obs) : '' );

  $ins = $con->prepare('INSERT INTO Pedido (pedido_estado, pedido_especificacion, pedido_fecha, pedido_monto, pedido_pago, personal_id, mesa_id)
                        VALUES ("Pendiente", ?, NOW(), ?, ?, NULL, NULL)');
  $ins->execute([$pref, $monto, $metodo]);
  $nuevoId = (int)$con->lastInsertId();

  $insItem = $con->prepare('INSERT INTO Contiene (pedido_id, producto_id, contiene_cantidad) VALUES (?, ?, ?)');
  foreach ($items as $it) {
    $pid = (int)$it['producto_id'];
    $cant = (int)$it['contiene_cantidad'];
    if ($pid>0 && $cant>0) $insItem->execute([$nuevoId, $pid, $cant]);
  }

  $ef = $con->prepare('INSERT INTO Efectua (pedido_id, cliente_id) VALUES (?, ?)');
  $ef->execute([$nuevoId, $email]);

  $con->commit();
  echo json_encode(["success"=>true, "pedido_id"=>$nuevoId]);
} catch (Exception $e) {
  if ($con->inTransaction()) $con->rollBack();
  echo json_encode(["success"=>false,"message"=>'Error: '.$e->getMessage()]);
}