<?php
header('Content-Type: application/json');
require_once '../../../../../Control/Conexion/empleado.php';

$response = ["success" => false, "tiene_reserva" => false];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $mesaId = isset($_POST['mesa_id']) ? (int)$_POST['mesa_id'] : null;

    if (!$mesaId) {
        $response['message'] = 'Mesa no especificada';
        echo json_encode($response);
        exit;
    }

    try {
        $sql = "
            SELECT 
                r.reserva_id,
                r.reserva_fecha,
                r.reserva_inicio,
                r.reserva_duracion,
                r.reserva_cantidad_personas,
                r.cliente_id,
                r.reserva_estado
            FROM Reserva r
            WHERE r.mesa_id = ?
            AND r.reserva_estado = 'Pendiente'
            AND r.reserva_fecha = CURDATE()
            AND (
                NOW() BETWEEN 
                    TIMESTAMP(r.reserva_fecha, r.reserva_inicio) - INTERVAL 30 MINUTE
                    AND 
                    TIMESTAMP(r.reserva_fecha, r.reserva_inicio) + INTERVAL CAST(r.reserva_duracion AS UNSIGNED) HOUR
            )
            ORDER BY r.reserva_inicio ASC
            LIMIT 1
        ";
        
        $stmt = $con->prepare($sql);
        $stmt->execute([$mesaId]);
        $reserva = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($reserva) {
            $response['success'] = true;
            $response['tiene_reserva'] = true;
            $response['reserva'] = [
                'reserva_id' => $reserva['reserva_id'],
                'reserva_fecha' => $reserva['reserva_fecha'],
                'reserva_inicio' => $reserva['reserva_inicio'],
                'reserva_duracion' => $reserva['reserva_duracion'],
                'reserva_cantidad_personas' => $reserva['reserva_cantidad_personas'],
                'cliente_id' => $reserva['cliente_id'],
                'reserva_estado' => $reserva['reserva_estado']
            ];
        } else {
            $response['success'] = true;
            $response['tiene_reserva'] = false;
        }
    } catch (Exception $e) {
        $response['message'] = 'Error al consultar reserva: ' . $e->getMessage();
    }
} else {
    $response['message'] = 'Método no permitido';
}

echo json_encode($response);

