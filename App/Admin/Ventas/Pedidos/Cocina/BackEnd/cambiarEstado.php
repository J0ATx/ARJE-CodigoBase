<?php

/**
 * cambiarEstado.php
 * 
 * Maneja el cambio de estado de los pedidos en la cocina.
 * Verifica el stock de ingredientes al cambiar a 'en_preparacion'.
 * 
 * Estados permitidos:
 * - pendiente → en_preparacion (con verificación de stock)
 * - en_preparacion → listo
 * - listo → (sin más cambios permitidos desde cocina)
 */

// Configuración de encabezados para respuesta JSON
header('Content-Type: application/json');
require_once '../../../../../Control/Conexión/conexion.php';

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

    // Estado actual
    $stmt = $con->prepare('SELECT pedido_estado FROM Pedido WHERE pedido_id = ?');
    $stmt->execute([$pedidoId]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$row) responder(false, 'Pedido no encontrado');
    $estadoActual = $row['pedido_estado'];

    // Transiciones válidas
    $transiciones = [
        'Pendiente' => ['En-Preparacion'],
        'En-Preparacion' => ['Listo'],
        'Listo' => []
    ];
    if (!in_array($nuevoEstado, $transiciones[$estadoActual] ?? [], true)) {
        responder(false, 'Transición de estado no permitida');
    }

    // Al pasar a En-Preparacion: verificar y descontar stock
    if ($nuevoEstado === 'En-Preparacion') {
        // Productos del pedido
        $stmt = $con->prepare('SELECT producto_id, contiene_cantidad FROM Contiene WHERE pedido_id = ?');
        $stmt->execute([$pedidoId]);
        $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if (empty($items)) responder(false, 'El pedido no tiene productos');

        // Requerimientos por (stock_id, medida)
        $req = []; // key: "stockId|medida" => cantidad
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
                $key = $sid . '|' . $med;
                if (!isset($req[$key])) $req[$key] = 0.0;
                $req[$key] += $need;
            }
        }

        // Verificar disponibilidad
        $faltantes = [];
        foreach ($req as $key => $need) {
            list($sidStr, $med) = explode('|', $key, 2);
            $sid = (int)$sidStr;
            $q = $con->prepare('SELECT COALESCE(SUM(stock_cantidad),0) FROM Stock_Cantidad WHERE stock_id = ? AND stock_medida = ?');
            $q->execute([$sid, $med]);
            $total = (float)$q->fetchColumn();
            if ($total + 1e-9 < $need) {
                $faltantes[] = ['stock_id' => $sid, 'medida' => $med, 'requerido' => $need, 'disponible' => $total];
            }
        }
        if (!empty($faltantes)) {
            $con->rollBack();
            responder(false, 'No hay suficiente stock para preparar el pedido', ['faltantes' => $faltantes]);
        }

        // Descontar de Stock_Cantidad (consumir desde filas con mayor stock)
        foreach ($req as $key => $need) {
            list($sidStr, $med) = explode('|', $key, 2);
            $sid = (int)$sidStr;
            $restante = (float)$need;
            while ($restante > 1e-9) {
                $q = $con->prepare('SELECT stock_cantidad FROM Stock_Cantidad WHERE stock_id = ? AND stock_medida = ? ORDER BY stock_cantidad DESC LIMIT 1');
                $q->execute([$sid, $med]);
                $fila = $q->fetch(PDO::FETCH_ASSOC);
                if (!$fila) throw new Exception('Inconsistencia de stock durante el descuento');
                $cantidadFila = (float)$fila['stock_cantidad'];
                $usa = min($cantidadFila, $restante);
                $nueva = $cantidadFila - $usa;
                $upd = $con->prepare('UPDATE Stock_Cantidad SET stock_cantidad = ? WHERE stock_id = ? AND stock_medida = ? AND stock_cantidad = ?');
                $upd->execute([$nueva, $sid, $med, $cantidadFila]);
                $restante -= $usa;
            }
        }
    }

    // Actualizar estado del pedido
    $up = $con->prepare('UPDATE Pedido SET pedido_estado = ? WHERE pedido_id = ?');
    $up->execute([$nuevoEstado, $pedidoId]);

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
// Revertir la transacción en caso de error
if (isset($con) && $con->inTransaction()) {
    $con->rollBack();
}
