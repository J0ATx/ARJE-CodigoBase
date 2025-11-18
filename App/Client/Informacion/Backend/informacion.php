<?php
    require_once '../../../Control/Conexion/clienteRegistrado.php';
    
    $sql = "SELECT empresa_nombre, empresa_mision, empresa_vision, empresa_valores, empresa_calle, empresa_ciudad FROM empresa JOIN empresa_ubicacion ON empresa.empresa_id = empresa_ubicacion.empresa_id;";
    $stmt = $con->prepare($sql);
    $stmt->execute();
    $info = $stmt->fetch(PDO::FETCH_ASSOC);

    $response = [
        "info" => $info,
    ];

    echo json_encode($response);
?>
