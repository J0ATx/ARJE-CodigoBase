<?php
    include_once '..\..\..\..\Control\Conexión\conexion.php';

    try {
        $sql = "SELECT * FROM Reserva";
        $sentencia = $con->prepare($sql);
        $sentencia->execute();
        $reservas = $sentencia->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($reservas);
    } catch (\Throwable $th) {
        echo json_encode(["error" => "Error al insertar los datos: " . $th->getMessage()]);
        exit();
    }
?>