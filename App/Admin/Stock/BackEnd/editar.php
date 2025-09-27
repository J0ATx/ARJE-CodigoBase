<?php
require_once '../../../Control/Conexión/conexion.php';

$response = array();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $con->beginTransaction();

        $stmtStock = $con->prepare("UPDATE Stock SET stock_nombre = ?, stock_caducidad = ? WHERE stock_id = ?");
        $stmtStock->execute([
            $_POST['nombre'],
            $_POST['caducidad'],
            $_POST['id']
        ]);

        $stmtCantidad = $con->prepare("UPDATE Stock_Cantidad SET stock_cantidad = ?, stock_medida = ? WHERE stock_id = ?");
        $stmtCantidad->execute([
            $_POST['stock'],
            $_POST['medida'],
            $_POST['id']
        ]);

        if ($stmtCantidad->rowCount() === 0) {
            // Si no existía fila de cantidad, insertarla
            $stmtInsertCantidad = $con->prepare("INSERT INTO Stock_Cantidad (stock_id, stock_cantidad, stock_medida) VALUES (?, ?, ?)");
            $stmtInsertCantidad->execute([
                $_POST['id'],
                $_POST['stock'],
                $_POST['medida']
            ]);
        }

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
