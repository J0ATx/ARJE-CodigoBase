<?php
    require_once '../../../../Control/Conexion/conexion.php';

    $sql = "INSERT INTO empresa_horario (empresa_id, empresa_dia, empresa_hora)
            VALUES (1, :dia, :hora);";

    $stmt = $con->prepare($sql);
    $stmt->bindParam(':dia', $_POST['dia']);
    $stmt->bindParam(':hora', $_POST['hora']);
    $stmt->execute();
    echo json_encode(['status' => 'Bien']);
?>