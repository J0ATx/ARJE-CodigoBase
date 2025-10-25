<?php
include_once '../../../../Control/Conexion/clienteNoRegistrado.php';

function getProductImagePath($productId)
{
    $imageDir = '../../../../Recursos/productos/';
    $imagePath = null;

    $files = glob($imageDir . $productId . '.*');
    if (!empty($files)) {
        $imagePath = str_replace('', '', $files[0]);
    }

    return $imagePath;
}

try {
    if (isset($_GET['id'])) {
        $sql = "SELECT p.producto_id,
                       p.producto_nombre,
                       p.producto_precio,
                       p.producto_receta,
                       p.producto_tiempo_preparacion,
                       p.producto_creacion,
                       p.producto_categoria,
                       p.producto_calificacion,
                       COUNT(c.comentario_id) as total_comentarios
                FROM Producto p
                LEFT JOIN Comentario c ON p.producto_id = c.producto_id
                WHERE p.producto_id = ?
                GROUP BY p.producto_id, p.producto_nombre, p.producto_precio, p.producto_receta, p.producto_tiempo_preparacion, p.producto_creacion, p.producto_categoria, p.producto_calificacion";
        $sentencia = $con->prepare($sql);
        $sentencia->execute([$_GET['id']]);
        $producto = $sentencia->fetch(PDO::FETCH_ASSOC);
        if ($producto) {
            $producto['imagen_url'] = getProductImagePath($producto['producto_id']);
            echo json_encode($producto);
        } else {
            echo json_encode(['error' => 'Producto no encontrado.']);
        }
    } else {
        $sql = "SELECT p.producto_id,
                       p.producto_nombre,
                       p.producto_precio,
                       p.producto_receta,
                       p.producto_tiempo_preparacion,
                       p.producto_creacion,
                       p.producto_categoria,
                       p.producto_calificacion,
                       COUNT(c.comentario_id) as total_comentarios
                FROM Producto p
                LEFT JOIN Comentario c ON p.producto_id = c.producto_id
                GROUP BY p.producto_id, p.producto_nombre, p.producto_precio, p.producto_receta, p.producto_tiempo_preparacion, p.producto_creacion, p.producto_categoria, p.producto_calificacion";
        $sentencia = $con->prepare($sql);
        $sentencia->execute();
        $productos = $sentencia->fetchAll(PDO::FETCH_ASSOC);

        foreach ($productos as &$producto) {
            $producto['imagen_url'] = getProductImagePath($producto['producto_id']);
        }

        echo json_encode($productos);
    }
} catch (\Throwable $th) {
    echo json_encode(["error" => "Error al obtener los datos: " . $th->getMessage()]);
    exit();
}
