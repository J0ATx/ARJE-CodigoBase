<?php
    require_once '../../../../Control/Conexion/conexion.php';

    $sql = "INSERT INTO empresa_telefono (empresa_id, empresa_telefono)
            VALUES (1, :telefono);";

    $stmt = $con->prepare($sql);
    $stmt->bindParam(':telefono', $_POST['telefono']);
    $stmt->execute();
    echo json_encode(['status' => 'Bien']);
?>
