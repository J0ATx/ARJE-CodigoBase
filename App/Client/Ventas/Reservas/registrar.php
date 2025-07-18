<?php
    include_once '../../../Control/Conexión/conexion.php';

    // $lugar = $_POST['lugar']; Por el momento la mesa se selecciona aleatoriamente independientemente del lugar que el usuario elija.
    $fecha = $_POST['fecha'];
    $hora = $_POST['hora'];
    $id_cliente = $_POST['id_cliente']; // El ID del cliente se obtiene de la sesión o del formulario.
    $fechReg = date("Y-m-d");
    $mesa = rand(1, 20); // $_POST['mesa']; El CRUD de mesas aún no está implementado, se usa un número aleatorio para simular la selección de una mesa.
    $id_camarero = rand(6, 10);; // $_POST['id_camarero']; El ID del camarero se obtiene de la sesión o del formulario.

    // Regex validations
    // Validar fecha (YYYY-MM-DD)
    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $fecha)) {
        echo json_encode(["error" => "fecha inválida"]);
        exit();
    }

    // Validar hora (HH:MM, 24 horas)
    if (!preg_match('/^(?:[01]\d|2[0-3]):[0-5]\d$/', $hora)) {
        echo json_encode(["error" => "hora inválida"]);
        exit();
    }

    try {
        $sql = "INSERT INTO Pedido (montoTotal, pagoPedido, pagoPropina, fechReg) VALUES (?,?,?,?)";
        $stmt = $con->prepare($sql);
        $stmt->execute([0, 0, 0, $fechReg]);

        $sql = "INSERT INTO Reserva (idPedido, idMesa, idUsuario, fecha, horaInicio, duracion) VALUES (LAST_INSERT_ID(), ?, ?, ?, ?, 1)";
        $stmt = $con->prepare($sql);
        $stmt->execute([$mesa, $id_camarero, $fecha, $hora]);

        $sql = "INSERT INTO Relaciona (idUsuario, idPedido) VALUES (?, ?)";
        $stmt = $con->prepare($sql);
        $stmt->execute([$id_cliente, $con->lastInsertId()]);
    } catch (\Throwable $th) {
        JSON_encode(array("error" => "Error preparando la consulta: " . $th->getMessage()));
        exit();
    }
?>