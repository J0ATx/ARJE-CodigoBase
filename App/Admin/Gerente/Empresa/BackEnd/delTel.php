<?php
    require_once '../../../../Control/Conexion/conexion.php';

    $sql = "DELETE FROM empresa_telefono
            WHERE empresa_telefono = :telefono;";

    $stmt = $con->prepare($sql);
    $stmt->bindParam(':telefono', $_POST['telefono']);
    $stmt->execute();
    echo json_encode(['status' => 'Bien']);
?>