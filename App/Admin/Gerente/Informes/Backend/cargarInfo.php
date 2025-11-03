<?php
    require_once '../../../../Control/Conexion/conexion.php';

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {

        try {
            $sql = "SELECT * FROM Ingresos_Totales;";
            $stmt = $con->prepare($sql);
            $stmt->execute();
            $ingresosTotales = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $sql = "SELECT * FROM Cantidad_Clientes;";
            $stmt = $con->prepare($sql);
            $stmt->execute();
            $cantidadClientes = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $sql = "SELECT * FROM Cantidad_Personal;";
            $stmt = $con->prepare($sql);
            $stmt->execute();
            $cantidadPersonal = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $sql = "SELECT * FROM Ingresos_Por_Cliente;";
            $stmt = $con->prepare($sql);
            $stmt->execute();
            $ingresosPorCliente = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            $sql = "SELECT * FROM Ingresos_Por_Camarero;";
            $stmt = $con->prepare($sql);
            $stmt->execute();
            $ingresosPorCamarero = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $sql = "SELECT * FROM Ingresos_Por_Producto;";
            $stmt = $con->prepare($sql);
            $stmt->execute();
            $ingresosPorProducto = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $sql = "SELECT * FROM Ingresos_Por_Pago;";
            $stmt = $con->prepare($sql);
            $stmt->execute();
            $ingresosPorPago = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $sql = "SELECT * FROM Ingresos_Por_Fecha;";
            $stmt = $con->prepare($sql);
            $stmt->execute();
            $ingresosPorFecha = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $sql = "SELECT * FROM No_Show_Por_Cliente";
            $stmt = $con->prepare($sql);
            $stmt->execute();
            $noShowPorCliente = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $sql = "SELECT * FROM No_Show_Por_fecha";
            $stmt = $con->prepare($sql);
            $stmt->execute();
            $noShowPorFecha = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $sql = "SELECT * FROM Ventas_Por_Producto";
            $stmt = $con->prepare($sql);
            $stmt->execute();
            $ventasPorProducto = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $sql = "SELECT * FROM Calificacion_Promedio";
            $stmt = $con->prepare($sql);
            $stmt->execute();
            $calificacionPromedio = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $response = [
                'ingresosTotales' => $ingresosTotales,
                'cantidadClientes' => $cantidadClientes,
                'cantidadPersonal' => $cantidadPersonal,
                'ingresosPorCamarero' => $ingresosPorCamarero,
                'ingresosPorCliente' => $ingresosPorCliente,
                'ingresosPorFecha' => $ingresosPorFecha,
                'ingresosPorPago' => $ingresosPorPago,
                'ingresosPorProducto' => $ingresosPorProducto,
                'noShowPorCliente' => $noShowPorCliente,
                'noShowPorFecha' => $noShowPorFecha,
                'ventasPorProducto' => $ventasPorProducto,
                'calificacionPromedio' => $calificacionPromedio
            ];

            echo json_encode($response);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => $e->getMessage()]);
        }
    } else {
        echo json_encode(['error' => 'Método de solicitud no permitido.']);
    }
?>