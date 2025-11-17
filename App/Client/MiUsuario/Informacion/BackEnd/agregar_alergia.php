<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/App/Control/Conexion/clienteRegistrado.php';

header('Content-Type: application/json');
session_start();

if (!isset($_SESSION['usuario_id'])) {
    echo json_encode(['error' => 'No autenticado']);
    exit;
}

if (!isset($_POST['alergia']) || empty(trim($_POST['alergia']))) {
    echo json_encode(['error' => 'El nombre de la alergia es requerido']);
    exit;
}

try {
    $cliente_id = $_SESSION['usuario_id'];
    $alergia = trim($_POST['alergia']);

    if (!isset($_SESSION['rol']) || $_SESSION['rol'] !== 'Cliente') {
        echo json_encode(['error' => 'Solo clientes pueden gestionar alergias']);
        exit;
    }

    $stmtCheck = $con->prepare("SELECT COUNT(*) AS c FROM Cliente WHERE cliente_id = ?");
    $stmtCheck->execute([$cliente_id]);
    $exists = $stmtCheck->fetch(PDO::FETCH_ASSOC);
    if (!$exists || (int)$exists['c'] === 0) {
        echo json_encode(['error' => 'Cliente no existe']);
        exit;
    }

    $query = "INSERT INTO Cliente_Alergia (cliente_id, cliente_alergia) VALUES (?, ?) 
              ON DUPLICATE KEY UPDATE cliente_alergia = VALUES(cliente_alergia)";
    $stmt = $con->prepare($query);
    $ok = $stmt->execute([$cliente_id, $alergia]);

    if ($ok) {
        echo json_encode([
            'success' => true,
            'alergia_id' => $cliente_id,
            'alergia' => $alergia
        ]);
    } else {
        echo json_encode(['error' => 'Error al agregar la alergia']);
    }
} catch (Exception $e) {
    echo json_encode(['error' => 'Error al agregar alergia: ' . $e->getMessage()]);
}
?>