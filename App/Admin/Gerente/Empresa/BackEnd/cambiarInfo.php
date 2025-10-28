<?php
    require_once '../../../../Control/Conexion/conexion.php';

    $sql = "UPDATE empresa SET
            empresa_nombre = :nombre,
            empresa_mision = :mision,
            empresa_vision = :vision,
            empresa_valores = :valores,
            empresa_whatsapp = :whatsapp,
            empresa_instagram = :instagram,
            empresa_facebook = :facebook
            WHERE empresa_id = 1;";

    $stmt = $con->prepare($sql);
    $stmt->bindParam(':nombre', $_POST['nombre']);
    $stmt->bindParam(':mision', $_POST['mision']);
    $stmt->bindParam(':vision', $_POST['vision']);
    $stmt->bindParam(':valores', $_POST['valores']);
    $stmt->bindParam(':whatsapp', $_POST['whatsapp']);
    $stmt->bindParam(':instagram', $_POST['instagram']);
    $stmt->bindParam(':facebook', $_POST['facebook']);
    $stmt->execute();
    echo json_encode(['status' => 'Bien']);
?>
