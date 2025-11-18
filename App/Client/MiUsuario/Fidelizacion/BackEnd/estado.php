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
  $chk = $con->prepare("SELECT COUNT(*) AS c FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Fidelizacion_Solicitud'");
  $chk->execute();
  $exists = $chk->fetch(PDO::FETCH_ASSOC);
  $stmt = $con->prepare('SELECT cliente_fidelizado FROM Cliente WHERE cliente_id = ?');
  $stmt->execute([$email]);
  $row = $stmt->fetch(PDO::FETCH_ASSOC);
  $fidelizado = $row ? (bool)$row['cliente_fidelizado'] : false;

  $qPedidos = $con->prepare('SELECT COUNT(*) as c FROM Efectua WHERE cliente_id = ?');
  $qPedidos->execute([$email]);
  $cnt = $qPedidos->fetch(PDO::FETCH_ASSOC);
  $pedidos = $cnt ? (int)$cnt['c'] : 0;

  $estado = null;
  if ($exists && (int)$exists['c'] > 0) {
    $qSol = $con->prepare('SELECT solicitud_estado FROM Fidelizacion_Solicitud WHERE cliente_id = ? ORDER BY solicitud_id DESC LIMIT 1');
    $qSol->execute([$email]);
    $sol = $qSol->fetch(PDO::FETCH_ASSOC);
    $estado = $sol ? $sol['solicitud_estado'] : null;
  }

  echo json_encode(["success"=>true, "fidelizado"=>$fidelizado, "pedidos_count"=>$pedidos, "solicitud_estado"=>$estado]);
} catch (Exception $e) {
  echo json_encode(["success"=>false, "message"=>'Error: '.$e->getMessage()]);
}
?>