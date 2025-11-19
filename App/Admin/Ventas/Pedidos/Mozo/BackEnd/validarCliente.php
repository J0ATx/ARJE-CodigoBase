<?php
header('Content-Type: application/json');
require_once '../../../../../Control/Conexion/empleado.php';

$email = null;
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = isset($_POST['email']) ? trim($_POST['email']) : null;
} else {
    $email = isset($_GET['email']) ? trim($_GET['email']) : null;
}

if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => true, 'exists' => false, 'message' => 'Email inválido']);
    exit;
}

try {
    $stmt = $con->prepare('SELECT 1 FROM Cliente WHERE cliente_id = ?');
    $stmt->execute([$email]);
    $exists = $stmt->fetchColumn() !== false;
    echo json_encode(['success' => true, 'exists' => $exists]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}