<?php
    include_once '../../../../Control/Conexion/clienteNoRegistrado.php';

    try {
        if (isset($_GET['id'])) {
            $sql = "SELECT * FROM Producto WHERE producto_id = ?";
            $sentencia = $con->prepare($sql);
            $sentencia->execute([$_GET['id']]);
            $producto = $sentencia->fetch(PDO::FETCH_ASSOC);
            if ($producto) {
                echo json_encode($producto);
            } else {
                echo json_encode(['error' => 'Producto no encontrado.']);
            }
        } else {
            $sql = "SELECT * FROM Producto";
            $sentencia = $con->prepare($sql);
            $sentencia->execute();
            $productos = $sentencia->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($productos);
        }
    } catch (\Throwable $th) {
        echo json_encode(["error" => "Error al obtener los datos: " . $th->getMessage()]);
        exit();
    }
?>
