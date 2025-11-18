<?php
header('Content-Type: application/json');
require_once '../../../../Control/Session/checkSession.php';
require_once '../../../../Control/Conexion/gerente.php';
require_once './notificaciones.php';

try {
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

  $raw = file_get_contents('php://input');
  $data = json_decode($raw, true);
  if (!is_array($data)) $data = $_POST;

  $solicitudId = isset($data['solicitud_id']) ? (int)$data['solicitud_id'] : 0;
  $nuevoEstado = isset($data['estado']) ? $data['estado'] : null;
  $permitidos = ['Pendiente','Aprobada','Rechazada'];
  if ($solicitudId <= 0 || !in_array($nuevoEstado, $permitidos)) {
    echo json_encode(['success'=>false,'message'=>'Parámetros inválidos']);
    exit;
  }

  $con->beginTransaction();
  $q = $con->prepare('SELECT cliente_id FROM Fidelizacion_Solicitud WHERE solicitud_id = ? FOR UPDATE');
  $q->execute([$solicitudId]);
  $row = $q->fetch(PDO::FETCH_ASSOC);
  if(!$row){ $con->rollBack(); echo json_encode(['success'=>false,'message'=>'Solicitud no encontrada']); exit; }
  $cliente = $row['cliente_id'];

  $u1 = $con->prepare('UPDATE Fidelizacion_Solicitud SET solicitud_estado = ? WHERE solicitud_id = ?');
  $u1->execute([$nuevoEstado, $solicitudId]);

  $u2 = $con->prepare('UPDATE Cliente SET cliente_fidelizado = ? WHERE cliente_id = ?');
  $u2->execute([$nuevoEstado === 'Aprobada' ? 1 : 0, $cliente]);

  $con->commit();
  if ($nuevoEstado === 'Aprobada' || $nuevoEstado === 'Rechazada') {
    try {
      $cntQ = $con->prepare('SELECT COUNT(*) AS c FROM Efectua WHERE cliente_id = ?');
      $cntQ->execute([$cliente]);
      $cnt = $cntQ->fetch(PDO::FETCH_ASSOC);
      enviarCorreoFidelizacion($cliente, $nuevoEstado, $cnt ? (int)$cnt['c'] : null);
    } catch (Exception $e) {}
  }
  echo json_encode(['success'=>true]);
} catch (Exception $e) {
  if ($con && $con->inTransaction()) $con->rollBack();
  echo json_encode(['success'=>false,'message'=>'Error al editar']);
}
?>