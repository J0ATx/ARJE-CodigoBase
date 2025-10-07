<?php
require_once '../../../../../Control/Conexión/conexion.php';
header('Content-Type: application/json');

try {
    // Nueva BD: mozos son 'Camarero' vinculados a 'Personal'
    $sql = "
        SELECT p.personal_id, p.personal_nombre, p.personal_apellido
        FROM Camarero c
        INNER JOIN Personal p ON p.personal_id = c.personal_id
        ORDER BY p.personal_apellido, p.personal_nombre
    ";
    $stmt = $con->query($sql);
    $mozos = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($mozos);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Error al obtener la lista de mozos: " . $e->getMessage()]);
}
?>
