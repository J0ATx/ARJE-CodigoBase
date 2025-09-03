<?php
require_once '../../../../Control/Conexión/conexion.php';
header('Content-Type: application/json');

try {
    // Consulta para obtener los mozos (usuarios con rol 'mozo')
    $query = "SELECT U.idUsuario, U.nombre, U.apellido 
              FROM Mozo M
              INNER JOIN Usuario U ON M.idUsuario = U.idUsuario
              WHERE U.idUsuario = M.idUsuario 
              ORDER BY U.apellido, U.nombre";
    
    $stmt = $con->query($query);
    $mozos = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode($mozos);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Error al obtener la lista de mozos: " . $e->getMessage()]);
}
?>
