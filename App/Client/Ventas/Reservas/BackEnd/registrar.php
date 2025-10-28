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

    try {
        $con->beginTransaction();

        $sqlVerificarMesa = "SELECT mesa_id, mesa_reservable FROM Mesa WHERE mesa_id = ?";
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
