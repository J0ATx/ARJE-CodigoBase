<?php
header('Content-Type: application/json');
require_once '../../../../../Control/Conexion/empleado.php';

$response = ["success" => false];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $idPedido = isset($_POST['idPedido']) ? (int)$_POST['idPedido'] : null;
    if (!$idPedido) {
        $response['message'] = 'ID de pedido faltante';
        echo json_encode($response);
        exit;
    }
    try {
        $stmt = $con->prepare('SELECT pedido_estado FROM Pedido WHERE pedido_id = ?');
        $stmt->execute([$idPedido]);
        $estado = $stmt->fetchColumn();

        $stmtMesa = $con->prepare('SELECT mesa_id FROM Pedido WHERE pedido_id = ?');
        $stmtMesa->execute([$idPedido]);
        $mesaId = $stmtMesa->fetchColumn();
        $stmtMesaUpdate = $con->prepare('UPDATE Mesa SET mesa_estado = "Libre" WHERE mesa_id = ?');
        $stmtMesaUpdate->execute([$mesaId]);
        if ($estado === false) {
            $response['message'] = 'Pedido no encontrado';
            echo json_encode($response);
            exit;
        }
        if ($estado === 'Pagado') {
            $response['message'] = 'No se puede cancelar un pedido con estado final: ' . $estado;
        } else {
            $con->beginTransaction();
            // Eliminar relaciones y el pedido
            $con->prepare('DELETE FROM Contiene WHERE pedido_id = ?')->execute([$idPedido]);
            $con->prepare('DELETE FROM Pedido WHERE pedido_id = ?')->execute([$idPedido]);
            $con->commit();
            $response['success'] = true;
        }
    } catch (Exception $e) {
        if ($con->inTransaction()) $con->rollBack();
        $response['message'] = 'Error al cancelar pedido: ' . $e->getMessage();
    }
}
echo json_encode($response);
