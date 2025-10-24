<?php
    $sql = "";

    require_once '../../../../Control/Conexion/conexion.php';

    $sql = "";
    $stmt = $con->prepare($sql);
    $stmt->execute();
    $ventasTotales = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $sql = "";
    $stmt = $con->prepare($sql);
    $stmt->execute();
    $ubicacion = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $sql = "";
    $stmt = $con->prepare($sql);
    $stmt->execute();
    $horarios = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $sql = "";
    $stmt = $con->prepare($sql);
    $stmt->execute();
    $telefonos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $response = [
    ];

    echo json_encode($response);
?>