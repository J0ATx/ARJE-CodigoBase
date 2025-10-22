<?php
    require_once '../../../../Control/Conexion/conexion.php';

    $sql = "DELETE FROM empresa_horario 
            WHERE empresa_dia = :dia 
            AND empresa_hora = :hora";

    $stmt = $con->prepare($sql);
    $stmt->bindParam(':dia', $_POST['dia']);
    $stmt->bindParam(':hora', $_POST['hora']);
    $stmt->execute();
    echo json_encode(['status' => 'Bien']);
?>