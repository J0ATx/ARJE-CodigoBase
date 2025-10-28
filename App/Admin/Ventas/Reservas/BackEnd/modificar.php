<?php
    include_once '../../../../Control/Conexion/empleado.php';

    try {
        $con->beginTransaction();
        
        $reserva_id = $_POST['idReserva'];
        $cantidad_personas = $_POST['reserva_cantidad_personas'];
        $duracion = $_POST['reserva_duracion'];
        $fecha = $_POST['reserva_fecha'];
        $inicio = $_POST['reserva_inicio'];
        $cliente_id = $_POST['cliente_id'];
        $mesa_id = $_POST['mesa_id'];
        $nuevoEstado = isset($_POST['reserva_estado']) ? $_POST['reserva_estado'] : null;
        
        $stmtEstadoActual = $con->prepare('SELECT reserva_estado FROM Reserva WHERE reserva_id = ?');
        $stmtEstadoActual->execute([$reserva_id]);
        $estadoActual = $stmtEstadoActual->fetchColumn();
        
        $sql = "UPDATE Reserva SET 
                    reserva_cantidad_personas = ?, 
                    reserva_duracion = ?, 
                    reserva_fecha = ?, 
                    reserva_inicio = ?, 
                    cliente_id = ?, 
                    mesa_id = ?";
        
        $params = [
            $cantidad_personas,
            $duracion,
            $fecha,
            $inicio,
            $cliente_id,
            $mesa_id
        ];
        
        if ($nuevoEstado) {
            $sql .= ", reserva_estado = ?";
            $params[] = $nuevoEstado;
        }
        
        $sql .= " WHERE reserva_id = ?";
        $params[] = $reserva_id;
        
        $stmt = $con->prepare($sql);
        $stmt->execute($params);
        
        if ($nuevoEstado && $nuevoEstado !== $estadoActual) {
            if ($nuevoEstado === 'No-Show') {
                $stmtCheckNoShow = $con->prepare('SELECT 1 FROM No_Show WHERE reserva_id = ? AND cliente_id = ?');
                $stmtCheckNoShow->execute([$reserva_id, $cliente_id]);
                
                if (!$stmtCheckNoShow->fetch()) {
                    $stmtNoShow = $con->prepare('INSERT INTO No_Show (cliente_id, reserva_id, no_show_fecha, no_show_hora) VALUES (?, ?, CURDATE(), CURTIME())');
                    $stmtNoShow->execute([$cliente_id, $reserva_id]);
                }
            }
            else if ($estadoActual === 'No-Show') {
                $stmtDeleteNoShow = $con->prepare('DELETE FROM No_Show WHERE reserva_id = ? AND cliente_id = ?');
                $stmtDeleteNoShow->execute([$reserva_id, $cliente_id]);
            }
        }
        
        $con->commit();
        
        if ($stmt->rowCount() > 0) {
            echo json_encode(array("success" => true, "message" => "Reserva modificada correctamente."));
        } else {
            echo json_encode(array("error" => "No se encontró la reserva o no hubo cambios."));
        }
    } catch (\Throwable $th) {
        if ($con->inTransaction()) {
            $con->rollBack();
        }
        echo json_encode(array("error" => "Error al modificar la reserva: " . $th->getMessage()));
        exit();
    }
?>
