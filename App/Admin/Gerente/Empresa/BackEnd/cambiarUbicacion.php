<?php
    require_once '../../../../Control/Conexion/gerente.php';

    $sql = "UPDATE empresa_ubicacion SET
            empresa_ciudad = :ciudad,
            empresa_calle = :calle
            WHERE empresa_id = 1;";

    $stmt = $con->prepare($sql);
    $stmt->bindParam(':ciudad', $_POST['ciudad']);
    $stmt->bindParam(':calle', $_POST['calles']);
    $stmt->execute();
    echo json_encode(['status' => 'Bien ubi']);
?>
