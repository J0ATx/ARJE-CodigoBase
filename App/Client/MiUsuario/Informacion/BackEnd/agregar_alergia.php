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

    try {
        $query = "INSERT INTO Cliente_Alergia (cliente_id, cliente_alergia) VALUES (?, ?)";
        $stmt = $con->prepare($query);
        $ok = $stmt->execute([$cliente_id, $alergia]);
        if ($ok) {
            echo json_encode([
                'success' => true,
                'alergia_id' => $con->lastInsertId(),
                'alergia' => $alergia
            ]);
            exit;
        }
    } catch (PDOException $e) {
        if ($e->getCode() === '23000') {
            $q = "SELECT cliente_alergia FROM Cliente_Alergia WHERE cliente_id = ?";
            $st = $con->prepare($q);
            $st->execute([$cliente_id]);
            $row = $st->fetch(PDO::FETCH_ASSOC);
            $current = $row && isset($row['cliente_alergia']) ? $row['cliente_alergia'] : '';
            $parts = array_filter(array_map('trim', preg_split('/[,|]/', $current)));
            if (in_array($alergia, $parts, true)) {
                echo json_encode(['error' => 'Esta alergia ya está registrada']);
                exit;
            }
            $parts[] = $alergia;
            $new = implode(',', $parts);
            $u = "UPDATE Cliente_Alergia SET cliente_alergia = ? WHERE cliente_id = ?";
            $su = $con->prepare($u);
            $ok = $su->execute([$new, $cliente_id]);
            if ($ok) {
                echo json_encode([
                    'success' => true,
                    'alergia_id' => $cliente_id . ':' . $alergia,
                    'alergia' => $alergia
                ]);
                exit;
            }
        }
        echo json_encode(['error' => 'Error al agregar la alergia']);
    }
} catch (Exception $e) {
    echo json_encode(['error' => 'Error al agregar alergia: ' . $e->getMessage()]);
}
?>