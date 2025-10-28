<?php
    require_once '../../../../Control/Conexion/conexion.php';

    $sql = "SELECT empresa_nombre, empresa_mision, empresa_vision, empresa_valores, empresa_whatsapp, empresa_instagram, empresa_facebook
            FROM empresa;";
    $stmt = $con->prepare($sql);
    $stmt->execute();
    $info = $stmt->fetch(PDO::FETCH_ASSOC);

    $sql = "SELECT empresa_ciudad, empresa_calle FROM empresa_ubicacion;";
    $stmt = $con->prepare($sql);
    $stmt->execute();
    $ubicacion = $stmt->fetch(PDO::FETCH_ASSOC);
    
    $sql = "SELECT empresa_dia, empresa_hora FROM empresa_horario;";
    $stmt = $con->prepare($sql);
    $stmt->execute();
    $horarios = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $sql = "SELECT empresa_telefono FROM empresa_telefono;";
    $stmt = $con->prepare($sql);
    $stmt->execute();
    $telefonos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $response = [
        'info' => $info,
        'ubicacion' => $ubicacion,
        'horarios' => $horarios,
        'telefonos' => $telefonos
    ];

    echo json_encode($response);
?>
