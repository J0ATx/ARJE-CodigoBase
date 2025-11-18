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
        echo json_encode(['success' => true, 'alergias' => []]);
        exit;
    }

    $stmtCheck = $con->prepare("SELECT COUNT(*) AS c FROM Cliente WHERE cliente_id = ?");
    $stmtCheck->execute([$cliente_id]);
    $exists = $stmtCheck->fetch(PDO::FETCH_ASSOC);
    if (!$exists || (int)$exists['c'] === 0) {
        echo json_encode(['success' => true, 'alergias' => []]);
        exit;
    }

    $alergias = [];
    try {
        $query = "SELECT cliente_alergia_id, cliente_alergia FROM Cliente_Alergia WHERE cliente_id = ? ORDER BY cliente_alergia";
        $stmt = $con->prepare($query);
        $stmt->execute([$cliente_id]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        foreach ($rows as $row) {
            $alergias[] = [
                'id' => $row['cliente_alergia_id'],
                'alergia' => $row['cliente_alergia']
            ];
        }
    } catch (Exception $ignored) {
        $query = "SELECT cliente_alergia FROM Cliente_Alergia WHERE cliente_id = ?";
        $stmt = $con->prepare($query);
        $stmt->execute([$cliente_id]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        foreach ($rows as $row) {
            $str = $row['cliente_alergia'] ?? '';
            $parts = preg_split('/[,|]/', $str, -1, PREG_SPLIT_NO_EMPTY);
            foreach ($parts as $p) {
                $val = trim($p);
                if ($val !== '') {
                    $alergias[] = [
                        'id' => $cliente_id . ':' . $val,
                        'alergia' => $val
                    ];
                }
            }
        }
    }

    echo json_encode(['success' => true, 'alergias' => $alergias]);
} catch (Exception $e) {
    echo json_encode(['error' => 'Error al obtener alergias: ' . $e->getMessage()]);
}
?>