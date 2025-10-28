<?php
header('Content-Type: application/json');
require_once '../../../../../Control/Conexion/empleado.php';

$response = ["success" => false];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $reservaId = isset($_POST['reserva_id']) ? (int)$_POST['reserva_id'] : null;
    $accion = isset($_POST['accion']) ? $_POST['accion'] : null;
    $emailCliente = isset($_POST['email_cliente']) ? $_POST['email_cliente'] : null;

    if (!$reservaId || !$accion || !in_array($accion, ['confirmar', 'rechazar'])) {
        $response['message'] = 'Datos incompletos o inválidos';
        echo json_encode($response);
        exit;
    }

    try {
        $con->beginTransaction();

        $stmt = $con->prepare('SELECT * FROM Reserva WHERE reserva_id = ? AND reserva_estado = ?');
        $stmt->execute([$reservaId, 'Pendiente']);
        $reserva = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$reserva) {
            $con->rollBack();
            $response['message'] = 'Reserva no encontrada o ya procesada';
            echo json_encode($response);
            exit;
        }

        if ($accion === 'confirmar') {
            if ($emailCliente && strtolower(trim($emailCliente)) !== strtolower(trim($reserva['cliente_id']))) {
                $con->rollBack();
                $response['message'] = 'El email no coincide con el cliente de la reserva';
                echo json_encode($response);
                exit;
            }

            $stmtUpdate = $con->prepare('UPDATE Reserva SET reserva_estado = ? WHERE reserva_id = ?');
            $stmtUpdate->execute(['Confirmada', $reservaId]);
            
            $response['success'] = true;
            $response['message'] = 'Reserva confirmada exitosamente';
        } else if ($accion === 'rechazar') {
            $response['success'] = true;
            $response['message'] = 'Continuando con pedido sin confirmar reserva';
        }

        $con->commit();
    } catch (Exception $e) {
        if ($con->inTransaction()) {
            $con->rollBack();
        }
        $response['message'] = 'Error al procesar: ' . $e->getMessage();
    }
} else {
    $response['message'] = 'Método no permitido';
}

echo json_encode($response);

