<?php
    require_once '../../../Control/Conexion/conexion.php';
    
    $sql = "SELECT empresa_dia, empresa_hora FROM empresa_horario;";
    $stmt = $con->prepare($sql);
    $stmt->execute();
    $horarios = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $sql = "SELECT empresa_ciudad, empresa_calle, empresa_telefono, empresa_whatsapp, empresa_instagram, empresa_facebook
            FROM empresa JOIN empresa_telefono USING (empresa_id)
            JOIN empresa_ubicacion USING (empresa_id);";
    $stmt = $con->prepare($sql);
    $stmt->execute();
    $info = $stmt->fetch(PDO::FETCH_ASSOC);

    $response = [
        "info" => $info,
        "horarios" => $horarios,
    ];

    echo json_encode($response);
?>