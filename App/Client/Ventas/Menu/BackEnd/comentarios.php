<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

include_once '../../../../Control/Conexion/clienteRegistrado.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Método no permitido');
    }

    $input = json_decode(file_get_contents('php://input'), true);

    $producto_id = $input['producto_id'] ?? null;
    $cliente_id = $input['cliente_id'] ?? null;
    $comentario_contenido = $input['comentario_contenido'] ?? '';
    $comentario_calificacion = $input['comentario_calificacion'] ?? null;

    if (!$producto_id || !$cliente_id || !$comentario_calificacion) {
        throw new Exception('Datos incompletos: producto_id, cliente_id y comentario_calificacion son requeridos');
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

    $sql_verificar_producto = "SELECT COUNT(*) as existe FROM Producto WHERE producto_id = ?";
    $stmt_producto = $con->prepare($sql_verificar_producto);
    $stmt_producto->execute([$producto_id]);
    $producto_existe = $stmt_producto->fetch(PDO::FETCH_ASSOC);

    if (!$producto_existe['existe']) {
        throw new Exception('Producto no encontrado');
    }

    $sql_verificar_comentario = "CALL Verificar_Comentario_Existente(?, ?, @existe)";
    $stmt_verificar = $con->prepare($sql_verificar_comentario);
    $stmt_verificar->execute([$producto_id, $cliente_id]);

    $result_check = $con->query("SELECT @existe as existe");
    $comentario_existente = $result_check->fetch(PDO::FETCH_ASSOC);

    if ($comentario_existente['existe']) {
        throw new Exception('Ya has comentado este producto');
    }

    $sql_insertar = "INSERT INTO Comentario (producto_id, cliente_id, comentario_contenido, comentario_calificacion)
                     VALUES (?, ?, ?, ?)";
    $stmt_insertar = $con->prepare($sql_insertar);
    $stmt_insertar->execute([$producto_id, $cliente_id, $comentario_contenido, $comentario_calificacion]);
    $sql_promedio = "SELECT producto_calificacion FROM Producto WHERE producto_id = ?";
    $stmt_promedio = $con->prepare($sql_promedio);
    $stmt_promedio->execute([$producto_id]);
    $producto_actualizado = $stmt_promedio->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'message' => 'Comentario agregado exitosamente',
        'data' => [
            'comentario_id' => $con->lastInsertId(),
            'producto_id' => $producto_id,
            'cliente_id' => $cliente_id,
            'comentario_contenido' => $comentario_contenido,
            'comentario_calificacion' => $comentario_calificacion,
            'promedio_actualizado' => $producto_actualizado['producto_calificacion']
        ]
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
