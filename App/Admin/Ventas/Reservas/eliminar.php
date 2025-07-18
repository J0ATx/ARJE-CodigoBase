<?php
    include_once '../../../Control/Conexión/conexion.php';

    $id_reserva = $_POST['idReserva'];

    try {
        $sql = "DELETE FROM Pedido WHERE idPedido = ?";
        $stmt = $con->prepare($sql);
        $stmt->execute([$id_reserva]);
    } catch (\Throwable $th) {
        echo JSON_encode(("error" => "Error preparando la consulta: " . $th->getMessage()));
        exit();
    }
?>