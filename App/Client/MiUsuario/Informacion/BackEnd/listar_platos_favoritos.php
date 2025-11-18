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
        echo json_encode(['success' => true, 'platos' => []]);
        exit;
    }

    $stmtCheck = $con->prepare("SELECT COUNT(*) AS c FROM Cliente WHERE cliente_id = ?");
    $stmtCheck->execute([$cliente_id]);
    $exists = $stmtCheck->fetch(PDO::FETCH_ASSOC);
    if (!$exists || (int)$exists['c'] === 0) {
        echo json_encode(['success' => true, 'platos' => []]);
        exit;
    }

    $platos = [];
    try {
        $query = "SELECT cliente_plato_id, cliente_plato_nombre FROM Cliente_Plato_Favorito WHERE cliente_id = ? ORDER BY cliente_plato_nombre";
        $stmt = $con->prepare($query);
        $stmt->execute([$cliente_id]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        foreach ($rows as $row) {
            $platos[] = [
                'id' => $row['cliente_plato_id'],
                'plato' => $row['cliente_plato_nombre']
            ];
        }
    } catch (Exception $ignored) {
        $query = "SELECT cliente_platillo_favorito FROM Cliente WHERE cliente_id = ?";
        $stmt = $con->prepare($query);
        $stmt->execute([$cliente_id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($row && isset($row['cliente_platillo_favorito'])) {
            $str = $row['cliente_platillo_favorito'] ?? '';
            $parts = preg_split('/[,|]/', $str, -1, PREG_SPLIT_NO_EMPTY);
            foreach ($parts as $p) {
                $val = trim($p);
                if ($val !== '') {
                    $platos[] = [
                        'id' => $cliente_id . ':' . $val,
                        'plato' => $val
                    ];
                }
            }
        }
    }

    echo json_encode(['success' => true, 'platos' => $platos]);
} catch (Exception $e) {
    echo json_encode(['error' => 'Error al obtener platos favoritos: ' . $e->getMessage()]);
}
?>