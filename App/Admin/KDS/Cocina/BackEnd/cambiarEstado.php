<?php
// cambiarEstado.php - Cambia el estado de un pedido
header('Content-Type: application/json');
require_once '../../../../Control/Conexión/conexion.php';

$response = ["success" => false];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $idPedido = $_POST['idPedido'] ?? null;
    $nuevoEstado = $_POST['nuevoEstado'] ?? null;
    if (!$idPedido || !$nuevoEstado) {
        $response['message'] = 'Datos incompletos';
        echo json_encode($response); exit;
    }
    try {
        $stmt = $con->prepare('UPDATE Pedido SET estado = ?, horaFinalizacion = IF(? = "entregado", NOW(), horaFinalizacion) WHERE idPedido = ?');
        $stmt->execute([$nuevoEstado, $nuevoEstado, $idPedido]);
        $response['success'] = true;
    } catch (Exception $e) {
        $response['message'] = 'Error al cambiar estado: ' . $e->getMessage();
    }
}
echo json_encode($response);
