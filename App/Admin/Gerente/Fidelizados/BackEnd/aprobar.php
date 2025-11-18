<?php
header('Content-Type: application/json');
require_once '../../../../Control/Session/checkSession.php';
require_once '../../../../Control/Conexion/gerente.php';
require_once './notificaciones.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['success'=>false,'message'=>'Método no permitido']);
  exit;
}

if (!$response['logged_in']) {
  http_response_code(401);
  echo json_encode(['success'=>false,'message'=>'No autenticado']);
  exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$solicitudId = isset($data['solicitud_id']) ? (int)$data['solicitud_id'] : 0;
if ($solicitudId <= 0) {
  echo json_encode(['success'=>false,'message'=>'Solicitud inválida']);
  exit;
}

try {
  $con->beginTransaction();
  $q = $con->prepare('SELECT cliente_id, solicitud_estado FROM Fidelizacion_Solicitud WHERE solicitud_id = ? FOR UPDATE');
  $q->execute([$solicitudId]);
  $row = $q->fetch(PDO::FETCH_ASSOC);
  if(!$row){ $con->rollBack(); echo json_encode(['success'=>false,'message'=>'Solicitud no encontrada']); exit; }
  if($row['solicitud_estado'] !== 'Pendiente'){ $con->rollBack(); echo json_encode(['success'=>false,'message'=>'La solicitud ya fue procesada']); exit; }

  $cliente = $row['cliente_id'];
  $u1 = $con->prepare('UPDATE Fidelizacion_Solicitud SET solicitud_estado = "Aprobada" WHERE solicitud_id = ?');
  $u1->execute([$solicitudId]);
  $u2 = $con->prepare('UPDATE Cliente SET cliente_fidelizado = TRUE WHERE cliente_id = ?');
  $u2->execute([$cliente]);
  $con->commit();
  try {
    $cntQ = $con->prepare('SELECT COUNT(*) AS c FROM Efectua WHERE cliente_id = ?');
    $cntQ->execute([$cliente]);
    $cnt = $cntQ->fetch(PDO::FETCH_ASSOC);
    enviarCorreoFidelizacion($cliente, 'Aprobada', $cnt ? (int)$cnt['c'] : null);
  } catch (Exception $e) {}
  echo json_encode(['success'=>true]);
} catch (Exception $e) {
  $con->rollBack();
  echo json_encode(['success'=>false,'message'=>'Error al aprobar']);
}
?>