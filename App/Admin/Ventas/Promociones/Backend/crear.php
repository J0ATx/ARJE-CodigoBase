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

        // Validaciones
        if (empty($data['promocion_nombre'])) {
            throw new Exception('El nombre de la promoción es requerido');
        }

        if (empty($data['promocion_descripcion'])) {
            throw new Exception('La descripción de la promoción es requerida');
        }

        if (!isset($data['promocion_descuento']) || $data['promocion_descuento'] === '') {
            throw new Exception('El descuento es requerido');
        }

        $descuento = floatval($data['promocion_descuento']);
        if ($descuento < 0 || $descuento > 100) {
            throw new Exception('El descuento debe estar entre 0 y 100');
        }

        // Nota: ya no se requiere enviar productos al crear una promoción.

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

        if (empty($data['productos']) || !is_array($data['productos'])) {
            throw new Exception('Debe seleccionar al menos un producto');
        }

        // Iniciar transacción
        $con->beginTransaction();

        // Crear promoción
        $sqlPromocion = 'INSERT INTO Promocion 
                        (promocion_nombre, promocion_descripcion, promocion_descuento, promocion_fidelizada, promocion_creacion)
                        VALUES (?, ?, ?, ?, CURDATE())';

        $stmtPromocion = $con->prepare($sqlPromocion);

        if (!$stmtPromocion) {
            throw new Exception('Error al preparar inserción de promoción');
        }

        if (!$stmtPromocion->execute([$nombre, $descripcion, $descuento, $fidelizada ? 1 : 0])) {
            throw new Exception('Error al crear la promoción');
        }

        $promocionId = $con->lastInsertId();

        if (!$promocionId) {
            throw new Exception('Error al obtener ID de la promoción creada');
        }

        // Insertar relaciones Aplica para cada producto seleccionado
        $sqlAplica = 'INSERT INTO Aplica (promocion_id, producto_id) VALUES (?, ?)';
        $stmtAplica = $con->prepare($sqlAplica);

        if (!$stmtAplica) {
            throw new Exception('Error al preparar relación de productos');
        }

        foreach ($data['productos'] as $productoId) {
            $productoId = intval($productoId);

            // Validar que el producto existe
            $sqlValidar = 'SELECT producto_id FROM Producto WHERE producto_id = ?';
            $stmtValidar = $con->prepare($sqlValidar);

            if (!$stmtValidar || !$stmtValidar->execute([$productoId])) {
                throw new Exception('Error al validar producto');
            }

            if ($stmtValidar->rowCount() === 0) {
                throw new Exception('El producto con ID ' . $productoId . ' no existe');
            }

            if (!$stmtAplica->execute([$promocionId, $productoId])) {
                throw new Exception('Error al asociar producto a la promoción');
            }
        }

        // Confirmar transacción
        $con->commit();

        $response['success'] = true;
        $response['message'] = 'Promoción creada exitosamente';
        $response['data'] = [
            'promocion_id' => $promocionId,
            'promocion_nombre' => $nombre,
            'promocion_descuento' => $descuento
        ];

        http_response_code(201);

    } catch (Exception $e) {
        // Revertir transacción si está activa
        if (isset($con) && $con->inTransaction()) {
            $con->rollBack();
        }

        http_response_code(400);
        $response['success'] = false;
        $response['message'] = $e->getMessage();
        error_log('Error en crear.php: ' . $e->getMessage());
    }

    echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
?>