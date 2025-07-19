<?php
<<<<<<< HEAD

=======
>>>>>>> 7e73f24edffe91bf21cf2aa9ab5bf384c16b13ab
    include_once '../../../Control/Conexión/conexion.php';

    $id_reserva = $_POST['idReserva'];

    try {
        $sql = "DELETE FROM Pedido WHERE idPedido = ?";
        $stmt = $con->prepare($sql);
        $stmt->execute([$id_reserva]);
    } catch (\Throwable $th) {
<<<<<<< HEAD
        JSON_encode(array("error" => "Error preparando la consulta: " . $th->getMessage()));
        exit();
    }

=======
        echo JSON_encode(("error" => "Error preparando la consulta: " . $th->getMessage()));
        exit();
    }
>>>>>>> 7e73f24edffe91bf21cf2aa9ab5bf384c16b13ab
?>