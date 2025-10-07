<?php
// crearPedido.php - Crea un nuevo pedido con productos y comentario en nueva BD
header('Content-Type: application/json');
require_once '../../../../../Control/Conexión/conexion.php';
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

    // Validar que exista el mozo
    $stmt = $con->prepare('SELECT 1 FROM Personal WHERE personal_id = ?');
    $stmt->execute([$idMozo]);
    if ($stmt->fetchColumn() === false) {
        $response['message'] = 'Mozo no existe';
        echo json_encode($response);
        exit;
    }

    try {
        $con->beginTransaction();

        // Calcular monto total sumando precios de productos
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

        // Crear pedido con fecha actual, mozo y monto total
        $stmt = $con->prepare('INSERT INTO Pedido (pedido_estado, pedido_especificacion, pedido_fecha, pedido_monto, personal_id, mesa_id) VALUES ("Pendiente", ?, NOW(), ?, ?, ?)');
        $stmt->execute([$especificacion, $montoTotal, $idMozo, $mesaId]);
        $idPedido = (int)$con->lastInsertId();

        // Insertar productos en Contiene con cantidad
        $stmtCont = $con->prepare('INSERT INTO Contiene (pedido_id, producto_id, contiene_cantidad) VALUES (?, ?, ?)');
        foreach ($productos as $prod) {
            $productoId = isset($prod['idProducto']) ? (int)$prod['idProducto'] : 0;
            $cantidad = isset($prod['cantidad']) ? (int)$prod['cantidad'] : 1;
            if ($productoId > 0 && $cantidad > 0) {
                $stmtCont->execute([$idPedido, $productoId, $cantidad]);
            }
        }

        // Procesar clientes y alergias
        if (is_array($clientes) && !empty($clientes)) {
            $alergiasClientes = []; // Para almacenar alergias únicas
            
            // Primero, recopilar todas las alergias de los clientes
            foreach ($clientes as $cliente) {
                if (!is_string($cliente)) continue;
                $email = strtolower(trim($cliente));
                if ($email === '') continue;
                
                // Obtener alergias del cliente
                $stmtAler = $con->prepare('SELECT DISTINCT cliente_alergia FROM Cliente_Alergia WHERE cliente_id = ?');
                $stmtAler->execute([$email]);
                while ($alergia = $stmtAler->fetchColumn()) {
                    if (!in_array($alergia, $alergiasClientes, true)) {
                        $alergiasClientes[] = $alergia;
                    }
                }
            }
            
            // Si hay alergias, actualizar la especificación
            if (!empty($alergiasClientes)) {
                $alergiasTexto = "Alergias: " . implode(', ', $alergiasClientes);
                $nuevaEspecificacion = $especificacion . "\n\n" . $alergiasTexto;
                
                // Actualizar la especificación en la base de datos
                $stmtUpdate = $con->prepare('UPDATE Pedido SET pedido_especificacion = ? WHERE pedido_id = ?');
                $stmtUpdate->execute([$nuevaEspecificacion, $idPedido]);
                $especificacion = $nuevaEspecificacion; // Actualizar variable local
            }
            
            // Ahora insertar las relaciones Efectua
            // normalizar: trim + lowercase y únicos
            $norm = [];
            foreach ($clientes as $c) {
                if (!is_string($c)) continue;
                $email = strtolower(trim($c));
                if ($email !== '' && !in_array($email, $norm, true)) {
                    $norm[] = $email;
                }
            }

            if (!empty($norm)) {
                // validar existencia de todos los clientes
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

                // insertar relaciones
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
        $response['message'] = 'Error al crear pedido: ' . $e->getMessage();
    }
} else {
    $response['message'] = 'Método no permitido';
}

echo json_encode($response);
