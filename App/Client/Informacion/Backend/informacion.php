<?php
    require_once '../../../Control/Conexion/conexion.php';
    
    $sql = "SELECT empresa_nombre, empresa_mision, empresa_vision, empresa_valores FROM empresa;";
    $stmt = $con->prepare($sql);
    $stmt->execute();
    $info = $stmt->fetch(PDO::FETCH_ASSOC);

    $response = [
        "info" => $info,
    ];

    echo json_encode($response);
?>
