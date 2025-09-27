<?php
include '../../../Control/Conexión/conexion.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['idMesa'])) {
    http_response_code(400);
    echo json_encode(["error" => "Falta idMesa"]);
    exit;
}

try {
    $mesaId = (int)$data['idMesa'];

    // 1) Bloquear si existen pedidos para esta mesa
    $stmt = $con->prepare("SELECT COUNT(*) FROM Pedido WHERE mesa_id = ?");
    $stmt->execute([$mesaId]);
    if ((int)$stmt->fetchColumn() > 0) {
        http_response_code(409);
        echo json_encode(["error" => "No se puede eliminar la mesa porque tiene pedidos asociados."]);
        exit;
    }

    // 2) Obtener ubicacion y alcance de la mesa a eliminar
    $stmtMesa = $con->prepare("SELECT mesa_ubicacion, mesa_alcance FROM Mesa WHERE mesa_id = ?");
    $stmtMesa->execute([$mesaId]);
    $mesaInfo = $stmtMesa->fetch(PDO::FETCH_ASSOC);
    if (!$mesaInfo) {
        http_response_code(404);
        echo json_encode(["error" => "Mesa no encontrada"]);
        exit;
    }

    $ubicacion = $mesaInfo['mesa_ubicacion'];

    // 3) Traer reservas asociadas a la mesa
    $stmtRes = $con->prepare("SELECT reserva_id, reserva_cantidad_personas FROM Reserva WHERE mesa_id = ?");
    $stmtRes->execute([$mesaId]);
    $reservas = $stmtRes->fetchAll(PDO::FETCH_ASSOC);

    $con->beginTransaction();

    // 4) Reasignar cada reserva a una mesa Libre con misma ubicacion y alcance suficiente
    foreach ($reservas as $res) {
        $minAlcance = (int)$res['reserva_cantidad_personas'];

        $stmtCand = $con->prepare(
            "SELECT mesa_id, mesa_alcance FROM Mesa 
             WHERE mesa_estado = 'Libre' AND mesa_ubicacion = ? AND mesa_id <> ? AND mesa_alcance >= ?
             ORDER BY mesa_alcance ASC, mesa_id ASC
             LIMIT 1"
        );
        $stmtCand->execute([$ubicacion, $mesaId, $minAlcance]);
        $candidata = $stmtCand->fetch(PDO::FETCH_ASSOC);

        if (!$candidata) {
            $con->rollBack();
            http_response_code(409);
            echo json_encode(["error" => "No hay mesas disponibles para reasignar la reserva " . $res['reserva_id'] . "."]);
            exit;
        }

        // Actualizar reserva a la mesa candidata
        $stmtUpdRes = $con->prepare("UPDATE Reserva SET mesa_id = ? WHERE reserva_id = ?");
        $stmtUpdRes->execute([(int)$candidata['mesa_id'], (int)$res['reserva_id']]);
    }

    // 5) Eliminar la mesa
    $stmtDel = $con->prepare("DELETE FROM Mesa WHERE mesa_id = ?");
    $stmtDel->execute([$mesaId]);

    $con->commit();

    echo json_encode(["mensaje" => "Mesa eliminada"]);
} catch (Exception $e) {
    if ($con->inTransaction()) {
        $con->rollBack();
    }
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>