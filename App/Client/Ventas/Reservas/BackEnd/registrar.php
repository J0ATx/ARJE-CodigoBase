<?php
session_start();
if (!isset($_SESSION['usuario_id'])) {
    echo json_encode(["error" => "empty"]);
    exit();
}

include_once "../../../../Control/Conexion/clienteRegistrado.php";

$fecha = isset($_POST['fecha']) ? $_POST['fecha'] : '';
$hora = isset($_POST['hora']) ? $_POST['hora'] : '';
$cantidad = isset($_POST['cantidad']) ? $_POST['cantidad'] : '';
$mesa_id = isset($_POST['mesa_id']) ? (int)$_POST['mesa_id'] : null;
$duracion = 2;

$id_cliente = $_SESSION["usuario_id"];


    if (empty($fecha) || empty($hora) || empty($cantidad)) {
        echo json_encode(["error" => "empty"]);
        exit();
    }

    if ($mesa_id === null || $mesa_id <= 0) {
        echo json_encode(["error" => "missing_table"]);
        exit();
    }

    $fecha_actual = date("Y-m-d");
    $fecha_minima = date("Y-m-d", strtotime($fecha_actual . " +2 days"));
    
    if (strtotime($fecha) < strtotime($fecha_minima)) {
        echo json_encode(["error" => "advance_required"]);
        exit();
    }

    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $fecha)) {
        echo json_encode(["error" => "invalid date"]);
        exit();
    }

    if (!preg_match('/^(?:[01]\d|2[0-3]):[0-5]\d$/', $hora)) {
        echo json_encode(["error" => "invalid hour"]);
        exit();
    }

    if (strlen($hora) === 5) {
        $hora .= ':00';
    }

    if (!preg_match('/^[1-6]$/', (string)$cantidad)) {
        echo json_encode(["error" => "invalid cantidad"]);
        exit();
    }

    if($_SESSION["rol"] !== "Cliente") {
        echo json_encode(["error" => "not client"]);
        exit();
    }

    $diasSemana = [
        1 => 'Lunes',
        2 => 'Martes',
        3 => 'Miércoles',
        4 => 'Jueves',
        5 => 'Viernes',
        6 => 'Sábado',
        7 => 'Domingo'
    ];
    $indiceDia = (int)date('N', strtotime($fecha));
    $diaSeleccionado = $diasSemana[$indiceDia] ?? null;
    if (!$diaSeleccionado) {
        echo json_encode(["error" => "invalid date"]);
        exit();
    }

    $stmtHorario = $con->prepare("SELECT empresa_hora FROM empresa_horario WHERE empresa_dia = ?");
    $stmtHorario->execute([$diaSeleccionado]);
    $horarios = $stmtHorario->fetchAll(PDO::FETCH_COLUMN);

    if (!$horarios || count($horarios) === 0) {
        echo json_encode(["error" => "closed_day"]);
        exit();
    }

    $parseSeconds = function($t) {
        $p = explode(':', $t);
        return ((int)$p[0]) * 3600 + ((int)$p[1]) * 60;
    };
    $inicioReserva = $parseSeconds($hora);
    $finReserva = $inicioReserva + ($duracion * 3600);
    $dentroDeHorario = false;
    foreach ($horarios as $h) {
        $partes = preg_split('/\s*-\s*/', trim($h));
        if (count($partes) !== 2) {
            continue;
        }
        $hInicio = $parseSeconds(trim($partes[0]));
        $hFin = $parseSeconds(trim($partes[1]));
        if ($hFin === 0) {
            $hFin = 86400;
        }
        if ($hFin <= $hInicio) {
            $hFin += 86400;
        }
        $chkInicio = $inicioReserva;
        $chkFin = $finReserva;
        if ($chkFin <= $hInicio) {
            $chkFin += 86400;
        }
        if ($chkInicio >= $hInicio && $chkFin <= $hFin) {
            $dentroDeHorario = true;
            break;
        }
    }

    if (!$dentroDeHorario) {
        echo json_encode(["error" => "outside_open_hours"]);
        exit();
    }

    try {
        $con->beginTransaction();

        $sqlVerificarMesa = "SELECT mesa_id, mesa_reservable, mesa_estado, mesa_alcance FROM Mesa WHERE mesa_id = ?";
        $stmtVerificar = $con->prepare($sqlVerificarMesa);
        $stmtVerificar->execute([$mesa_id]);
        $mesaExiste = $stmtVerificar->fetch(PDO::FETCH_ASSOC);

        if (!$mesaExiste) {
            $con->rollBack();
            echo json_encode(["error" => "invalid_table"]);
            exit();
        }

        if ($mesaExiste['mesa_reservable'] !== 'Si') {
            $con->rollBack();
            echo json_encode(["error" => "table_not_reservable"]);
            exit();
        }
        if ($mesaExiste['mesa_estado'] == 'Inhabilitada') {
            $con->rollBack();
            echo json_encode(["error" => "table_not_available"]);
            exit();
        }
        if ($mesaExiste['mesa_alcance'] < $cantidad) {
            $con->rollBack();
            echo json_encode(["error" => "table_not_amount"]);
            exit();
        }

        $sqlCheckDisponibilidad = "
            SELECT COUNT(*) as conflictos
            FROM Reserva
            WHERE mesa_id = ?
              AND reserva_fecha = ?
              AND (
                TIME(?) < ADDTIME(reserva_inicio, MAKETIME(CAST(reserva_duracion AS UNSIGNED), 0, 0))
                AND ADDTIME(TIME(?), MAKETIME(?, 0, 0)) > reserva_inicio
              )
        ";
        $stmtCheck = $con->prepare($sqlCheckDisponibilidad);
        $stmtCheck->execute([$mesa_id, $fecha, $hora, $hora, (int)$duracion]);
        $result = $stmtCheck->fetch(PDO::FETCH_ASSOC);

        if ($result['conflictos'] > 0) {
            $con->rollBack();
            echo json_encode(["error" => "table_unavailable"]);
            exit();
        }

        $sqlReserva = "
            INSERT INTO Reserva (
                reserva_cantidad_personas, 
                reserva_duracion, 
                reserva_fecha, 
                reserva_inicio, 
                cliente_id, 
                mesa_id
            )
            VALUES (?, ?, ?, ?, ?, ?)
        ";
        $stmt = $con->prepare($sqlReserva);
        $stmt->execute([
            (int)$cantidad, 
            (string)$duracion, 
            $fecha, 
            $hora, 
            $id_cliente, 
            $mesa_id
        ]);

        $con->commit();
        echo json_encode(["success" => "Reserva creada exitosamente"]);
    } catch (\Throwable $th) {
        if ($con && $con->inTransaction()) {
            $con->rollBack();
        }
        echo json_encode(["error" => $th->getMessage()]);
        exit();
    }
?>
