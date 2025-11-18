<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/App/Control/Conexion/clienteRegistrado.php';

header('Content-Type: application/json');
session_start();

if (!isset($_SESSION['usuario_id'])) {
    echo json_encode(['error' => 'No autenticado']);
    exit;
}

try {
    $cliente_id = $_SESSION['usuario_id'];

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

    $alergiaNombre = isset($_POST['alergia_nombre']) ? trim($_POST['alergia_nombre']) : null;
    if (isset($_POST['alergia_id']) && is_numeric($_POST['alergia_id'])) {
        $alergia_id = (int)$_POST['alergia_id'];
        $query = "DELETE FROM Cliente_Alergia WHERE cliente_alergia = ? AND cliente_id = ?";
        $stmt = $con->prepare($query);
        $ok = $stmt->execute([$alergia_id, $cliente_id]);
    } else if ($alergiaNombre) {
        $q = "SELECT cliente_alergia FROM Cliente_Alergia WHERE cliente_id = ?";
        $st = $con->prepare($q);
        $st->execute([$cliente_id]);
        $row = $st->fetch(PDO::FETCH_ASSOC);
        $current = $row && isset($row['cliente_alergia']) ? $row['cliente_alergia'] : '';
        $parts = array_filter(array_map('trim', preg_split('/[,|]/', $current)));
        $parts = array_values(array_filter($parts, function($v) use ($alergiaNombre) { return $v !== $alergiaNombre; }));
        if (empty($parts)) {
            $query = "DELETE FROM Cliente_Alergia WHERE cliente_id = ?";
            $stmt = $con->prepare($query);
            $ok = $stmt->execute([$cliente_id]);
        } else {
            $new = implode(',', $parts);
            $query = "UPDATE Cliente_Alergia SET cliente_alergia = ? WHERE cliente_id = ?";
            $stmt = $con->prepare($query);
            $ok = $stmt->execute([$new, $cliente_id]);
        }
    } else {
        echo json_encode(['error' => 'Parámetros inválidos']);
        exit;
    }

    if ($ok) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['error' => 'Error al eliminar la alergia']);
    }
} catch (Exception $e) {
    echo json_encode(['error' => 'Error al eliminar alergia: ' . $e->getMessage()]);
}
?>