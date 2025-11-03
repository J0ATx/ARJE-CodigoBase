<?php
require_once '../../../Control/Conexion/gerente.php';

$response = array();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $con->beginTransaction();

        $stockAlerta = isset($_POST['stock_alerta']) ? (int)$_POST['stock_alerta'] : 0;

        if ($stockAlerta < 0) {
            throw new Exception("La cantidad mínima de alerta debe ser mayor o igual a 0.");
        }

        $stmtStock = $con->prepare("UPDATE Stock SET stock_nombre = ?, stock_caducidad = ?, stock_alerta = ? WHERE stock_id = ?");
        $stmtStock->execute([
            $_POST['nombre'],
            $_POST['caducidad'],
            $stockAlerta,
            $_POST['id']
        ]);

        $stmtCheck = $con->prepare("SELECT COUNT(*) FROM Stock_Cantidad WHERE stock_id = ?");
        $stmtCheck->execute([$_POST['id']]);
        $exists = $stmtCheck->fetchColumn() > 0;

        if ($exists) {
            $stmtDelete = $con->prepare("DELETE FROM Stock_Cantidad WHERE stock_id = ?");
            $stmtDelete->execute([$_POST['id']]);
        }

        $stmtInsertCantidad = $con->prepare("INSERT INTO Stock_Cantidad (stock_id, stock_cantidad, stock_medida) VALUES (?, ?, ?)");
        $stmtInsertCantidad->execute([
            $_POST['id'],
            $_POST['stock'],
            $_POST['medida']
        ]);

        $con->commit();

        $response['success'] = true;
        $response['message'] = 'Stock actualizado con éxito';
    } catch (PDOException $e) {
        if ($con->inTransaction()) {
            $con->rollBack();
        }
        $response['success'] = false;
        $response['message'] = 'Error al actualizar el stock: ' . $e->getMessage();
    }
} else {
    $response['success'] = false;
    $response['message'] = 'Método no permitido';
}

header('Content-Type: application/json');
echo json_encode($response);