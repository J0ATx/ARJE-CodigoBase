<?php
    include_once '..\..\..\Control\Conexión\conexion.php';

    try {
        $sql = "SELECT usu.nombre, res.idPedido, res.idMesa, res.fecha, res.horaInicio FROM Usuario AS usu
                JOIN Relaciona AS rel ON usu.idUsuario = rel.idUsuario
                JOIN Reserva AS res ON rel.idPedido = res.idPedido";
        $sentencia = $con->prepare($sql);
        $sentencia->execute();
        $reservas = $sentencia->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($reservas);
    } catch (\Throwable $th) {
        echo json_encode(["error" => "Error al insertar los datos: " . $th->getMessage()]);
        exit();
    }
<<<<<<< HEAD

=======
>>>>>>> 7e73f24edffe91bf21cf2aa9ab5bf384c16b13ab
?>