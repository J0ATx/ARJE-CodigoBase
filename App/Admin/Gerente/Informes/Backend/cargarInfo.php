<?php
    $sql = "";

    require_once '../../../../Control/Conexion/conexion.php';

    $sql = "SELECT * FROM Ventas_Totales;";
    $stmt = $con->prepare($sql);
    $stmt->execute();
    $ventasTotales = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $sql = "SELECT * FROM Ventas_Por_Cliente;";
    $stmt = $con->prepare($sql);
    $stmt->execute();
    $ventasPorCliente = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $sql = "SELECT * FROM Ventas_Por_Camarero;";
    $stmt = $con->prepare($sql);
    $stmt->execute();
    $ventasPorCamarero = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $sql = "SELECT * FROM Ventas_Por_Producto;";
    $stmt = $con->prepare($sql);
    $stmt->execute();
    $ventasPorProducto = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $sql = "SELECT * FROM Ventas_Por_Pago;";
    $stmt = $con->prepare($sql);
    $stmt->execute();
    $ventasPorPago = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $sql = "SELECT * FROM Ventas_Por_Fecha;";
    $stmt = $con->prepare($sql);
    $stmt->execute();
    $ventasPorFecha = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $sql = "SELECT * FROM Tiempo_Promedio;";
    $stmt = $con->prepare($sql);
    $stmt->execute();
    $tiempoPromedio = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $sql = "SELECT * FROM No_Show_Por_Cliente";
    $stmt = $con->prepare($sql);
    $stmt->execute();
    $noShowPorCliente = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $sql = "SELECT * FROM No_Show_Por_fecha";
    $stmt = $con->prepare($sql);
    $stmt->execute();
    $noShowPorFecha = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $response = [
        'ventasTotales' => $ventasTotales,
        'ventasPorCamarero' => $ventasPorCamarero,
        'ventasPorCliente' => $ventasPorCliente,
        'ventasPorFecha' => $ventasPorFecha,
        'ventasPorPago' => $ventasPorPago,
        'ventasPorProducto' => $ventasPorProducto,
        'tiempoPromedio' => $tiempoPromedio,
        'noShowPorCliente' => $noShowPorCliente,
        'noShowPorFecha' => $noShowPorFecha,
    ];

    echo json_encode($response);
?>
