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

	// Validar que el pedido existe
	$stmt = $con->prepare('SELECT pedido_id FROM Pedido WHERE pedido_id = ?');
	$stmt->execute([$idPedido]);
	if (!$stmt->fetchColumn()) {
		$response['message'] = 'Pedido no encontrado';
		echo json_encode($response);
		exit;
	}

	try {
		// Obtener el mesa_id del pedido antes de actualizar
		$stmtMesa = $con->prepare('SELECT mesa_id FROM Pedido WHERE pedido_id = ?');
		$stmtMesa->execute([$idPedido]);
		$mesaId = $stmtMesa->fetchColumn();

		if ($nuevoEstado === 'Pagado') {
			if (!$metodoPago || !in_array($metodoPago, ['Efectivo', 'Tarjeta'])) {
				$response['message'] = 'Método de pago inválido';
				echo json_encode($response);
				exit;
			}
			$stmtUp = $con->prepare('UPDATE Pedido SET pedido_estado = ?, pedido_pago = ? WHERE pedido_id = ?');
			$stmtUp->execute([$nuevoEstado, $metodoPago, $idPedido]);

			// Actualizar estado de la mesa a "Libre" cuando el pedido se paga
			if ($mesaId) {
				$stmtMesaUpdate = $con->prepare('UPDATE Mesa SET mesa_estado = "Libre" WHERE mesa_id = ?');
				$stmtMesaUpdate->execute([$mesaId]);
			}
		} else {
			$stmtUp = $con->prepare('UPDATE Pedido SET pedido_estado = ? WHERE pedido_id = ?');
			$stmtUp->execute([$nuevoEstado, $idPedido]);
		}
		$response['success'] = true;
	} catch (Exception $e) {
		$response['message'] = 'Error al cambiar estado: ' . $e->getMessage();
	}
} else {
	$response['message'] = 'Método no permitido';
}

echo json_encode($response);
