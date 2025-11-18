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
$reservaId = isset($data['reserva_id']) ? (int)$data['reserva_id'] : 0;
$email = $_SESSION['usuario_id'];

if ($reservaId <= 0) {
  echo json_encode(["success"=>false,"message"=>"Datos inválidos"]);
  exit;
}

try {
  $q = $con->prepare('SELECT reserva_estado, cliente_id FROM Reserva WHERE reserva_id = ?');
  $q->execute([$reservaId]);
  $res = $q->fetch(PDO::FETCH_ASSOC);
  if (!$res || $res['cliente_id'] !== $email) {
    echo json_encode(["success"=>false,"message"=>"Reserva no encontrada"]);
    exit;
  }

  $estado = (string)$res['reserva_estado'];
  if (!in_array($estado, ['Pendiente','Confirmada'])) {
    echo json_encode(["success"=>false,"message"=>"La reserva no puede cancelarse"]);
    exit;
  }

  $upd = $con->prepare('UPDATE Reserva SET reserva_estado = "Cancelada" WHERE reserva_id = ?');
  $upd->execute([$reservaId]);
  echo json_encode(["success"=>true]);
} catch (Exception $e) {
  echo json_encode(["success"=>false,"message"=>'Error: '.$e->getMessage()]);
}