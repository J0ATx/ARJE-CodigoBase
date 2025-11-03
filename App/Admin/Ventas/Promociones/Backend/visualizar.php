<?php
    require_once '../../../../Control/Conexion/conexion.php';

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        try {
            $sql = 'SELECT producto_nombre, producto_precio, producto_descripcion, producto_categoria FROM Producto';
            $stmt = $con->prepare($sql);
            $stmt->execute();
            $productosExistentes = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $sql = 'SELECT producto_nombre, promocion_nombre, promocion_descripcion, promocion_descuento, promocion_fidelizada 
                    FROM Promocion 
                    JOIN Posee USING(promocion_id)
                    JOIN Producto USING(producto_id)';
            $stmt = $con->prepare($sql);
            $stmt->execute();
            $promociones = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $response = [
                'productosExistentes' => $productosExistentes,
                'promociones' => $promociones
            ];

            echo json_encode($response);
        } catch (PDOException $e) {
            $response['success'] = false;
            $response['message'] = 'Error al obtener el producto: ' . $e->getMessage();
        }
    } else {
        $response['success'] = false;
        $response['message'] = 'Método no permitido';
    }
?>