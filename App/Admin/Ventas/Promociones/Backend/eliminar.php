<?php
    header('Content-Type: application/json; charset=utf-8');
    require_once '../../../../Control/Conexion/conexion.php';

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
        $sqlValidar = 'SELECT promocion_id, promocion_nombre FROM Promocion WHERE promocion_id = ?';
        $stmtValidar = $con->prepare($sqlValidar);

        if (!$stmtValidar || !$stmtValidar->execute([$promocionId])) {
            throw new Exception('Error al validar promoción');
        }

        if ($stmtValidar->rowCount() === 0) {
            throw new Exception('La promoción no existe');
        }

        $promoData = $stmtValidar->fetch(PDO::FETCH_ASSOC);
        $promoNombre = $promoData['promocion_nombre'];

        // Iniciar transacción
        $con->beginTransaction();

        // Eliminar relaciones Posee primero (por clave foránea)
        $sqlDeletePosee = 'DELETE FROM Posee WHERE promocion_id = ?';
        $stmtDeletePosee = $con->prepare($sqlDeletePosee);

        if (!$stmtDeletePosee) {
            throw new Exception('Error al preparar eliminación de relaciones');
        }

        if (!$stmtDeletePosee->execute([$promocionId])) {
            throw new Exception('Error al eliminar relaciones de productos');
        }

        // Eliminar la promoción
        $sqlDelete = 'DELETE FROM Promocion WHERE promocion_id = ?';
        $stmtDelete = $con->prepare($sqlDelete);

        if (!$stmtDelete) {
            throw new Exception('Error al preparar eliminación de promoción');
        }

        if (!$stmtDelete->execute([$promocionId])) {
            throw new Exception('Error al eliminar la promoción');
        }

        if ($stmtDelete->rowCount() === 0) {
            throw new Exception('No se pudo eliminar la promoción');
        }

        // Confirmar transacción
        $con->commit();

        $response['success'] = true;
        $response['message'] = 'Promoción eliminada exitosamente';
        $response['data'] = [
            'promocion_id' => $promocionId,
            'promocion_nombre' => $promoNombre
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
        error_log('Error en eliminar.php: ' . $e->getMessage());
    }

    echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
?>