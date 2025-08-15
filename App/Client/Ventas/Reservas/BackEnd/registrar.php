<?php
session_start();
// Verificar si hay sesión iniciada
if (!isset($_SESSION['usuario_id'])) {
    echo json_encode(["error" => "empty"]);
    exit();
}

// Incluir la conexión después de verificar la sesión
include_once '../../../../Control/Conexión/conexion.php';

// Obtener datos del formulario
$fecha = isset($_POST['fecha']) ? $_POST['fecha'] : '';
$hora = isset($_POST['hora']) ? $_POST['hora'] : '';

// Obtener ID del cliente de la sesión
$id_cliente = $_SESSION["usuario_id"];
$fechReg = date("Y-m-d");

// Asignar mesa y camarero aleatorios (temporal)
$mesa = rand(1, 20);
$id_camarero = rand(6, 10);

    // Validar existencia de fecha y hora
    if (empty($fecha) || empty($hora)) {
        echo json_encode(["error" => "empty"]);
        exit();
    }

    // Validar que la fecha no sea menor a la actual
    $fecha_actual = date("Y-m-d");
    if (strtotime($fecha) < strtotime($fecha_actual)) {
        echo json_encode(["error" => "date"]);
        exit();
    }

    // Regex validations
    // Validar fecha (YYYY-MM-DD)
    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $fecha)) {
        echo json_encode(["error" => "invalid date"]);
        exit();
    }

    // Validar hora (HH:MM, 24 horas)
    if (!preg_match('/^(?:[01]\d|2[0-3]):[0-5]\d$/', $hora)) {
        echo json_encode(["error" => "invalid hour"]);
        exit();
    }

    if($_SESSION["rol"] !== "Cliente") {
        echo json_encode(["error" => "not client"]);
        exit();
    }

    try {
        $sql = "INSERT INTO Pedido (montoTotal, pagoPedido, pagoPropina, fechReg) VALUES (?,?,?,?)";
        $stmt = $con->prepare($sql);
        $stmt->execute([0, 0, 0, $fechReg]);

        $id_pedido = $con->lastInsertId();

        $sql = "INSERT INTO Reserva (idPedido, idMesa, idUsuario, fecha, horaInicio, duracion) VALUES (?, ?, ?, ?, ?, 1)";
        $stmt = $con->prepare($sql);
        $stmt->execute([$id_pedido, $mesa, $id_camarero, $fecha, $hora]);

        $sql = "INSERT INTO Relaciona (idUsuario, idPedido) VALUES (?, ?)";
        $stmt = $con->prepare($sql);
        $stmt->execute([$id_cliente, $id_pedido]);
    } catch (\Throwable $th) {
        echo json_encode(array("error" => "error " . $th->getMessage()));
        exit();
    }

    echo json_encode(["success" => "Reserva exitosa"]);
?>