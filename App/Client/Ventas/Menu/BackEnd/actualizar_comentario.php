<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../../../../Control/Conexion/clienteRegistrado.php';

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
        throw new Exception('Método no permitido');
    }
    $input = json_decode(file_get_contents('php://input'), true);

    $comentario_id = $input['comentario_id'] ?? null;
    $cliente_id = $input['cliente_id'] ?? null;
    $comentario_contenido = $input['comentario_contenido'] ?? '';
    $comentario_calificacion = $input['comentario_calificacion'] ?? null;

    if (!$comentario_id || !$cliente_id || !$comentario_calificacion) {
        throw new Exception('Datos incompletos: comentario_id, cliente_id y comentario_calificacion son requeridos');
    }
    if ($comentario_calificacion < 1 || $comentario_calificacion > 10) {
        throw new Exception('La calificación debe estar entre 1 y 10');
    }

    $sql_verificar_cliente = "SELECT COUNT(*) as existe FROM Cliente WHERE cliente_id = ?";
    $stmt_cliente = $con->prepare($sql_verificar_cliente);
    $stmt_cliente->execute([$cliente_id]);
    $cliente_existe = $stmt_cliente->fetch(PDO::FETCH_ASSOC);

    if (!$cliente_existe['existe']) {
        throw new Exception('Cliente no encontrado');
    }

    $sql_verificar_comentario = "SELECT COUNT(*) as existe FROM Comentario WHERE comentario_id = ? AND cliente_id = ?";
    $stmt_verificar = $con->prepare($sql_verificar_comentario);
    $stmt_verificar->execute([$comentario_id, $cliente_id]);
    $comentario_existente = $stmt_verificar->fetch(PDO::FETCH_ASSOC);

    if (!$comentario_existente['existe']) {
        throw new Exception('Comentario no encontrado o no tienes permisos para editarlo');
    }

    $sql_actualizar = "UPDATE Comentario SET
                      comentario_contenido = ?,
                      comentario_calificacion = ?
                      WHERE comentario_id = ? AND cliente_id = ?";
    $stmt_actualizar = $con->prepare($sql_actualizar);
    $stmt_actualizar->execute([$comentario_contenido, $comentario_calificacion, $comentario_id, $cliente_id]);

    $sql_comentario_actualizado = "SELECT
        c.comentario_id,
        c.cliente_id,
        cl.cliente_nombre,
        cl.cliente_apellido,
        c.comentario_contenido,
        c.comentario_calificacion,
        c.producto_id
    FROM Comentario c
    JOIN Cliente cl ON c.cliente_id = cl.cliente_id
    WHERE c.comentario_id = ?";

    $stmt_comentario = $con->prepare($sql_comentario_actualizado);
    $stmt_comentario->execute([$comentario_id]);
    $comentario_actualizado = $stmt_comentario->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'message' => 'Comentario actualizado exitosamente',
        'data' => $comentario_actualizado
    ]);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
} catch (Throwable $th) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Error interno del servidor: ' . $th->getMessage()
    ]);
}
?>
