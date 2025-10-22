<?php
    require_once '../../../../Control/Conexion/conexion.php';

    $sql = "UPDATE empresa_telefono SET
            empresa_telefono = :nuevoTelefono
            WHERE empresa_telefono = :anteriorTelefono;";

    $stmt = $con->prepare($sql);
    $stmt->bindParam(':nuevoTelefono', $_POST['nuevo_telefono']);
    $stmt->bindParam(':anteriorTelefono', $_POST['anterior_telefono']);
    $stmt->execute();
    echo json_encode(['status' => 'Bien']);
?>