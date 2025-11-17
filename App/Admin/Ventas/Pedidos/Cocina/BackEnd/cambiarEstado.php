<?php

header('Content-Type: application/json');
require_once '../../../../../Control/Conexion/empleado.php';
require_once '../../../../../Client/Ventas/TakeAway/BackEnd/notificaciones.php';

function responder($ok, $msg, $data = [])
{
    $out = ['success' => $ok, 'message' => $msg];
    if (!empty($data)) $out['data'] = $data;
    echo json_encode($out, JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    responder(false, 'Método no permitido. Se requiere POST.');
}

$pedidoId = filter_input(INPUT_POST, 'idPedido', FILTER_VALIDATE_INT);
$nuevoEstado = $_POST['nuevoEstado'] ?? '';

$estadosPermitidos = ['Pendiente', 'En-Preparacion', 'Listo'];
if (!$pedidoId || !in_array($nuevoEstado, $estadosPermitidos, true)) {
    responder(false, 'Datos inválidos: idPedido y nuevoEstado requeridos.');
}

try {
    $con->beginTransaction();

    $stmt = $con->prepare('SELECT pedido_estado FROM Pedido WHERE pedido_id = ?');
    $stmt->execute([$pedidoId]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$row) responder(false, 'Pedido no encontrado');
    $estadoActual = $row['pedido_estado'];

    $transiciones = [
        'Pendiente' => ['En-Preparacion'],
        'En-Preparacion' => ['Listo'],
        'Listo' => []
    ];
    if (!in_array($nuevoEstado, $transiciones[$estadoActual] ?? [], true)) {
        responder(false, 'Transición de estado no permitida');
    }

    if ($nuevoEstado === 'En-Preparacion') {
        $stmt = $con->prepare('SELECT producto_id, contiene_cantidad FROM Contiene WHERE pedido_id = ?');
        $stmt->execute([$pedidoId]);
        $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if (empty($items)) responder(false, 'El pedido no tiene productos');

        $req = [];
        foreach ($items as $it) {
            $productoId = (int)$it['producto_id'];
            $cantProd = (int)$it['contiene_cantidad'];
            if ($productoId <= 0 || $cantProd <= 0) continue;

            $q = $con->prepare('SELECT stock_id, consume_cantidad, consume_medida FROM Consume WHERE producto_id = ?');
            $q->execute([$productoId]);
            foreach ($q->fetchAll(PDO::FETCH_ASSOC) as $c) {
                $sid = (int)$c['stock_id'];
                $med = $c['consume_medida'];
                $need = (float)$c['consume_cantidad'] * $cantProd;
                
                $qNombre = $con->prepare('SELECT stock_nombre FROM Stock WHERE stock_id = ?');
                $qNombre->execute([$sid]);
                $nombreRow = $qNombre->fetch(PDO::FETCH_ASSOC);
                if (!$nombreRow) continue;
                $ingredienteNombre = $nombreRow['stock_nombre'];
                
                $key = $ingredienteNombre . '|' . $med;
                if (!isset($req[$key])) $req[$key] = 0.0;
                $req[$key] += $need;
            }
        }

        $faltantes = [];
        foreach ($req as $key => $need) {
            list($ingredienteNombre, $med) = explode('|', $key, 2);
            
            $q = $con->prepare('
                SELECT COALESCE(SUM(sc.stock_cantidad), 0) as total
                FROM Stock s
                JOIN Stock_Cantidad sc ON s.stock_id = sc.stock_id
                WHERE s.stock_nombre = ? AND sc.stock_medida = ?
            ');
            $q->execute([$ingredienteNombre, $med]);
            $total = (float)$q->fetchColumn();
            
            if ($total + 1e-9 < $need) {
                $faltantes[] = [
                    'ingrediente' => $ingredienteNombre, 
                    'medida' => $med, 
                    'requerido' => $need, 
                    'disponible' => $total
                ];
            }
        }
        if (!empty($faltantes)) {
            $con->rollBack();
            responder(false, 'No hay suficiente stock para preparar el pedido', ['faltantes' => $faltantes]);
        }

        foreach ($req as $key => $need) {
            list($ingredienteNombre, $med) = explode('|', $key, 2);
            $restante = (float)$need;
            
            $qLotes = $con->prepare('
                SELECT s.stock_id, sc.stock_cantidad, s.stock_caducidad
                FROM Stock s
                JOIN Stock_Cantidad sc ON s.stock_id = sc.stock_id
                WHERE s.stock_nombre = ? AND sc.stock_medida = ? AND sc.stock_cantidad > 0
                ORDER BY s.stock_caducidad ASC, s.stock_id ASC
            ');
            $qLotes->execute([$ingredienteNombre, $med]);
            $lotes = $qLotes->fetchAll(PDO::FETCH_ASSOC);
            
            foreach ($lotes as $lote) {
                if ($restante <= 1e-9) break;
                
                $stockId = (int)$lote['stock_id'];
                $cantidadDisponible = (float)$lote['stock_cantidad'];
                $usa = min($cantidadDisponible, $restante);
                $nueva = $cantidadDisponible - $usa;
                
                $upd = $con->prepare('
                    UPDATE Stock_Cantidad 
                    SET stock_cantidad = ? 
                    WHERE stock_id = ? AND stock_medida = ? AND stock_cantidad = ?
                ');
                $upd->execute([$nueva, $stockId, $med, $cantidadDisponible]);
                
                $restante -= $usa;
            }
            
            if ($restante > 1e-9) {
                throw new Exception("Inconsistencia: no se pudo consumir todo el stock requerido de {$ingredienteNombre}");
            }
        }
    }

    $up = $con->prepare('UPDATE Pedido SET pedido_estado = ? WHERE pedido_id = ?');
    $up->execute([$nuevoEstado, $pedidoId]);

    if ($nuevoEstado === 'Listo') {
        $qMesa = $con->prepare('SELECT mesa_id FROM Pedido WHERE pedido_id = ?');
        $qMesa->execute([$pedidoId]);
        $mesaId = $qMesa->fetchColumn();
        if (!$mesaId) {
            $qCli = $con->prepare('SELECT cliente_id FROM Efectua WHERE pedido_id = ? LIMIT 1');
            $qCli->execute([$pedidoId]);
            $email = $qCli->fetchColumn();
            if ($email) {
                try { enviarPedidoListo($email, $pedidoId); } catch (Exception $e) {}
            }
        }
    }

    $con->commit();
    responder(true, 'Estado actualizado correctamente', [
        'idPedido' => $pedidoId,
        'estado_anterior' => $estadoActual,
        'nuevo_estado' => $nuevoEstado
    ]);
} catch (Exception $e) {
    if ($con->inTransaction()) $con->rollBack();
    responder(false, 'Error: ' . $e->getMessage());
}
if (isset($con) && $con->inTransaction()) {
    $con->rollBack();
}
