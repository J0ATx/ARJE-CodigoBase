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

    $platoNombre = isset($_POST['plato_nombre']) ? trim($_POST['plato_nombre']) : null;

    if (isset($_POST['plato_id']) && is_numeric($_POST['plato_id'])) {
        $plato_id = (int)$_POST['plato_id'];
        $query = "DELETE FROM Cliente_Plato_Favorito WHERE cliente_plato_id = ? AND cliente_id = ?";
        $stmt = $con->prepare($query);
        $ok = $stmt->execute([$plato_id, $cliente_id]);
    } else if ($platoNombre) {
        $q = "SELECT cliente_platillo_favorito FROM Cliente WHERE cliente_id = ?";
        $st = $con->prepare($q);
        $st->execute([$cliente_id]);
        $row = $st->fetch(PDO::FETCH_ASSOC);
        $current = $row && isset($row['cliente_platillo_favorito']) ? $row['cliente_platillo_favorito'] : '';
        $parts = array_filter(array_map('trim', preg_split('/[,|]/', $current)));
        $parts = array_values(array_filter($parts, function($v) use ($platoNombre) { return $v !== $platoNombre; }));
        if (empty($parts)) {
            $query = "UPDATE Cliente SET cliente_platillo_favorito = NULL WHERE cliente_id = ?";
            $stmt = $con->prepare($query);
            $ok = $stmt->execute([$cliente_id]);
        } else {
            $new = implode(',', $parts);
            $query = "UPDATE Cliente SET cliente_platillo_favorito = ? WHERE cliente_id = ?";
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
        echo json_encode(['error' => 'Error al eliminar el plato favorito']);
    }
} catch (Exception $e) {
    echo json_encode(['error' => 'Error al eliminar plato favorito: ' . $e->getMessage()]);
}
?>