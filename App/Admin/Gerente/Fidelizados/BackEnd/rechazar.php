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
  $q = $con->prepare('SELECT cliente_id FROM Fidelizacion_Solicitud WHERE solicitud_id = ? FOR UPDATE');
  $q->execute([$solicitudId]);
  $row = $q->fetch(PDO::FETCH_ASSOC);
  if(!$row){ $con->rollBack(); echo json_encode(['success'=>false,'message'=>'Solicitud no encontrada']); exit; }
  $cliente = $row['cliente_id'];
  $q = $con->prepare('UPDATE Fidelizacion_Solicitud SET solicitud_estado = "Rechazada" WHERE solicitud_id = ?');
  $q->execute([$solicitudId]);
  try { enviarCorreoFidelizacion($cliente, 'Rechazada'); } catch (Exception $e) {}
  echo json_encode(['success'=>true]);
} catch (Exception $e) {
  echo json_encode(['success'=>false,'message'=>'Error al rechazar']);
}
?>