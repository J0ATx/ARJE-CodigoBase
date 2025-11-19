<?php
header('Content-Type: application/json');
require_once '../../../../../Control/Conexion/empleado.php';
session_start();

$response = ["success" => false];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $mesaId = isset($_POST['idMesa']) ? (int)$_POST['idMesa'] : null;
    $especificacion = $_POST['especificacion'] ?? '';
    $productos = json_decode($_POST['productos'] ?? '[]', true);
    $clientes = json_decode($_POST['clientes'] ?? '[]', true); 
    $idMozo = isset($_POST['idMozo']) ? $_POST['idMozo'] : null;
    
    // 1. Capturamos las promociones enviadas desde el JS
    $promociones = json_decode($_POST['promociones'] ?? '[]', true);

    if (!$mesaId || !$idMozo || empty($productos) || !is_array($productos)) {
        $response['message'] = 'Datos incompletos';
        echo json_encode($response);
        exit;
    }

    // Verificar mozo
    $stmt = $con->prepare('SELECT 1 FROM Personal WHERE personal_id = ?');
    $stmt->execute([$idMozo]);
    if ($stmt->fetchColumn() === false) {
        $response['message'] = 'Mozo no existe';
        echo json_encode($response);
        exit;
    }

    try {
        $con->beginTransaction();

        $montoTotal = 0;
        $requerimientosStock = [];

        // 2. Lógica de Cálculo de Precio con Promociones
        if (!empty($productos)) {
            foreach ($productos as $prod) {
                $productoId = isset($prod['idProducto']) ? (int)$prod['idProducto'] : 0;
                $cantidad = isset($prod['cantidad']) ? (int)$prod['cantidad'] : 1;
                
                if ($productoId > 0 && $cantidad > 0) {
                    // Obtener precio base
                    $stmtPrecio = $con->prepare('SELECT producto_precio FROM Producto WHERE producto_id = ?');
                    $stmtPrecio->execute([$productoId]);
                    $precioBase = (float)$stmtPrecio->fetchColumn();
                    
                    // Calcular descuento
                    $descuentoMonto = 0;
                    if (!empty($promociones)) {
                        foreach ($promociones as $promo) {
                            // Si la promo aplica a ESTE producto específico
                            if (intval($promo['producto_id']) === $productoId) {
                                // Asumiendo que el descuento viene en porcentaje (ej: 10 para 10%)
                                $porcentaje = (float)$promo['descuento'];
                                $descuentoMonto += ($precioBase * ($porcentaje / 100));
                            }
                        }
                    }
                    
                    // Precio final no puede ser menor a 0
                    $precioFinalUnitario = max(0, $precioBase - $descuentoMonto);
                    $montoTotal += $precioFinalUnitario * $cantidad;

                    // --- Lógica de Stock (Sin cambios) ---
                    $stmtConsume = $con->prepare('SELECT c.stock_id, c.consume_cantidad, c.consume_medida, s.stock_nombre 
                                                FROM Consume c 
                                                JOIN Stock s ON c.stock_id = s.stock_id 
                                                WHERE c.producto_id = ?');
                    $stmtConsume->execute([$productoId]);
                    
                    while ($consumo = $stmtConsume->fetch(PDO::FETCH_ASSOC)) {
                        $stockId = (int)$consumo['stock_id'];
                        $cantidadNecesaria = (float)$consumo['consume_cantidad'] * $cantidad;
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
                    // -------------------------------------
                }
            }
        }

        // 3. Validación de Stock (Sin cambios)
        $faltantes = [];
        foreach ($requerimientosStock as $key => $req) {
            $stmtStock = $con->prepare('SELECT COALESCE(SUM(sc.stock_cantidad), 0) as total
                                      FROM Stock_Cantidad sc
                                      JOIN Stock s ON sc.stock_id = s.stock_id
                                      WHERE s.stock_nombre = ? AND sc.stock_medida = ?');
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
            $response['message'] = 'No hay suficiente stock';
            $response['faltantes'] = $faltantes;
            echo json_encode($response);
            exit;
        }

        // 4. Insertar Pedido con el monto calculado (ya con descuento)
        $stmt = $con->prepare('INSERT INTO Pedido (pedido_estado, pedido_especificacion, pedido_fecha, pedido_monto, personal_id, mesa_id) VALUES ("Pendiente", ?, NOW(), ?, ?, ?)');
        $stmt->execute([$especificacion, $montoTotal, $idMozo, $mesaId]);
        $idPedido = (int)$con->lastInsertId();

        $stmtMesa = $con->prepare('UPDATE Mesa SET mesa_estado = "Ocupada" WHERE mesa_id = ?');
        $stmtMesa->execute([$mesaId]);

        // Insertar Contiene (Productos)
        $stmtCont = $con->prepare('INSERT INTO Contiene (pedido_id, producto_id, contiene_cantidad) VALUES (?, ?, ?)');
        foreach ($productos as $prod) {
            $productoId = isset($prod['idProducto']) ? (int)$prod['idProducto'] : 0;
            $cantidad = isset($prod['cantidad']) ? (int)$prod['cantidad'] : 1;
            if ($productoId > 0 && $cantidad > 0) {
                $stmtCont->execute([$idPedido, $productoId, $cantidad]);
            }
        }

        // 5. Insertar Relación de Promociones (Tabla Posee)
        if (!empty($promociones)) {
            $stmtPosee = $con->prepare('INSERT INTO Posee (promocion_id, producto_id, pedido_id) VALUES (?, ?, ?)');
            foreach ($promociones as $promo) {
                // Validar integridad
                if(isset($promo['promocion_id']) && isset($promo['producto_id'])) {
                    $stmtPosee->execute([
                        $promo['promocion_id'],
                        $promo['producto_id'],
                        $idPedido
                    ]);
                }
            }
        }

        // 6. Manejo de Clientes (Efectua) (Sin cambios importantes)
        if (is_array($clientes) && !empty($clientes)) {
            // ... (Lógica de alergias y validación de email existente) ...
            // Nota: He resumido esta parte para brevedad, pega aquí tu bloque original de clientes
            // si tienes lógica de alergias compleja, pero asegúrate de usar $idPedido.
            
            // Bloque básico de inserción de clientes:
            $norm = [];
            foreach ($clientes as $c) {
                if (!is_string($c)) continue;
                $email = strtolower(trim($c));
                if ($email !== '' && !in_array($email, $norm, true)) $norm[] = $email;
            }

            if (!empty($norm)) {
                $stmtEf = $con->prepare('INSERT INTO Efectua (pedido_id, cliente_id) VALUES (?, ?)');
                foreach ($norm as $email) {
                    // Verificar existencia (opcional, ya deberías tenerlo validado)
                    $chk = $con->prepare('SELECT 1 FROM Cliente WHERE cliente_id = ?');
                    $chk->execute([$email]);
                    if($chk->fetchColumn()){
                        $stmtEf->execute([$idPedido, $email]);
                    }
                }
            }
        }

        $con->commit();
        $response['success'] = true;
        $response['idPedido'] = $idPedido;
        
    } catch (Exception $e) {
        if ($con->inTransaction()) $con->rollBack();
        $response['message'] = 'Error al crear pedido: ' . $e->getMessage();
    }
} else {
    $response['message'] = 'Método no permitido';
}

echo json_encode($response);
?>