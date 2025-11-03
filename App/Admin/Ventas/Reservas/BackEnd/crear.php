<?php
session_start();
header('Content-Type: application/json');
include_once '../../../../Control/Conexion/empleado.php';

try {
    // Obtener datos del formulario
    $cliente_email = isset($_POST['cliente_id']) ? trim($_POST['cliente_id']) : '';
    $fecha = isset($_POST['reserva_fecha']) ? $_POST['reserva_fecha'] : '';
    $hora = isset($_POST['reserva_inicio']) ? $_POST['reserva_inicio'] : '';
    $cantidad = isset($_POST['reserva_cantidad_personas']) ? (int)$_POST['reserva_cantidad_personas'] : 0;
    $duracion = isset($_POST['reserva_duracion']) ? (int)$_POST['reserva_duracion'] : 2;
    $mesa_id = isset($_POST['mesa_id']) ? (int)$_POST['mesa_id'] : null;

    // Validaciones básicas
    if (empty($cliente_email) || empty($fecha) || empty($hora) || $cantidad <= 0) {
        echo json_encode(["error" => "Todos los campos son obligatorios"]);
        exit();
    }

    // Validar formato de email
    if (!filter_var($cliente_email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(["error" => "Formato de email inválido"]);
        exit();
    }

    // Normalizar hora a HH:MM:SS si es necesario
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

    // Si se especificó una mesa, verificar que existe
    if ($mesa_id !== null && $mesa_id > 0) {
        $sqlMesaExiste = "SELECT mesa_id FROM Mesa WHERE mesa_id = ?";
        $stmtMesaExiste = $con->prepare($sqlMesaExiste);
        $stmtMesaExiste->execute([$mesa_id]);
        $mesaExiste = $stmtMesaExiste->fetch(PDO::FETCH_ASSOC);

        if (!$mesaExiste) {
            $con->rollBack();
            echo json_encode(["error" => "La mesa con ID $mesa_id no existe en el sistema"]);
            exit();
        }
    }

    // Crear la reserva con estado 'Pendiente' por defecto
    $sqlReserva = "
        INSERT INTO Reserva (
            reserva_cantidad_personas, 
            reserva_duracion, 
            reserva_fecha, 
            reserva_inicio, 
            cliente_id, 
            mesa_id, 
            reserva_estado
        ) VALUES (?, ?, ?, ?, ?, ?, 'Pendiente')
    ";

    $stmt = $con->prepare($sqlReserva);
    $stmt->execute([
        $cantidad,
        $duracion,
        $fecha,
        $hora,
        $cliente_email, // Usamos directamente el email como ID
        $mesa_id
    ]);

    $reserva_id = $con->lastInsertId();
    $con->commit();

    echo json_encode([
        "success" => true,
        "message" => "Reserva creada exitosamente",
        "reserva_id" => $reserva_id
    ]);
} catch (\Throwable $th) {
    if ($con && $con->inTransaction()) {
        $con->rollBack();
    }
    http_response_code(500);
    echo json_encode([
        "error" => "Error al crear la reserva: " . $th->getMessage(),
        "trace" => $th->getTraceAsString()
    ]);
}
