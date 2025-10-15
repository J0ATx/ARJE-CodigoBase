<?php
    include_once '../../../../Control/Conexion/empleado.php';

    try {
        $reserva_id = $_POST['idReserva'];
        $cantidad_personas = $_POST['reserva_cantidad_personas'];
        $duracion = $_POST['reserva_duracion'];
        $fecha = $_POST['reserva_fecha'];
        $inicio = $_POST['reserva_inicio'];
        $cliente_id = $_POST['cliente_id'];
        $mesa_id = $_POST['mesa_id'];
        $sql = "UPDATE Reserva SET 
                    reserva_cantidad_personas = ?, 
                    reserva_duracion = ?, 
                    reserva_fecha = ?, 
                    reserva_inicio = ?, 
                    cliente_id = ?, 
                    mesa_id = ?
                WHERE reserva_id = ?";
        $stmt = $con->prepare($sql);
        $stmt->execute([
            $cantidad_personas,
            $duracion,
            $fecha,
            $inicio,
            $cliente_id,
            $mesa_id,
            $reserva_id
        ]);
        if ($stmt->rowCount() > 0) {
            echo json_encode(array("success" => true, "message" => "Reserva modificada correctamente."));
        } else {
            echo json_encode(array("error" => "No se encontró la reserva o no hubo cambios."));
        }
    } catch (\Throwable $th) {
        echo json_encode(array("error" => "Error al modificar la reserva: " . $th->getMessage()));
        exit();
    }
?>