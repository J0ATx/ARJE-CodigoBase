<?php
// cancelarPedido.php - Elimina un pedido si no está entregado
header('Content-Type: application/json');
require_once '../../../../Control/Conexión/conexion.php';

$response = ["success" => false];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $idPedido = $_POST['idPedido'] ?? null;
    if (!$idPedido) {
        $response['message'] = 'ID de pedido faltante';
        echo json_encode($response); exit;
    }
    try {
        // Solo eliminar si no está entregado
        $stmt = $con->prepare('SELECT estado FROM Pedido WHERE idPedido = ?');
        $stmt->execute([$idPedido]);
        $estado = $stmt->fetchColumn();
        if ($estado === 'entregado') {
            $response['message'] = 'No se puede cancelar un pedido entregado';
        } else {
            $con->beginTransaction();
            $con->prepare('DELETE FROM EspecificacionesPedido WHERE idPedido = ?')->execute([$idPedido]);
            $con->prepare('DELETE FROM Tiene WHERE idPedido = ?')->execute([$idPedido]);
            $con->prepare('DELETE FROM PedidoFisico WHERE idPedido = ?')->execute([$idPedido]);
            $con->prepare('DELETE FROM Pedido WHERE idPedido = ?')->execute([$idPedido]);
            $con->commit();
            $response['success'] = true;
        }
    } catch (Exception $e) {
        $con->rollBack();
        $response['message'] = 'Error al cancelar pedido: ' . $e->getMessage();
    }
}
echo json_encode($response);
