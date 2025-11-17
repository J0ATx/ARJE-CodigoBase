<?php
header('Content-Type: application/json');
require_once '../../../../Control/Conexion/clienteRegistrado.php';

$out = ["success"=>false];

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  echo json_encode(["success"=>false,"message"=>"Método no permitido"]);
  exit;
}

$raw = file_get_contents('php://input');
$data = json_decode($raw,true);
$email = isset($data['email'])?trim(strtolower($data['email'])):'';
$metodo = isset($data['metodo'])?$data['metodo']:null;
$obs = isset($data['obs'])?$data['obs']:'';
$items = isset($data['items'])&&is_array($data['items'])?$data['items']:[];

if (!$email || empty($items)) {
  echo json_encode(["success"=>false,"message"=>"Datos incompletos"]);
  exit;
}

try {
  $con->beginTransaction();

  $stmtCliente = $con->prepare('SELECT 1 FROM Cliente WHERE cliente_id = ?');
  $stmtCliente->execute([$email]);
  if ($stmtCliente->fetchColumn() === false) {
    $con->rollBack();
    echo json_encode(["success"=>false,"message"=>"Cliente no registrado"]);
    exit;
  }

  $monto = 0.0;
  $eta = 0;
  $precios = $con->prepare('SELECT producto_precio, producto_tiempo_preparacion FROM Producto WHERE producto_id = ?');
  foreach ($items as $it) {
    $pid = isset($it['producto_id'])?(int)$it['producto_id']:0;
    $cant = isset($it['cantidad'])?(int)$it['cantidad']:1;
    if ($pid<=0 || $cant<=0) continue;
    $precios->execute([$pid]);
    $row = $precios->fetch(PDO::FETCH_ASSOC);
    $precio = (float)($row['producto_precio']??0);
    $monto += $precio*$cant;
    $t = (string)($row['producto_tiempo_preparacion']??'');
    $m = 10;
    if ($t!=='' ) {
      if (preg_match('/(\d+)(?=\s*min|$)/i',$t,$mm)) $m = (int)$mm[1];
    }
    $eta += $m*$cant;
  }
  $eta += 5;

  $requerimientosStock = [];
  $stmtConsume = $con->prepare('SELECT c.stock_id, c.consume_cantidad, c.consume_medida, s.stock_nombre 
                                FROM Consume c 
                                JOIN Stock s ON c.stock_id = s.stock_id 
                                WHERE c.producto_id = ?');
  foreach ($items as $it) {
    $pid = isset($it['producto_id'])?(int)$it['producto_id']:0;
    $cant = isset($it['cantidad'])?(int)$it['cantidad']:1;
    if ($pid>0 && $cant>0) {
      $stmtConsume->execute([$pid]);
      while ($consumo = $stmtConsume->fetch(PDO::FETCH_ASSOC)) {
        $cantidadNecesaria = (float)$consumo['consume_cantidad'] * $cant;
        $medida = $consumo['consume_medida'];
        $nombreIngrediente = $consumo['stock_nombre'];
        $key = $nombreIngrediente . '|' . $medida;
        if (!isset($requerimientosStock[$key])) {
          $requerimientosStock[$key] = [
            'cantidad' => 0,
            'medida' => $medida,
            'ingrediente' => $nombreIngrediente
          ];
        }
        $requerimientosStock[$key]['cantidad'] += $cantidadNecesaria;
      }
    }
  }

  $faltantes = [];
  $stmtStock = $con->prepare('SELECT COALESCE(SUM(sc.stock_cantidad), 0) as total
                               FROM Stock_Cantidad sc
                               JOIN Stock s ON sc.stock_id = s.stock_id
                               WHERE s.stock_nombre = ? AND sc.stock_medida = ?');
  foreach ($requerimientosStock as $req) {
    $stmtStock->execute([$req['ingrediente'], $req['medida']]);
    $stockDisponible = (float)$stmtStock->fetchColumn();
    if ($stockDisponible + 1e-9 < $req['cantidad']) {
      $faltantes[] = [
        'ingrediente' => $req['ingrediente'],
        'medida' => $req['medida'],
        'requerido' => $req['cantidad'],
        'disponible' => $stockDisponible
      ];
    }
  }

  if (!empty($faltantes)) {
    $con->rollBack();
    echo json_encode(["success"=>false, "message"=>'No hay suficiente stock para los productos seleccionados', "faltantes"=>$faltantes]);
    exit;
  }

  $pref = 'TAKE_AWAY: ' . trim($obs);
  $stmtIns = $con->prepare('INSERT INTO Pedido (pedido_estado, pedido_especificacion, pedido_fecha, pedido_monto, pedido_pago, personal_id, mesa_id) VALUES ("Pendiente", ?, NOW(), ?, ?, NULL, NULL)');
  $stmtIns->execute([$pref, $monto, $metodo]);
  $pedidoId = (int)$con->lastInsertId();

  $stmtCont = $con->prepare('INSERT INTO Contiene (pedido_id, producto_id, contiene_cantidad) VALUES (?, ?, ?)');
  foreach ($items as $it) {
    $pid = isset($it['producto_id'])?(int)$it['producto_id']:0;
    $cant = isset($it['cantidad'])?(int)$it['cantidad']:1;
    if ($pid>0 && $cant>0) $stmtCont->execute([$pedidoId,$pid,$cant]);
  }

  $stmtEf = $con->prepare('INSERT INTO Efectua (pedido_id, cliente_id) VALUES (?, ?)');
  $stmtEf->execute([$pedidoId,$email]);

  $con->commit();
  echo json_encode(["success"=>true,"pedido_id"=>$pedidoId,"eta"=>$eta]);
} catch (Exception $e) {
  if ($con->inTransaction()) $con->rollBack();
  echo json_encode(["success"=>false,"message"=>'Error: '.$e->getMessage()]);
}