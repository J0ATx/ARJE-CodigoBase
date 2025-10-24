<?php
include_once '../../../../Control/Conexion/clienteNoRegistrado.php';

// Función para obtener la ruta de la imagen del producto
function getProductImagePath($productId)
{
    $imageDir = '../../../../Recursos/productos/';
    $imagePath = null;

    // Buscar archivos con el formato {id_producto}.*
    $files = glob($imageDir . $productId . '.*');
    if (!empty($files)) {
        // Tomar el primer archivo que coincida (debería haber solo uno)
        $imagePath = str_replace('', '', $files[0]);
    }

    return $imagePath;
}

try {
    if (isset($_GET['id'])) {
        $sql = "SELECT * FROM Producto WHERE producto_id = ?";
        $sentencia = $con->prepare($sql);
        $sentencia->execute([$_GET['id']]);
        $producto = $sentencia->fetch(PDO::FETCH_ASSOC);
        if ($producto) {
            // Agregar ruta de imagen al producto
            $producto['imagen_url'] = getProductImagePath($producto['producto_id']);
            echo json_encode($producto);
        } else {
            echo json_encode(['error' => 'Producto no encontrado.']);
        }
    } else {
        $sql = "SELECT * FROM Producto";
        $sentencia = $con->prepare($sql);
        $sentencia->execute();
        $productos = $sentencia->fetchAll(PDO::FETCH_ASSOC);

        // Agregar ruta de imagen a cada producto
        foreach ($productos as &$producto) {
            $producto['imagen_url'] = getProductImagePath($producto['producto_id']);
        }

        echo json_encode($productos);
    }
} catch (\Throwable $th) {
    echo json_encode(["error" => "Error al obtener los datos: " . $th->getMessage()]);
    exit();
}
