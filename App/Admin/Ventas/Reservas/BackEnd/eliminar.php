<?php
    include_once '../../../../Control/Conexión/conexion.php';

    try {
        $reserva_id = $_POST['idReserva'];
        // Eliminar la reserva
        $sql = "DELETE FROM Reserva WHERE reserva_id = ?";
        $stmt = $con->prepare($sql);
        $stmt->execute([$reserva_id]);
        if ($stmt->rowCount() > 0) {
            echo json_encode(array("success" => true, "message" => "Reserva eliminada correctamente."));
        } else {
            echo json_encode(array("error" => "No se encontro la reserva para eliminar."));
        }
    } catch (\Throwable $th) {
        echo json_encode(array("error" => "Error preparando la consulta: " . $th->getMessage()));
        exit();
    }

?>