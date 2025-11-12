<?php
require_once '../../../Control/Conexion/gerente.php';
require_once '../../../Componentes/permissions.php';

requireWritePermission('inventario');

$response = array();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $con->beginTransaction();
        
        $nombre = $_POST['nombre'];
        $medida = $_POST['medida'];
        $cantidad = $_POST['stock'];
        $caducidad = $_POST['caducidad'];
        $stockAlerta = isset($_POST['stock_alerta']) ? (int)$_POST['stock_alerta'] : 0;

        if ($stockAlerta < 0) {
            throw new Exception("La cantidad mínima de alerta debe ser mayor o igual a 0.");
        }

        $checkStmt = $con->prepare("
            SELECT DISTINCT sc.stock_medida 
            FROM Stock s
            INNER JOIN Stock_Cantidad sc ON s.stock_id = sc.stock_id
            WHERE s.stock_nombre = ?
        ");
        $checkStmt->execute([$nombre]);
        $medidasExistentes = $checkStmt->fetchAll(PDO::FETCH_COLUMN);
        
        if (!empty($medidasExistentes)) {
            if (count($medidasExistentes) > 1) {
                throw new Exception("Error: El ingrediente '{$nombre}' tiene lotes con diferentes medidas en la base de datos. Contacte al administrador.");
            }
            
            $medidaExistente = $medidasExistentes[0];
            if ($medida !== $medidaExistente) {
                throw new Exception(
                    "La medida seleccionada ({$medida}) no coincide con la medida de los lotes existentes de '{$nombre}' ({$medidaExistente}). " .
                    "Todos los lotes del mismo ingrediente deben usar la misma unidad de medida."
                );
            }
        }

        $stmtStock = $con->prepare("INSERT INTO Stock (stock_nombre, stock_caducidad, stock_alerta) VALUES (?, ?, ?)");
        $stmtStock->execute([$nombre, $caducidad, $stockAlerta]);

        $stockId = $con->lastInsertId();

        $stmtCantidad = $con->prepare("INSERT INTO Stock_Cantidad (stock_id, stock_cantidad, stock_medida) VALUES (?, ?, ?)");
        $stmtCantidad->execute([$stockId, $cantidad, $medida]);

        $con->commit();

        $response['success'] = true;
        $response['message'] = 'Lote creado con éxito';
    } catch (PDOException $e) {
        if ($con->inTransaction()) {
            $con->rollBack();
        }
        $response['success'] = false;
        $response['message'] = 'Error al crear el lote: ' . $e->getMessage();
    } catch (Exception $e) {
        if ($con->inTransaction()) {
            $con->rollBack();
        }
        $response['success'] = false;
        $response['message'] = $e->getMessage();
    }
} else {
    $response['success'] = false;
    $response['message'] = 'Método no permitido';
}

header('Content-Type: application/json');
echo json_encode($response);