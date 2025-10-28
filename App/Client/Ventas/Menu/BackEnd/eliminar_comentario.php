<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

include_once '../../../../Control/Conexion/clienteRegistrado.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
        throw new Exception('Método no permitido');
    }

    $input = json_decode(file_get_contents('php://input'), true);

    $comentario_id = $input['comentario_id'] ?? null;
    $cliente_id = $input['cliente_id'] ?? null;

    if (!$comentario_id || !$cliente_id) {
        throw new Exception('Datos incompletos: comentario_id y cliente_id son requeridos');
    }

    $sql_verificar_comentario = "SELECT cliente_id FROM Comentario WHERE comentario_id = ?";
    $stmt_verificar = $con->prepare($sql_verificar_comentario);
    $stmt_verificar->execute([$comentario_id]);
    $comentario = $stmt_verificar->fetch(PDO::FETCH_ASSOC);

    if (!$comentario) {
        throw new Exception('Comentario no encontrado');
    }

    $sql_verificar_usuario = "SELECT usuario_rol FROM datos_usuarios WHERE usuario_id = ?";
    $stmt_usuario = $con->prepare($sql_verificar_usuario);
    $stmt_usuario->execute([$cliente_id]);
    $usuario = $stmt_usuario->fetch(PDO::FETCH_ASSOC);

    if (!$usuario) {
        throw new Exception('Usuario no encontrado');
    }

    $es_propietario = $comentario['cliente_id'] === $cliente_id;
    $es_gerente_general = $usuario['usuario_rol'] === 'Gerente-General';

    if (!$es_propietario && !$es_gerente_general) {
        throw new Exception('No tienes permisos para eliminar este comentario');
    }

    $sql_eliminar = "DELETE FROM Comentario WHERE comentario_id = ? AND cliente_id = ?";
    $stmt_eliminar = $con->prepare($sql_eliminar);
    $stmt_eliminar->execute([$comentario_id, $comentario['cliente_id']]);

    if ($stmt_eliminar->rowCount() === 0) {
        throw new Exception('No se pudo eliminar el comentario');
    }

    echo json_encode([
        'success' => true,
        'message' => 'Comentario eliminado exitosamente'
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
