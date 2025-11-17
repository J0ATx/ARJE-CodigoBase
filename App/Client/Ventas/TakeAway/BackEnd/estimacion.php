<?php
header('Content-Type: application/json');
require_once '../../../../Control/Conexion/clienteNoRegistrado.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  echo json_encode(["success"=>false]);
  exit;
}
$data = json_decode(file_get_contents('php://input'),true);
$items = isset($data['items'])&&is_array($data['items'])?$data['items']:[];
$eta = 0;
$q = $con->prepare('SELECT producto_tiempo_preparacion FROM Producto WHERE producto_id = ?');
foreach ($items as $it) {
  $pid = isset($it['producto_id'])?(int)$it['producto_id']:0;
  $cant = isset($it['cantidad'])?(int)$it['cantidad']:1;
  if ($pid<=0 || $cant<=0) continue;
  $q->execute([$pid]);
  $t = (string)($q->fetchColumn()?:'');
  $m = 10;
  if ($t!=='') {
    if (preg_match('/(\d+)(?=\s*min|$)/i',$t,$mm)) $m = (int)$mm[1];
  }
  $eta += $m*$cant;
}
$eta += 5;
echo json_encode(["success"=>true,"eta"=>$eta]);