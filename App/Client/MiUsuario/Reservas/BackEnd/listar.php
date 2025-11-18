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
  $stmt = $con->prepare("SELECT r.reserva_id, r.reserva_cantidad_personas, r.reserva_duracion, r.reserva_fecha, r.reserva_inicio, r.reserva_estado, r.mesa_id
                          FROM Reserva r
                          WHERE r.cliente_id = ? AND r.reserva_estado != 'Cancelada' AND r.reserva_estado != 'Finalizada'
                          ORDER BY r.reserva_fecha DESC, r.reserva_inicio DESC");
  $stmt->execute([$email]);
  $reservas = $stmt->fetchAll(PDO::FETCH_ASSOC);
  echo json_encode(["success"=>true, "reservas"=>$reservas]);
} catch (Exception $e) {
  echo json_encode(["success"=>false,"message"=>'Error: '.$e->getMessage()]);
}