<?php
include '../../../Control/Conexion/empleado.php';

try {
    $sql = "
        SELECT 
            m.mesa_id,
            m.mesa_alcance,
            m.mesa_estado,
            m.mesa_tiempo_uso,
            m.mesa_reservable,
            r.reserva_id,
            r.reserva_fecha,
            r.reserva_inicio,
            r.cliente_id AS email
        FROM Mesa m
        LEFT JOIN Reserva r ON r.mesa_id = m.mesa_id
        ORDER BY m.mesa_id, r.reserva_fecha, r.reserva_inicio
    ";
    $stmt = $con->prepare($sql);
    $stmt->execute();
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $mesas = [];
    foreach ($rows as $row) {
        $id = (int)$row['mesa_id'];
        if (!isset($mesas[$id])) {
            $mesas[$id] = [
                'idMesa' => $id,
                'capacidad' => (int)$row['mesa_alcance'],
                'estadoActual' => $row['mesa_estado'],
                'reservable' => $row['mesa_reservable'],
                'tiempoUso' => $row['mesa_tiempo_uso'],
                'reservas' => []
            ];
        }
        if (!is_null($row['reserva_id'])) {
            $mesas[$id]['reservas'][] = [
                'reserva_id' => (int)$row['reserva_id'],
                'fecha' => $row['reserva_fecha'],
                'hora' => $row['reserva_inicio'],
                'email' => $row['email']
            ];
        }
    }

    echo json_encode(array_values($mesas));
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>
