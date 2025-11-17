<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/App/Control/Conexion/clienteRegistrado.php';

header('Content-Type: application/json');
session_start();

if (!isset($_SESSION['usuario_id'])) {
    echo json_encode(['error' => 'No autenticado']);
    exit;
}

if (!isset($_POST['plato']) || empty(trim($_POST['plato']))) {
    echo json_encode(['error' => 'El nombre del plato es requerido']);
    exit;
}

try {
    $cliente_id = $_SESSION['usuario_id'];
    $plato = trim($_POST['plato']);

    if (!isset($_SESSION['rol']) || $_SESSION['rol'] !== 'Cliente') {
        echo json_encode(['error' => 'Solo clientes pueden gestionar platos favoritos']);
        exit;
    }

    $stmtCheck = $con->prepare("SELECT COUNT(*) AS c FROM Cliente WHERE cliente_id = ?");
    $stmtCheck->execute([$cliente_id]);
    $exists = $stmtCheck->fetch(PDO::FETCH_ASSOC);
    if (!$exists || (int)$exists['c'] === 0) {
        echo json_encode(['error' => 'Cliente no existe']);
        exit;
    }

    $query = "UPDATE Cliente SET cliente_platillo_favorito = ? WHERE cliente_id = ?";
    $stmt = $con->prepare($query);
    $ok = $stmt->execute([$plato, $cliente_id]);

    if ($ok) {
        echo json_encode([
            'success' => true,
            'plato_id' => $cliente_id,
            'plato' => $plato
        ]);
    } else {
        echo json_encode(['error' => 'Error al agregar el plato favorito']);
    }
} catch (Exception $e) {
    echo json_encode(['error' => 'Error al agregar plato favorito: ' . $e->getMessage()]);
}
?>