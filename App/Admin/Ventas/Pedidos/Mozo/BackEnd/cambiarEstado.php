<?php
header('Content-Type: application/json');
require_once '../../../../../Control/Conexion/empleado.php';

$response = ["success" => false];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
	$idPedido = isset($_POST['idPedido']) ? (int)$_POST['idPedido'] : null;
	$nuevoEstado = $_POST['nuevoEstado'] ?? null;
	$metodoPago = $_POST['metodoPago'] ?? null;

	if (!$idPedido || !$nuevoEstado) {
		$response['message'] = 'Datos incompletos';
		echo json_encode($response);
		exit;
	}

	$stmt = $con->prepare('SELECT pedido_id FROM Pedido WHERE pedido_id = ?');
	$stmt->execute([$idPedido]);
	if (!$stmt->fetchColumn()) {
		$response['message'] = 'Pedido no encontrado';
		echo json_encode($response);
		exit;
	}

		try {
		$con->beginTransaction();

		$stmtMesa = $con->prepare('SELECT mesa_id FROM Pedido WHERE pedido_id = ?');
		$stmtMesa->execute([$idPedido]);
		$mesaId = $stmtMesa->fetchColumn();

		if ($nuevoEstado === 'Pagado') {
			if (!$metodoPago || !in_array($metodoPago, ['Efectivo', 'Tarjeta'])) {
				$con->rollBack();
				$response['message'] = 'Método de pago inválido';
				echo json_encode($response);
				exit;
			}
			$stmtUp = $con->prepare('UPDATE Pedido SET pedido_estado = ?, pedido_pago = ? WHERE pedido_id = ?');
			$stmtUp->execute([$nuevoEstado, $metodoPago, $idPedido]);

			if ($mesaId) {
				$stmtMesaUpdate = $con->prepare('UPDATE Mesa SET mesa_estado = "Libre" WHERE mesa_id = ?');
				$stmtMesaUpdate->execute([$mesaId]);
				
				$stmtReserva = $con->prepare('
					SELECT reserva_id 
					FROM Reserva 
					WHERE mesa_id = ? 
					AND reserva_estado = "Confirmada"
					AND reserva_fecha = CURDATE()
					LIMIT 1
				');
				$stmtReserva->execute([$mesaId]);
				$reserva = $stmtReserva->fetch(PDO::FETCH_ASSOC);
				
				if ($reserva) {
					$stmtUpdateReserva = $con->prepare('UPDATE Reserva SET reserva_estado = "Finalizada" WHERE reserva_id = ?');
					$stmtUpdateReserva->execute([$reserva['reserva_id']]);
				}
			}
		} else {
			$stmtUp = $con->prepare('UPDATE Pedido SET pedido_estado = ? WHERE pedido_id = ?');
			$stmtUp->execute([$nuevoEstado, $idPedido]);
		}
		
		$con->commit();
		$response['success'] = true;
	} catch (Exception $e) {
		if ($con->inTransaction()) {
			$con->rollBack();
		}
		$response['message'] = 'Error al cambiar estado: ' . $e->getMessage();
	}
} else {
	$response['message'] = 'Método no permitido';
}

echo json_encode($response);
