<?php
header('Content-Type: application/json');
require_once '../../../../Control/Session/checkSession.php';
require_once '../../../../Control/Conexion/gerente.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['success' => false, 'message' => 'Método no permitido']);
  exit;
}

if (!$response['logged_in']) {
  http_response_code(401);
  echo json_encode(['success' => false, 'message' => 'No autenticado']);
  exit;
}

try {
  $chk = $con->prepare("SELECT COUNT(*) AS c FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Fidelizacion_Solicitud'");
  $chk->execute();
  $exists = $chk->fetch(PDO::FETCH_ASSOC);
  if (!$exists || (int)$exists['c'] === 0) {
    echo json_encode(['success' => true, 'solicitudes' => []]);
    exit;
  }

  $search = null;
  if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = $_POST;
    if (!$input) {
      $raw = file_get_contents('php://input');
      $dec = json_decode($raw, true);
      if (is_array($dec)) $input = $dec;
    }
    if (isset($input['search']) && strlen(trim($input['search'])) > 0) {
      $search = trim($input['search']);
    }
  }

  $where = '';
  $params = [];
  if ($search) {
    $where = "WHERE (c.cliente_nombre LIKE ? OR c.cliente_apellido LIKE ? OR s.cliente_id LIKE ? OR s.solicitud_estado LIKE ?)";
    $like = '%'.$search.'%';
    $params = [$like,$like,$like,$like];
  }

  $sql = "SELECT s.solicitud_id, s.cliente_id, s.solicitud_fecha, s.solicitud_estado,
                  c.cliente_nombre, c.cliente_apellido, c.cliente_telefono, c.cliente_fidelizado,
                  (SELECT COUNT(*) FROM Efectua e WHERE e.cliente_id = c.cliente_id) AS pedidos_count
           FROM Fidelizacion_Solicitud s
           JOIN Cliente c ON c.cliente_id = s.cliente_id
           $where
           ORDER BY s.solicitud_fecha DESC";
  $stmt = $con->prepare($sql);
  $stmt->execute($params);
  $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
  echo json_encode(['success' => true, 'solicitudes' => $rows]);
} catch (Exception $e) {
  echo json_encode(['success' => false, 'message' => 'Error al listar, ' . $e->getMessage()]);
}
