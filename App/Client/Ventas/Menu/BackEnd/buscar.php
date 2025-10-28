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
            LEFT JOIN Comentario c ON p.producto_id = c.producto_id";

    $conditions = [];
    $params = [];

    if (isset($_GET['categoria']) && !empty($_GET['categoria'])) {
        $conditions[] = "p.producto_categoria = ?";
        $params[] = $_GET['categoria'];
    }

    if (isset($_GET['precio_max']) && !empty($_GET['precio_max'])) {
        $conditions[] = "p.producto_precio <= ?";
        $params[] = $_GET['precio_max'];
    }

    if (isset($_GET['calificacion_min']) && !empty($_GET['calificacion_min'])) {
        $conditions[] = "p.producto_calificacion >= ?";
        $params[] = $_GET['calificacion_min'];
    }

    if (isset($_GET['busqueda']) && !empty($_GET['busqueda'])) {
        $busqueda = '%' . $_GET['busqueda'] . '%';
        $conditions[] = "(p.producto_nombre LIKE ? OR p.producto_categoria LIKE ? OR p.producto_receta LIKE ?)";
        $params[] = $busqueda;
        $params[] = $busqueda;
        $params[] = $busqueda;
    }

    if (!empty($conditions)) {
        $sql .= " WHERE " . implode(" AND ", $conditions);
    }

    $sql .= " GROUP BY p.producto_id, p.producto_nombre, p.producto_precio, p.producto_receta, p.producto_tiempo_preparacion, p.producto_creacion, p.producto_categoria, p.producto_calificacion";

    $orden = $_GET['orden'] ?? 'nombre';
    switch ($orden) {
        case 'precio-asc':
            $sql .= " ORDER BY p.producto_precio ASC";
            break;
        case 'precio-desc':
            $sql .= " ORDER BY p.producto_precio DESC";
            break;
        case 'calificacion':
            $sql .= " ORDER BY p.producto_calificacion DESC";
            break;
        case 'categoria':
            $sql .= " ORDER BY p.producto_categoria, p.producto_nombre";
            break;
        case 'nombre':
        default:
            $sql .= " ORDER BY p.producto_nombre";
            break;
    }

    $sentencia = $con->prepare($sql);
    $sentencia->execute($params);
    $productos = $sentencia->fetchAll(PDO::FETCH_ASSOC);

    foreach ($productos as &$producto) {
        $producto['imagen_url'] = getProductImagePath($producto['producto_id']);
    }

    echo json_encode($productos);

} catch (\Throwable $th) {
    echo json_encode(["error" => "Error al obtener los datos: " . $th->getMessage()]);
    exit();
}
?>
