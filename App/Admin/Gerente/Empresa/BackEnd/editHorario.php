<?php
    require_once '../../../../Control/Conexion/conexion.php';

    $sql = "UPDATE empresa_horario SET
            empresa_hora = :hora
            WHERE empresa_dia = :dia AND empresa_hora = :anteriorHorario;";

    $stmt = $con->prepare($sql);
    $stmt->bindParam(':dia', $_POST['dia']);
    $stmt->bindParam(':hora', $_POST['hora']);
    $stmt->bindParam(':anteriorHorario', $_POST['anterior_horario']);
    $stmt->execute();
    echo json_encode(['status' => 'Bien ubi']);
?>