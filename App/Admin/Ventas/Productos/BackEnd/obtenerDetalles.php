<?php
require_once '../../../../Control/Conexión/conexion.php';

$response = array();

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['productId'])) {
    try {
        $productId = $_POST['productId'];
        
        $query = "
            SELECT 
                p.*,
                GROUP_CONCAT(DISTINCT CONCAT(i.nombre, ':', i.medida, ':', inc.cantidad) SEPARATOR '|') as ingredientes,
                GROUP_CONCAT(DISTINCT rp.paso ORDER BY rp.idPaso SEPARATOR '|') as pasos
            FROM Productos p
            LEFT JOIN Incluye inc ON p.idProducto = inc.idProducto
            LEFT JOIN Ingredientes i ON inc.idIngrediente = i.idIngrediente
            LEFT JOIN Recetas r ON p.idProducto = r.idProducto
            LEFT JOIN RecetasPasos rp ON r.idReceta = rp.idReceta
            WHERE p.idProducto = ?
            GROUP BY p.idProducto
        ";
        
        $stmt = $con->prepare($query);
        $stmt->execute([$productId]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($row) {
            $producto = array(
                'idProducto' => $row['idProducto'],
                'nombre' => $row['nombre'],
                'precio' => $row['precio'],
                'calificacionPromedio' => $row['calificacionPromedio'],
                'ingredientes' => [],
                'pasos' => []
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
            
            if ($row['pasos']) {
                $pasosArr = explode('|', $row['pasos']);
                foreach ($pasosArr as $index => $paso) {
                    $producto['pasos'][] = array(
                        'orden' => $index + 1,
                        'descripcion' => $paso
                    );
                }
            }
            
            $response['success'] = true;
            $response['producto'] = $producto;
        } else {
            $response['success'] = false;
            $response['message'] = 'Producto no encontrado';
        }
    } catch (PDOException $e) {
        $response['success'] = false;
        $response['message'] = 'Error en la base de datos: ' . $e->getMessage();
    }
} else {
    $response['success'] = false;
    $response['message'] = 'Solicitud inválida';
}

header('Content-Type: application/json');
echo json_encode($response);
