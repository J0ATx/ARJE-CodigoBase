<?php

    include_once '../../../../Control/Conexión/conexion.php';

    // $lugar = $_POST['lugar']; Por el momento la mesa se selecciona aleatoriamente independientemente del lugar que el usuario elija.
    $fecha = $_POST['fecha'];
    $hora = $_POST['hora'];
    $id_cliente = "1";
    //$id_cliente = $_POST['id_cliente']; // El ID del cliente se obtiene de la sesión o del formulario.
    $fechReg = date("Y-m-d");
    $mesa = rand(1, 20); // $_POST['mesa']; El CRUD de mesas aún no está implementado, se usa un número aleatorio para simular la selección de una mesa.
    $id_camarero = rand(6, 10); // $_POST['id_camarero']; El ID del camarero se obtiene de la sesión o del formulario.

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
        JSON_encode(array("error" => "error " . $th->getMessage()));
        exit();
    }

    echo json_encode(["success" => "Reserva exitosa"]);
?>