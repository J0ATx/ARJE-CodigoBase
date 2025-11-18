<?php
    header('Content-Type: application/json; charset=utf-8');
    require_once '../../../../Control/Conexion/empleado.php';

    $response = [
        'success' => false,
        'message' => '',
        'data' => []
    ];

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        $response['message'] = 'Método HTTP no permitido. Se requiere POST.';
        echo json_encode($response);
        exit;
    }

    try {
        // Validar conexión
        if (!isset($con) || $con === null) {
            throw new Exception('No hay conexión a la base de datos');
        }

        // Obtener y validar parámetros
        $data = json_decode(file_get_contents('php://input'), true);

        if ($data === null) {
            throw new Exception('Error al decodificar JSON');
        }

        if (empty($data['promocion_id'])) {
            throw new Exception('El ID de la promoción es requerido');
        }

        $promocionId = intval($data['promocion_id']);

        // Validar que la promoción existe
        $sqlValidar = 'SELECT promocion_id FROM Promocion WHERE promocion_id = ?';
        $stmtValidar = $con->prepare($sqlValidar);

        if (!$stmtValidar || !$stmtValidar->execute([$promocionId])) {
            throw new Exception('Error al validar promoción');
        }

        if ($stmtValidar->rowCount() === 0) {
            throw new Exception('La promoción no existe');
        }

        // Validaciones
        if (empty($data['promocion_nombre'])) {
            throw new Exception('El nombre de la promoción es requerido');
        }

        if (empty($data['promocion_descripcion'])) {
            throw new Exception('La descripción es requerida');
        }

        if (!isset($data['promocion_descuento']) || $data['promocion_descuento'] === '') {
            throw new Exception('El descuento es requerido');
        }

        $descuento = floatval($data['promocion_descuento']);
        if ($descuento < 0 || $descuento > 100) {
            throw new Exception('El descuento debe estar entre 0 y 100');
        }

        if (empty($data['productos']) || !is_array($data['productos'])) {
            throw new Exception('Debe seleccionar al menos un producto');
        }

        // Sanitizar entradas
        $nombre = trim(htmlspecialchars($data['promocion_nombre']));
        $descripcion = trim(htmlspecialchars($data['promocion_descripcion']));
        $fidelizada = isset($data['promocion_fidelizada']) ? (bool)$data['promocion_fidelizada'] : false;

        // Validar longitudes
        if (strlen($nombre) > 100) {
            throw new Exception('El nombre no puede exceder 100 caracteres');
        }

        if (strlen($descripcion) > 100) {
            throw new Exception('La descripción no puede exceder 100 caracteres');
        }

        // Iniciar transacción
        $con->beginTransaction();

        // Actualizar promoción
        $sqlUpdate = 'UPDATE Promocion 
                      SET promocion_nombre = ?, 
                          promocion_descripcion = ?, 
                          promocion_descuento = ?, 
                          promocion_fidelizada = ?
                      WHERE promocion_id = ?';

        $stmtUpdate = $con->prepare($sqlUpdate);

        if (!$stmtUpdate) {
            throw new Exception('Error al preparar actualización');
        }

        if (!$stmtUpdate->execute([$nombre, $descripcion, $descuento, $fidelizada ? 1 : 0, $promocionId])) {
            throw new Exception('Error al actualizar la promoción');
        }

        // Eliminar productos previos asociados
        $sqlDeleteAplica = 'DELETE FROM Aplica WHERE promocion_id = ?';
        $stmtDeleteAplica = $con->prepare($sqlDeleteAplica);

        if (!$stmtDeleteAplica) {
            throw new Exception('Error al preparar eliminación de productos');
        }

        if (!$stmtDeleteAplica->execute([$promocionId])) {
            throw new Exception('Error al eliminar productos previos');
        }

        // Insertar nuevas relaciones Aplica
        $sqlAplica = 'INSERT INTO Aplica (promocion_id, producto_id) VALUES (?, ?)';
        $stmtAplica = $con->prepare($sqlAplica);

        if (!$stmtAplica) {
            throw new Exception('Error al preparar relación de productos');
        }

        foreach ($data['productos'] as $productoId) {
            $productoId = intval($productoId);

            // Validar que el producto existe
            $sqlValidarProducto = 'SELECT producto_id FROM Producto WHERE producto_id = ?';
            $stmtValidarProducto = $con->prepare($sqlValidarProducto);

            if (!$stmtValidarProducto || !$stmtValidarProducto->execute([$productoId])) {
                throw new Exception('Error al validar producto');
            }

            if ($stmtValidarProducto->rowCount() === 0) {
                throw new Exception('El producto con ID ' . $productoId . ' no existe');
            }

            if (!$stmtAplica->execute([$promocionId, $productoId])) {
                throw new Exception('Error al asociar producto a la promoción');
            }
        }

        // Confirmar transacción
        $con->commit();

        $response['success'] = true;
        $response['message'] = 'Promoción actualizada exitosamente';
        $response['data'] = [
            'promocion_id' => $promocionId,
            'promocion_nombre' => $nombre
        ];

        http_response_code(200);

    } catch (Exception $e) {
        // Revertir transacción si está activa
        if (isset($con) && $con->inTransaction()) {
            $con->rollBack();
        }

        http_response_code(400);
        $response['success'] = false;
        $response['message'] = $e->getMessage();
        error_log('Error en modificar.php: ' . $e->getMessage());
    }

    echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
?>