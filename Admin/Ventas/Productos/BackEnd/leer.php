<?php
require_once '../../../../Control/Conexión/conexion.php';

$response = array();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $search = isset($_POST['search']) ? $_POST['search'] : '';
        
        $query = "
            SELECT p.*, 
                   GROUP_CONCAT(DISTINCT CONCAT(i.nombre, ':', i.medida, ':', inc.cantidad) SEPARATOR '|') as ingredientes
            FROM Productos p
            LEFT JOIN Incluye inc ON p.idProducto = inc.idProducto
            LEFT JOIN Ingredientes i ON inc.idIngrediente = i.idIngrediente
        ";

        if (!empty($search)) {
            $query .= " WHERE p.nombre LIKE ?";
            $params = ['%' . $search . '%'];
        }

        $query .= " GROUP BY p.idProducto ORDER BY p.nombre";
        
        $stmt = !empty($search) ? $con->prepare($query) : $con->query($query);
        
        if (!empty($search)) {
            $stmt->execute($params);
        }

        $productos = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $producto = array(
                'idProducto' => $row['idProducto'],
                'nombre' => $row['nombre'],
                'precio' => $row['precio'],
                'calificacionPromedio' => $row['calificacionPromedio'],
                'ingredientes' => []
            );

            if ($row['ingredientes']) {
                $ingredientesArr = explode('|', $row['ingredientes']);
                foreach ($ingredientesArr as $ing) {
                    list($nombre, $medida, $cantidad) = explode(':', $ing);
                    $producto['ingredientes'][] = array(
                        'nombre' => $nombre,
                        'medida' => $medida,
                        'cantidad' => $cantidad
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
