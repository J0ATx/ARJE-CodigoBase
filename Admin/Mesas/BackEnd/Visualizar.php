<?php
include '../../../Control/Conexión/conexion.php';

try {
    $sql = "SELECT * FROM Mesas";
    $stmt = $con->prepare($sql);
    $stmt->execute();
    
    $mesas = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($mesas);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>