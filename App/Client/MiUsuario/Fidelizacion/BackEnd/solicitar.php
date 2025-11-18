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

$email = $_SESSION['usuario_id'];

try {
  $chkTable = $con->prepare("SELECT COUNT(*) AS c FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Fidelizacion_Solicitud'");
  $chkTable->execute();
  $exists = $chkTable->fetch(PDO::FETCH_ASSOC);
  if (!$exists || (int)$exists['c'] === 0) {
    echo json_encode(["success"=>false, "message"=>'Módulo no inicializado']);
    exit;
  }

  $chk = $con->prepare('SELECT solicitud_estado FROM Fidelizacion_Solicitud WHERE cliente_id = ? ORDER BY solicitud_id DESC LIMIT 1');
  $chk->execute([$email]);
  $last = $chk->fetch(PDO::FETCH_ASSOC);
  if ($last && $last['solicitud_estado'] === 'Pendiente') {
    echo json_encode(["success"=>false,"message"=>"Ya tienes una solicitud pendiente"]);
    exit;
  }

  $s = $con->prepare('INSERT INTO Fidelizacion_Solicitud (cliente_id, solicitud_fecha, solicitud_estado) VALUES (?, NOW(), "Pendiente")');
  $s->execute([$email]);
  echo json_encode(["success"=>true]);
} catch (Exception $e) {
  echo json_encode(["success"=>false, "message"=>'Error: '.$e->getMessage()]);
}
?>