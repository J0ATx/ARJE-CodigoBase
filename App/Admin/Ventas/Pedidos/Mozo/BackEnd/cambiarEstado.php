<?php
// Cambia el estado de un pedido y guarda método de pago si corresponde
header('Content-Type: application/json');
require_once '../../../../../Control/Conexión/conexion.php';

$response = ["success" => false];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
	$idPedido = isset($_POST['idPedido']) ? (int)$_POST['idPedido'] : null;
	$nuevoEstado = $_POST['nuevoEstado'] ?? null;
	$metodoPago = $_POST['metodoPago'] ?? null; // Solo para estado Pagado

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
		if ($nuevoEstado === 'Pagado') {
			if (!$metodoPago || !in_array($metodoPago, ['Efectivo', 'Tarjeta'])) {
				$response['message'] = 'Método de pago inválido';
				echo json_encode($response);
				exit;
			}
			$stmtUp = $con->prepare('UPDATE Pedido SET pedido_estado = ?, pedido_pago = ? WHERE pedido_id = ?');
			$stmtUp->execute([$nuevoEstado, $metodoPago, $idPedido]);
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
