<?php
    include_once '../../../../Control/Conexión/conexion.php';

    try {
        $reserva_id = isset($_POST['idReserva']) ? (int)$_POST['idReserva'] : 0;
        $mesa_id = isset($_POST['mesa_id']) ? (int)$_POST['mesa_id'] : null;
        
        if ($reserva_id <= 0) {
            echo json_encode(["error" => "ID de reserva inválido"]);
            exit();
        }

        $con->beginTransaction();

        // Obtener datos de la reserva
        $sqlReserva = "SELECT * FROM Reserva WHERE reserva_id = ?";
        $stmt = $con->prepare($sqlReserva);
        $stmt->execute([$reserva_id]);
        $reserva = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$reserva) {
            $con->rollBack();
            echo json_encode(["error" => "Reserva no encontrada"]);
            exit();
        }

        // Si no tiene mesa asignada, asignarla
        if ($reserva['mesa_id'] === null && $mesa_id !== null) {
            // Verificar que la mesa esté disponible
            $sqlCheck = "
                SELECT COUNT(*) as conflictos
                FROM Reserva
                WHERE mesa_id = ?
                  AND reserva_fecha = ?
                  AND reserva_estado = 'Confirmada'
                  AND reserva_id != ?
                  AND (
                    TIME(?) < ADDTIME(reserva_inicio, MAKETIME(CAST(reserva_duracion AS UNSIGNED), 0, 0))
                    AND ADDTIME(TIME(?), MAKETIME(CAST(? AS UNSIGNED), 0, 0)) > reserva_inicio
                  )
            ";
            $stmtCheck = $con->prepare($sqlCheck);
            $stmtCheck->execute([
                $mesa_id,
                $reserva['reserva_fecha'],
                $reserva_id,
                $reserva['reserva_inicio'],
                $reserva['reserva_inicio'],
                $reserva['reserva_duracion']
            ]);
            $result = $stmtCheck->fetch(PDO::FETCH_ASSOC);

            if ($result['conflictos'] > 0) {
                $con->rollBack();
                echo json_encode(["error" => "La mesa seleccionada no está disponible en ese horario"]);
                exit();
            }

            // Asignar mesa
            $sqlUpdate = "UPDATE Reserva SET mesa_id = ?, reserva_estado = 'Confirmada' WHERE reserva_id = ?";
            $stmtUpdate = $con->prepare($sqlUpdate);
            $stmtUpdate->execute([$mesa_id, $reserva_id]);
        } else {
            // Solo cambiar estado a Confirmada
            $sqlUpdate = "UPDATE Reserva SET reserva_estado = 'Confirmada' WHERE reserva_id = ?";
            $stmtUpdate = $con->prepare($sqlUpdate);
            $stmtUpdate->execute([$reserva_id]);
        }

        $con->commit();
        echo json_encode(["success" => true, "message" => "Reserva confirmada correctamente"]);
    } catch (\Throwable $th) {
        if ($con && $con->inTransaction()) {
            $con->rollBack();
        }
        echo json_encode(["error" => "Error al confirmar la reserva: " . $th->getMessage()]);
        exit();
    }
?>
