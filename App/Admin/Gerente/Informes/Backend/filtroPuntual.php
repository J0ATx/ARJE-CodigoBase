<?php
    require_once '../../../../Control/Conexion/conexion.php';

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {

        try {
            $sql = "SELECT SUM(pedido_monto) AS total_ingresos
                   FROM Pedido
                   WHERE pedido_estado = 'Pagado'";
            $stmt = $con->prepare($sql);
            $stmt->execute();
            $ingresosTotales = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $sql = "SELECT COUNT(DISTINCT cliente_id) as total_clientes
                   FROM Pedido 
                   JOIN Efectua USING(pedido_id)";
            $stmt = $con->prepare($sql);
            $stmt->execute();
            $cantidadClientes = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $sql = "SELECT COUNT(DISTINCT personal_id) as total_personal
                   FROM Pedido ";
            $stmt = $con->prepare($sql);
            $stmt->execute();
            $cantidadPersonal = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $sql = "SELECT cliente_id, cliente_nombre, SUM(pedido_monto) AS total
                   FROM Pedido 
                   JOIN Efectua USING (pedido_id)
                   JOIN Cliente USING (cliente_id)
                   WHERE pedido_estado = 'Pagado' 
                   AND DATE(pedido_fecha) = :puntualFecha
                   GROUP BY cliente_id
                   ORDER BY total DESC";
            $stmt = $con->prepare($sql);
            $stmt->bindParam(':puntualFecha', $_POST['puntual_fecha']);
            $stmt->execute();
            $ingresosPorCliente = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            $sql = "SELECT personal_id, personal_nombre, SUM(pedido_monto) AS total
                   FROM Pedido 
                   JOIN Personal USING (personal_id)
                   WHERE pedido_estado = 'Pagado' 
                   AND DATE(pedido_fecha) = :puntualFecha
                   GROUP BY personal_id
                   ORDER BY total DESC";
            $stmt = $con->prepare($sql);
            $stmt->bindParam(':puntualFecha', $_POST['puntual_fecha']);
            $stmt->execute();
            $ingresosPorCamarero = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $sql = "SELECT producto_id, producto_nombre, SUM(pedido_monto) AS total
                   FROM Pedido 
                   JOIN Contiene USING (pedido_id)
                   JOIN Producto USING (producto_id)
                   WHERE pedido_estado = 'Pagado' 
                   AND DATE(pedido_fecha) = :puntualFecha
                   GROUP BY producto_id
                   ORDER BY total DESC";
            $stmt = $con->prepare($sql);
            $stmt->bindParam(':puntualFecha', $_POST['puntual_fecha']);
            $stmt->execute();
            $ingresosPorProducto = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $sql = "SELECT pedido_pago, SUM(pedido_monto) AS total
                   FROM Pedido
                   WHERE pedido_estado = 'Pagado' 
                   AND DATE(pedido_fecha) = :puntualFecha
                   GROUP BY pedido_pago
                   ORDER BY total DESC";
            $stmt = $con->prepare($sql);
            $stmt->bindParam(':puntualFecha', $_POST['puntual_fecha']);
            $stmt->execute();
            $ingresosPorPago = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $sql = "SELECT DATE(pedido_fecha) AS fecha, SUM(pedido_monto) AS total
                   FROM Pedido
                   WHERE pedido_estado = 'Pagado' 
                   AND DATE(pedido_fecha) = :puntualFecha
                   GROUP BY DATE(pedido_fecha)
                   ORDER BY total DESC";
            $stmt = $con->prepare($sql);
            $stmt->bindParam(':puntualFecha', $_POST['puntual_fecha']);
            $stmt->execute();
            $ingresosPorFecha = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $sql = "SELECT cliente_id, COUNT(*) AS no_shows
                   FROM No_Show
                   WHERE DATE(no_show_fecha) = :puntualFecha
                   GROUP BY cliente_id
                   ORDER BY no_shows DESC";
            $stmt = $con->prepare($sql);
            $stmt->bindParam(':puntualFecha', $_POST['puntual_fecha']);
            $stmt->execute();
            $noShowPorCliente = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $sql = "SELECT no_show_fecha, COUNT(*) AS no_shows
                   FROM No_Show
                   WHERE DATE(no_show_fecha) = :puntualFecha
                   GROUP BY no_show_fecha
                   ORDER BY no_shows DESC";
            $stmt = $con->prepare($sql);
            $stmt->bindParam(':puntualFecha', $_POST['puntual_fecha']);
            $stmt->execute();
            $noShowPorFecha = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $sql = "SELECT producto_id, producto_nombre, COUNT(*) AS total
                    FROM Pedido JOIN Contiene USING (pedido_id)
                    JOIN Producto USING (producto_id)
                    WHERE pedido_estado = 'Pagado' AND pedido_fecha = :puntualFecha
                    GROUP BY producto_id
                    ORDER BY total DESC;";
            $stmt = $con->prepare($sql);
            $stmt->bindParam(':puntualFecha', $_POST['puntual_fecha']);
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