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

    try {
        $query = "INSERT INTO Cliente_Plato_Favorito (cliente_id, cliente_plato_nombre) VALUES (?, ?)";
        $stmt = $con->prepare($query);
        $ok = $stmt->execute([$cliente_id, $plato]);
        if ($ok) {
            echo json_encode([
                'success' => true,
                'plato_id' => $con->lastInsertId(),
                'plato' => $plato
            ]);
            exit;
        }
    } catch (PDOException $e) {
        try {
            $q = "SELECT cliente_platillo_favorito FROM Cliente WHERE cliente_id = ?";
            $st = $con->prepare($q);
            $st->execute([$cliente_id]);
            $row = $st->fetch(PDO::FETCH_ASSOC);
            $current = $row && isset($row['cliente_platillo_favorito']) ? $row['cliente_platillo_favorito'] : '';
            $parts = array_filter(array_map('trim', preg_split('/[,|]/', $current)));
            if (in_array($plato, $parts, true)) {
                echo json_encode(['error' => 'Este plato ya está registrado']);
                exit;
            }
            $parts[] = $plato;
            $new = implode(',', $parts);
            $u = "UPDATE Cliente SET cliente_platillo_favorito = ? WHERE cliente_id = ?";
            $su = $con->prepare($u);
            $ok = $su->execute([$new, $cliente_id]);
            if ($ok) {
                echo json_encode([
                    'success' => true,
                    'plato_id' => $cliente_id . ':' . $plato,
                    'plato' => $plato
                ]);
                exit;
            }
        } catch (Exception $fallbackErr) {
            echo json_encode(['error' => 'Error al agregar el plato favorito']);
        }
    }
} catch (Exception $e) {
    echo json_encode(['error' => 'Error al agregar plato favorito: ' . $e->getMessage()]);
}
?>