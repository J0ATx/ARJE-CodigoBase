<?php
require_once '../../../Control/Conexión/conexion.php';

$response = array();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $con->beginTransaction();

        $stmtStock = $con->prepare("INSERT INTO Stock (stock_nombre, stock_caducidad) VALUES (?, ?)");
        $stmtStock->execute([
            $_POST['nombre'],
            $_POST['caducidad']
        ]);

        $stockId = $con->lastInsertId();

        $stmtCantidad = $con->prepare("INSERT INTO Stock_Cantidad (stock_id, stock_cantidad, stock_medida) VALUES (?, ?, ?)");
        $stmtCantidad->execute([
            $stockId,
            $_POST['stock'],
            $_POST['medida']
        ]);

        $con->commit();

        $response['success'] = true;
        $response['message'] = 'Stock creado con éxito';
    } catch (PDOException $e) {
        if ($con->inTransaction()) {
            $con->rollBack();
        }
        $response['success'] = false;
        $response['message'] = 'Error al crear el stock: ' . $e->getMessage();
    }
} else {
    $response['success'] = false;
    $response['message'] = 'Método no permitido';
}

header('Content-Type: application/json');
echo json_encode($response);
