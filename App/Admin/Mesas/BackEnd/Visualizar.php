<?php
include '../../../Control/Conexión/conexion.php';

try {
    $sql = "SELECT m.*, pf.idPedido AS pedidoAsignado, r.idPedido AS reservaAsignada FROM Mesas m
    LEFT JOIN PedidoFisico pf ON m.idMesa = pf.idMesa LEFT JOIN Reserva r ON m.idMesa = r.idMesa";
    $stmt = $con->prepare($sql);
    $stmt->execute();
    $mesas = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($mesas);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>