<?php
// editarPedido.php - Edita productos y comentarios de un pedido (nueva BD)
header('Content-Type: application/json');
require_once '../../../../../Control/Conexión/conexion.php';

$response = ["success" => false];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $idPedido = isset($_POST['idPedido']) ? (int)$_POST['idPedido'] : null;
    $especificacion = $_POST['especificacion'] ?? '';
    $productos = json_decode($_POST['productos'] ?? '[]', true); // [{idProducto, cantidad}]
    $clientes = isset($_POST['clientes']) ? json_decode($_POST['clientes'], true) : null; // array de emails o null
    $idMozo = isset($_POST['idMozo']) ? $_POST['idMozo'] : null; // ID del mozo seleccionado
    
    if (!$idPedido || !is_array($productos) || !$idMozo) {
        $response['message'] = 'Datos incompletos';
        echo json_encode($response);
        exit;
    }
    
    try {
        // Validar que el pedido existe
        $stmt = $con->prepare('SELECT pedido_id FROM Pedido WHERE pedido_id = ?');
        $stmt->execute([$idPedido]);
        if (!$stmt->fetchColumn()) {
            $response['message'] = 'Pedido no encontrado';
            echo json_encode($response);
            exit;
        }
        
        // Validar que el mozo existe
        $stmt = $con->prepare('SELECT 1 FROM Personal WHERE personal_id = ?');
        $stmt->execute([$idMozo]);
        if (!$stmt->fetchColumn()) {
            $response['message'] = 'Mozo no encontrado';
            echo json_encode($response);
            exit;
        }
        
        $con->beginTransaction();

        // Calcular monto total sumando precios de productos
        $montoTotal = 0;
        if (!empty($productos)) {
            foreach ($productos as $prod) {
                $productoId = isset($prod['idProducto']) ? (int)$prod['idProducto'] : 0;
                $cantidad = isset($prod['cantidad']) ? (int)$prod['cantidad'] : 1;
                if ($productoId > 0 && $cantidad > 0) {
                    $stmtPrecio = $con->prepare('SELECT producto_precio FROM Producto WHERE producto_id = ?');
                    $stmtPrecio->execute([$productoId]);
                    $precio = (float)$stmtPrecio->fetchColumn();
                    $montoTotal += $precio * $cantidad;
                }
            }
        }

        // Actualizar especificación, mozo y monto en el pedido
        $stmt = $con->prepare('UPDATE Pedido SET pedido_especificacion = ?, personal_id = ?, pedido_monto = ? WHERE pedido_id = ?');
        $stmt->execute([$especificacion, $idMozo, $montoTotal, $idPedido]);

        // Reemplazar productos en Contiene con cantidad
        $con->prepare('DELETE FROM Contiene WHERE pedido_id = ?')->execute([$idPedido]);
        if (!empty($productos)) {
            $stmtIns = $con->prepare('INSERT INTO Contiene (pedido_id, producto_id, contiene_cantidad) VALUES (?, ?, ?)');
            foreach ($productos as $prod) {
                $productoId = isset($prod['idProducto']) ? (int)$prod['idProducto'] : 0;
                $cantidad = isset($prod['cantidad']) ? (int)$prod['cantidad'] : 1;
                if ($productoId > 0 && $cantidad > 0) {
                    $stmtIns->execute([$idPedido, $productoId, $cantidad]);
                }
            }
        }

        // Si se envió lista de clientes, reemplazar Efectua
        if (is_array($clientes)) {
            // normalizar emails
            $norm = [];
            $alergiasClientes = []; // Para almacenar alergias únicas
            
            foreach ($clientes as $c) {
                if (!is_string($c)) continue;
                $email = strtolower(trim($c));
                if ($email !== '' && !in_array($email, $norm, true)) {
                    $norm[] = $email;
                    
                    // Obtener alergias del cliente
                    $stmtAler = $con->prepare('SELECT DISTINCT cliente_alergia FROM Cliente_Alergia WHERE cliente_id = ?');
                    $stmtAler->execute([$email]);
                    while ($alergia = $stmtAler->fetchColumn()) {
                        if (!in_array($alergia, $alergiasClientes, true)) {
                            $alergiasClientes[] = $alergia;
                        }
                    }
                }
            }
            
            // Si hay alergias, agregarlas a las especificaciones
            if (!empty($alergiasClientes)) {
                $alergiasTexto = "\n\nAlergias: " . implode(', ', $alergiasClientes);
                $especificacion = $especificacion . $alergiasTexto;
                
                // Actualizar la especificación en la base de datos
                $stmtUpdate = $con->prepare('UPDATE Pedido SET pedido_especificacion = ? WHERE pedido_id = ?');
                $stmtUpdate->execute([$especificacion, $idPedido]);
            }

            if (!empty($norm)) {
                // validar existencia
                $faltantes = [];
                $chk = $con->prepare('SELECT 1 FROM Cliente WHERE cliente_id = ?');
                foreach ($norm as $email) {
                    $chk->execute([$email]);
                    if ($chk->fetchColumn() === false) $faltantes[] = $email;
                }
                if (!empty($faltantes)) {
                    $con->rollBack();
                    $response['message'] = 'Clientes no registrados: ' . implode(', ', $faltantes);
                    echo json_encode($response);
                    exit;
                }

                // reemplazar Efectua
                $con->prepare('DELETE FROM Efectua WHERE pedido_id = ?')->execute([$idPedido]);
                $insEf = $con->prepare('INSERT INTO Efectua (pedido_id, cliente_id) VALUES (?, ?)');
                foreach ($norm as $email) {
                    $insEf->execute([$idPedido, $email]);
                }
            } else {
                // si array vacío, limpiar Efectua
                $con->prepare('DELETE FROM Efectua WHERE pedido_id = ?')->execute([$idPedido]);
            }
        }

        $con->commit();
        $response['success'] = true;
    } catch (Exception $e) {
        if ($con->inTransaction()) $con->rollBack();
        $response['message'] = 'Error al editar pedido: ' . $e->getMessage();
    }
} else {
    $response['message'] = 'Método no permitido';
}

echo json_encode($response);
