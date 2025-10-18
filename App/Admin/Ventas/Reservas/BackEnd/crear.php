<?php
session_start();
include_once '../../../../Control/Conexion/empleado.php';

try {
    $cliente_email = isset($_POST['cliente_email']) ? trim($_POST['cliente_email']) : '';
    $fecha = isset($_POST['fecha']) ? $_POST['fecha'] : '';
    $hora = isset($_POST['hora']) ? $_POST['hora'] : '';
    $ubicacion = isset($_POST['ubicacion']) ? $_POST['ubicacion'] : '';
    $cantidad = isset($_POST['cantidad']) ? (int)$_POST['cantidad'] : 0;
    $duracion = isset($_POST['duracion']) ? (int)$_POST['duracion'] : 2;
    $tipoAsignacion = isset($_POST['tipoAsignacion']) ? $_POST['tipoAsignacion'] : 'automatica';
    $mesa_id = isset($_POST['mesa_id']) ? (int)$_POST['mesa_id'] : null;

    // Validaciones básicas
    if (empty($cliente_email) || empty($fecha) || empty($hora) || empty($ubicacion) || $cantidad <= 0) {
        echo json_encode(["error" => "Todos los campos son obligatorios"]);
        exit();
    }

    // Validar formato de email
    if (!filter_var($cliente_email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(["error" => "Formato de email inválido"]);
        exit();
    }

    // Normalizar hora a HH:MM:SS
    if (strlen($hora) === 5) {
        $hora .= ':00';
    }

    $con->beginTransaction();
    // Verificar que el cliente existe
    $sqlCliente = "SELECT cliente_id FROM Cliente WHERE cliente_id = ?";
    $stmtCliente = $con->prepare($sqlCliente);
    $stmtCliente->execute([$cliente_email]);
    $cliente = $stmtCliente->fetch(PDO::FETCH_ASSOC);

    if (!$cliente) {
        $con->rollBack();
        echo json_encode(["error" => "El cliente con email '$cliente_email' no existe en el sistema"]);
        exit();
    }

    $cliente_id = $cliente['cliente_id'];

    // Asignación automatica
    if ($tipoAsignacion === 'automatica') {
        $sqlMesa = "
                SELECT m.mesa_id, m.mesa_alcance
                FROM Mesa m
                WHERE m.mesa_ubicacion = ?
                  AND NOT EXISTS (
                    SELECT 1
                    FROM Reserva r
                    WHERE r.mesa_id = m.mesa_id
                      AND r.reserva_fecha = ?
                      AND r.reserva_estado = 'Confirmada'
                      AND (
                        TIME(?) < ADDTIME(r.reserva_inicio, MAKETIME(CAST(r.reserva_duracion AS UNSIGNED), 0, 0))
                        AND ADDTIME(TIME(?), MAKETIME(?, 0, 0)) > r.reserva_inicio
                      )
                  )
                ORDER BY
                  (m.mesa_alcance < ?) ASC,
                  CASE WHEN m.mesa_alcance < ? THEN m.mesa_alcance END DESC,
                  CASE WHEN m.mesa_alcance >= ? THEN m.mesa_alcance END ASC
                LIMIT 1
                FOR UPDATE;
            ";
        $stmt = $con->prepare($sqlMesa);
        $stmt->execute([$ubicacion, $fecha, $hora, $hora, $duracion, $cantidad, $cantidad, $cantidad]);
        $mesaRow = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$mesaRow || $mesaRow['mesa_id'] == 0) {
            $con->rollBack();
            echo json_encode(["error" => "No hay mesas disponibles en ese horario y ubicación"]);
            exit();
        }

        $mesa_id = $mesaRow['mesa_id'];
    }

    // Asignación manual
    if ($tipoAsignacion === 'manual') {
        if ($mesa_id === null || $mesa_id <= 0) {
            $con->rollBack();
            echo json_encode(["error" => "Debe especificar un ID de mesa para asignación manual"]);
            exit();
        }
        $sqlMesaExiste = "SELECT mesa_id FROM Mesa WHERE mesa_id = ?";
        $stmtMesaExiste = $con->prepare($sqlMesaExiste);
        $stmtMesaExiste->execute([$mesa_id]);
        $mesaExiste = $stmtMesaExiste->fetch(PDO::FETCH_ASSOC);

        if (!$mesaExiste) {
            $con->rollBack();
            echo json_encode(["error" => "La mesa con ID $mesa_id no existe en el sistema"]);
            exit();
        }
        $sqlCheck = "
            SELECT COUNT(*) as conflictos
            FROM Reserva
            WHERE mesa_id = ?
              AND reserva_fecha = ?
              AND reserva_estado = 'Confirmada'
              AND (
                TIME(?) < ADDTIME(reserva_inicio, MAKETIME(CAST(reserva_duracion AS UNSIGNED), 0, 0))
                AND ADDTIME(TIME(?), MAKETIME(?, 0, 0)) > reserva_inicio
              )
        ";
        $stmtCheck = $con->prepare($sqlCheck);
        $stmtCheck->execute([$mesa_id, $fecha, $hora, $hora, $duracion]);
        $result = $stmtCheck->fetch(PDO::FETCH_ASSOC);

        if ($result['conflictos'] > 0) {
            $con->rollBack();
            echo json_encode(["error" => "La mesa seleccionada no está disponible en ese horario"]);
            exit();
        }
    }

    // Crear reserva como Confirmada
    $sqlReserva = "
        INSERT INTO Reserva (
            reserva_cantidad_personas, 
            reserva_duracion, 
            reserva_fecha, 
            reserva_inicio, 
            cliente_id, 
            mesa_id, 
            reserva_estado, 
            reserva_comentario, 
            reserva_asignacion_tipo
        )
        VALUES (?, ?, ?, ?, ?, ?, 'Confirmada', NULL, ?)
    ";
    $stmt = $con->prepare($sqlReserva);
    $stmt->execute([
        $cantidad,
        $duracion,
        $fecha,
        $hora,
        $cliente_id,
        $mesa_id,
        ($tipoAsignacion === 'manual') ? 'Manual' : 'Automatica'
    ]);

    $con->commit();
    echo json_encode(["success" => true, "message" => "Reserva creada exitosamente"]);
} catch (\Throwable $th) {
    if ($con && $con->inTransaction()) {
        $con->rollBack();
    }
    echo json_encode(["error" => "Error al crear la reserva: " . $th->getMessage()]);
    exit();
}
?>
