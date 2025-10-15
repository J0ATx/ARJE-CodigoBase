<?php
session_start();
// Verificar si hay sesión iniciada
if (!isset($_SESSION['usuario_id'])) {
    echo json_encode(["error" => "empty"]);
    exit();
}

include_once "../../../../Control/Conexion/clienteRegistrado.php";

$fecha = isset($_POST['fecha']) ? $_POST['fecha'] : '';
$hora = isset($_POST['hora']) ? $_POST['hora'] : '';
$ubicacion = isset($_POST['ubicacion']) ? $_POST['ubicacion'] : '';
$cantidad = isset($_POST['cantidad']) ? $_POST['cantidad'] : '';
$tipoAsignacion = isset($_POST['tipoAsignacion']) ? $_POST['tipoAsignacion'] : 'automatica';
$comentario = isset($_POST['comentario']) ? trim($_POST['comentario']) : null;
$duracion = 2;

$id_cliente = $_SESSION["usuario_id"];
$fechReg = date("Y-m-d");


    // Validar existencia de fecha y hora
    if (empty($fecha) || empty($hora)) {
        echo json_encode(["error" => "empty"]);
        exit();
    }

    // Validar que la fecha sea al menos 2 días después de hoy (antelación de 2 días)
    $fecha_actual = date("Y-m-d");
    $fecha_minima = date("Y-m-d", strtotime($fecha_actual . " +2 days"));
    
    if (strtotime($fecha) < strtotime($fecha_minima)) {
        echo json_encode(["error" => "advance_required"]);
        exit();
    }
    
    // Validar comentario si es asignación manual
    if ($tipoAsignacion === 'manual' && empty($comentario)) {
        echo json_encode(["error" => "missing_comment"]);
        exit();
    }

    // Validar formato de fecha (YYYY-MM-DD)
    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $fecha)) {
        echo json_encode(["error" => "invalid date"]);
        exit();
    }

    // Validar formato de hora (HH:MM)
    if (!preg_match('/^(?:[01]\d|2[0-3]):[0-5]\d$/', $hora)) {
        echo json_encode(["error" => "invalid hour"]);
        exit();
    }

    // Normalizar hora a HH:MM:SS
    if (strlen($hora) === 5) {
        $hora .= ':00';
    }

    if (!in_array($ubicacion, ['Interior', 'Exterior'], true)) {
        echo json_encode(["error" => "invalid ubicacion"]);
        exit();
    }

    // Validar cantidad (1..6)
    if (!preg_match('/^[1-6]$/', (string)$cantidad)) {
        echo json_encode(["error" => "invalid cantidad"]);
        exit();
    }

    $duracion = 2;

    if($_SESSION["rol"] !== "Cliente") {
        echo json_encode(["error" => "not client"]);
        exit();
    }

    try {
        $con->beginTransaction();

        $mesa_id = null;
        $estado = 'Pendiente';
        $tipo_asignacion = ($tipoAsignacion === 'manual') ? 'Manual' : 'Automatica';

        // Si es asignación automática, buscar mesa disponible
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
            $stmt->execute([$ubicacion, $fecha, $hora, $hora, (int)$duracion, (int)$cantidad, (int)$cantidad, (int)$cantidad]);
            $mesaRow = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$mesaRow) {
                $con->rollBack();
                echo json_encode(["error" => "no availability"]);
                exit();
            }

            $mesa_id = (int)$mesaRow['mesa_id'];
        }
        // Si es asignación manual, mesa_id queda NULL y el gerente la asignará

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
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ";
        $stmt = $con->prepare($sqlReserva);
        $stmt->execute([
            (int)$cantidad, 
            (string)$duracion, 
            $fecha, 
            $hora, 
            $id_cliente, 
            $mesa_id, 
            $estado, 
            $comentario, 
            $tipo_asignacion
        ]);

        $con->commit();
    } catch (\Throwable $th) {
        if ($con && $con->inTransaction()) {
            $con->rollBack();
        }
        echo json_encode(array("error" => "error " . $th->getMessage()));
        exit();
    }

    $mensaje = ($tipoAsignacion === 'manual') 
        ? "Reserva creada. Un gerente revisará tu solicitud y asignará la mesa según tus preferencias." 
        : "Reserva creada exitosamente. Un gerente la confirmará pronto.";
    
    echo json_encode(["success" => $mensaje]);
?>