<?php
    require_once '../../../Control/Conexion/conexion.php';
    
    $sql = "SELECT empresa_dia, empresa_hora FROM empresa_horario;";
    $stmt = $con->prepare($sql);
    $stmt->execute();
    $horarios = $stmt->fetchAll(PDO::FETCH_ASSOC);
    // $horarios = $horarios ?: 'Sin datos';

    $sql = "SELECT empresa_ciudad, empresa_calle, empresa_whatsapp, empresa_instagram, empresa_facebook
            FROM empresa JOIN empresa_ubicacion USING (empresa_id);";
    $stmt = $con->prepare($sql);
    $stmt->execute();
    $info = $stmt->fetch(PDO::FETCH_ASSOC);
    // $info = $info ?: 'Sin datos';

    $sql = "SELECT empresa_telefono
            FROM empresa_telefono;";
    $stmt = $con->prepare($sql);
    $stmt->execute();
    $telefonos = $stmt->fetch(PDO::FETCH_ASSOC);
    // $telefonos = $telefonos ?: 'Sin datos';

    $response = [
        "info" => $info,
        "horarios" => $horarios,
        "telefonos" => $telefonos
    ];

    echo json_encode($response);
?>
