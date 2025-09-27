<?php
require_once '../../../../Control/Conexión/conexion.php';

$response = array();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $search = isset($_POST['search']) ? $_POST['search'] : '';
        
        $query = "
            SELECT p.producto_id, p.producto_nombre, p.producto_precio, p.producto_calificacion, p.producto_categoria,
                   GROUP_CONCAT(DISTINCT CONCAT(s.stock_nombre, ':', c.consume_medida, ':', c.consume_cantidad) SEPARATOR '|') AS ingredientes
            FROM Producto p
            LEFT JOIN Consume c ON p.producto_id = c.producto_id
            LEFT JOIN Stock s ON c.stock_id = s.stock_id
        ";

        if (!empty($search)) {
            $query .= " WHERE p.producto_nombre LIKE ? OR p.producto_categoria LIKE ?";
            $params = ['%' . $search . '%', '%' . $search . '%'];
        }

        $query .= " GROUP BY p.producto_id ORDER BY p.producto_nombre";
        
        $stmt = !empty($search) ? $con->prepare($query) : $con->query($query);
        
        if (!empty($search)) {
            $stmt->execute($params);
        }

        $productos = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $producto = array(
                'producto_id' => (int)$row['producto_id'],
                'producto_nombre' => $row['producto_nombre'],
                'producto_precio' => (float)$row['producto_precio'],
                'producto_calificacion' => isset($row['producto_calificacion']) ? (float)$row['producto_calificacion'] : null,
                'producto_categoria' => $row['producto_categoria'],
                'ingredientes' => []
            );

            if ($row['ingredientes']) {
                $ingredientesArr = explode('|', $row['ingredientes']);
                foreach ($ingredientesArr as $ing) {
                    list($nombre, $medida, $cantidad) = explode(':', $ing);
                    $producto['ingredientes'][] = array(
                        'stock_nombre' => $nombre,
                        'consume_medida' => $medida,
                        'consume_cantidad' => $cantidad
                    );
                }
            }

            $productos[] = $producto;
        }
        
        $response['success'] = true;
        $response['productos'] = $productos;
    } catch (PDOException $e) {
        $response['success'] = false;
        $response['message'] = 'Error al cargar los productos: ' . $e->getMessage();
    }
} else {
    $response['success'] = false;
    $response['message'] = 'Método no permitido';
}

header('Content-Type: application/json');
echo json_encode($response);
