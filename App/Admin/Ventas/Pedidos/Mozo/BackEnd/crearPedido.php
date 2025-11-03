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
    $montoTotal = 0;

    if (!$mesaId || !$idMozo || empty($productos) || !is_array($productos)) {
        $response['message'] = 'Datos incompletos';
        echo json_encode($response);
        exit;
    }

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

        if (!empty($productos)) {
            foreach ($productos as $prod) {
                $productoId = isset($prod['idProducto']) ? (int)$prod['idProducto'] : 0;
                $cantidad = isset($prod['cantidad']) ? (int)$prod['cantidad'] : 1;
                
                if ($productoId > 0 && $cantidad > 0) {
                    $stmtPrecio = $con->prepare('SELECT producto_precio FROM Producto WHERE producto_id = ?');
                    $stmtPrecio->execute([$productoId]);
                    $precio = (float)$stmtPrecio->fetchColumn();
                    $montoTotal += $precio * $cantidad;

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
                }
            }
        }

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
            $response['message'] = 'No hay suficiente stock para los productos seleccionados';
            $response['faltantes'] = $faltantes;
            echo json_encode($response);
            exit;
        }

        $stmt = $con->prepare('INSERT INTO Pedido (pedido_estado, pedido_especificacion, pedido_fecha, pedido_monto, personal_id, mesa_id) VALUES ("Pendiente", ?, NOW(), ?, ?, ?)');
        $stmt->execute([$especificacion, $montoTotal, $idMozo, $mesaId]);
        $idPedido = (int)$con->lastInsertId();

        $stmtMesa = $con->prepare('UPDATE Mesa SET mesa_estado = "Ocupada" WHERE mesa_id = ?');
        $stmtMesa->execute([$mesaId]);

        $stmtCont = $con->prepare('INSERT INTO Contiene (pedido_id, producto_id, contiene_cantidad) VALUES (?, ?, ?)');
        foreach ($productos as $prod) {
            $productoId = isset($prod['idProducto']) ? (int)$prod['idProducto'] : 0;
            $cantidad = isset($prod['cantidad']) ? (int)$prod['cantidad'] : 1;
            if ($productoId > 0 && $cantidad > 0) {
                $stmtCont->execute([$idPedido, $productoId, $cantidad]);
            }
        }

        if (is_array($clientes) && !empty($clientes)) {
            $alergiasClientes = [];
            
            foreach ($clientes as $cliente) {
                if (!is_string($cliente)) continue;
                $email = strtolower(trim($cliente));
                if ($email === '') continue;
                
                $stmtAler = $con->prepare('SELECT DISTINCT cliente_alergia FROM Cliente_Alergia WHERE cliente_id = ?');
                $stmtAler->execute([$email]);
                while ($alergia = $stmtAler->fetchColumn()) {
                    if (!in_array($alergia, $alergiasClientes, true)) {
                        $alergiasClientes[] = $alergia;
                    }
                }
            }
            
            if (!empty($alergiasClientes)) {
                $alergiasTexto = "Alergias: " . implode(', ', $alergiasClientes);
                $nuevaEspecificacion = $especificacion . "\n\n" . $alergiasTexto;
                
                $stmtUpdate = $con->prepare('UPDATE Pedido SET pedido_especificacion = ? WHERE pedido_id = ?');
                $stmtUpdate->execute([$nuevaEspecificacion, $idPedido]);
                $especificacion = $nuevaEspecificacion;
            }
            
            $norm = [];
            foreach ($clientes as $c) {
                if (!is_string($c)) continue;
                $email = strtolower(trim($c));
                if ($email !== '' && !in_array($email, $norm, true)) {
                    $norm[] = $email;
                }
            }

            if (!empty($norm)) {
                $faltantes = [];
                $stmtChk = $con->prepare('SELECT 1 FROM Cliente WHERE cliente_id = ?');
                foreach ($norm as $email) {
                    $stmtChk->execute([$email]);
                    if ($stmtChk->fetchColumn() === false) {
                        $faltantes[] = $email;
                    }
                }
                if (!empty($faltantes)) {
                    $con->rollBack();
                    $response['message'] = 'Clientes no registrados: ' . implode(', ', $faltantes);
                    echo json_encode($response);
                    exit;
                }

                $stmtEf = $con->prepare('INSERT INTO Efectua (pedido_id, cliente_id) VALUES (?, ?)');
                foreach ($norm as $email) {
                    $stmtEf->execute([$idPedido, $email]);
                }
            }
        }

        $con->commit();
        $response['success'] = true;
        $response['idPedido'] = $idPedido;
    } catch (Exception $e) {
        if ($con->inTransaction()) $con->rollBack();
        if($e->getCode() == 23000) {
            $response['message'] = 'No puedes ingresar 2 productos iguales, para eso modifica su cantidad.';
        } else {
            $response['message'] = 'Error al crear pedido: ' . $e->getMessage();
        }
    }
} else {
    $response['message'] = 'Método no permitido';
}

echo json_encode($response);
