<?php
// crearPedido.php - Crea un nuevo pedido físico con productos y comentarios
header('Content-Type: application/json');
require_once '../../../../Control/Conexión/conexion.php';

$response = ["success" => false];

// Función para verificar el stock de los productos
function verificarStock($con, $productos) {
    $productosSinStock = [];
    $ingredientesAcumulados = [];
    
    // Primero, acumulamos todos los ingredientes necesarios para todos los productos
    foreach ($productos as $producto) {
        $idProducto = $producto['idProducto'];
        $cantidad = $producto['cantidad'] ?? 1; // Si no se especifica cantidad, asumir 1
        
        // Obtener los ingredientes necesarios para el producto
        $sql = "SELECT i.idIngrediente, i.nombre as nombre_ingrediente, 
                       i.stock as stock_disponible, inc.cantidad as cantidad_necesaria,
                       p.nombre as nombre_producto
                FROM Incluye inc
                JOIN Ingredientes i ON inc.idIngrediente = i.idIngrediente
                JOIN Productos p ON inc.idProducto = p.idProducto
                WHERE inc.idProducto = ?";
                
        $stmt = $con->prepare($sql);
        $stmt->execute([$idProducto]);
        $ingredientes = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Acumular cantidades necesarias por ingrediente
        foreach ($ingredientes as $ingrediente) {
            $idIngrediente = $ingrediente['idIngrediente'];
            $cantidadNecesaria = $ingrediente['cantidad_necesaria'] * $cantidad;
            
            if (!isset($ingredientesAcumulados[$idIngrediente])) {
                $ingredientesAcumulados[$idIngrediente] = [
                    'nombre_ingrediente' => $ingrediente['nombre_ingrediente'],
                    'stock_disponible' => $ingrediente['stock_disponible'],
                    'cantidad_total_necesaria' => 0,
                    'productos' => []
                ];
            }
            
            $ingredientesAcumulados[$idIngrediente]['cantidad_total_necesaria'] += $cantidadNecesaria;
            $ingredientesAcumulados[$idIngrediente]['productos'][] = [
                'nombre' => $ingrediente['nombre_producto'],
                'cantidad' => $cantidad,
                'cantidad_por_unidad' => $ingrediente['cantidad_necesaria']
            ];
        }
    }
    
    // Luego, verificamos si hay suficiente stock para cada ingrediente
    foreach ($ingredientesAcumulados as $idIngrediente => $ingrediente) {
        if ($ingrediente['stock_disponible'] < $ingrediente['cantidad_total_necesaria']) {
            $productosRelacionados = [];
            foreach ($ingrediente['productos'] as $producto) {
                $productosRelacionados[] = sprintf(
                    '%s (x%d, %d %s c/u)',
                    $producto['nombre'],
                    $producto['cantidad'],
                    $producto['cantidad_por_unidad'],
                    'unidad' // Asumiendo que la unidad es 'unidad', podrías hacerlo dinámico si es necesario
                );
            }
            
            $productosSinStock[] = [
                'ingrediente' => $ingrediente['nombre_ingrediente'],
                'stock_disponible' => $ingrediente['stock_disponible'],
                'cantidad_requerida' => $ingrediente['cantidad_total_necesaria'],
                'productos' => $productosRelacionados
            ];
        }
    }
    
    return $productosSinStock;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $idMesa = $_POST['idMesa'] ?? null;
    $idMozo = $_POST['idMozo'] ?? null;
    $especificacion = $_POST['especificacion'] ?? '';
    $productos = json_decode($_POST['productos'] ?? '[]', true);
    
    if (!$idMesa || !$idMozo || empty($productos)) {
        $response['message'] = 'Datos incompletos';
        echo json_encode($response); 
        exit;
    }
    
    try {
        $con->beginTransaction();
        
        // Verificar stock antes de crear el pedido
        $productosSinStock = verificarStock($con, $productos);
        
        if (!empty($productosSinStock)) {
            $con->rollBack();
            $response['success'] = false;
            $response['message'] = 'No hay suficiente stock para completar el pedido';
            $response['productos_sin_stock'] = $productosSinStock;
            echo json_encode($response);
            exit;
        }
        
        // Crear pedido
        $con->prepare('INSERT INTO Pedido (estado) VALUES ("pendiente")')->execute();
        $idPedido = $con->lastInsertId();
        
        // Relacionar con mesa y mozo
        $con->prepare('INSERT INTO PedidoFisico (idPedido, idMesa, idUsuario) VALUES (?, ?, ?)')
           ->execute([$idPedido, $idMesa, $idMozo]);
        
        // Insertar productos (una entrada por cada unidad del producto)
        foreach ($productos as $prod) {
            $cantidad = $prod['cantidad'] ?? 1;
            // Insertar una entrada por cada unidad del producto
            for ($i = 0; $i < $cantidad; $i++) {
                $con->prepare('INSERT INTO Tiene (idPedido, idProducto) VALUES (?, ?)')
                   ->execute([$idPedido, $prod['idProducto']]);
            }
        }
        
        // Insertar especificación del pedido si existe
        if (!empty(trim($especificacion))) {
            // Insertar especificación si no existe
            $stmt = $con->prepare('SELECT idEspecificacion FROM Especificaciones WHERE especificacion = ?');
            $stmt->execute([$especificacion]);
            $idEsp = $stmt->fetchColumn();
            
            if (!$idEsp) {
                $con->prepare('INSERT INTO Especificaciones (especificacion) VALUES (?)')
                   ->execute([$especificacion]);
                $idEsp = $con->lastInsertId();
            }
            
            // Relacionar especificación con el pedido
            $con->prepare('INSERT INTO EspecificacionesPedido (idEspecificacion, idPedido) VALUES (?, ?)')
               ->execute([$idEsp, $idPedido]);
        }
        
        $con->commit();
        $response['success'] = true;
        $response['idPedido'] = $idPedido;
    } catch (Exception $e) {
        $con->rollBack();
        $response['message'] = 'Error al crear pedido: ' . $e->getMessage();
    }
}

echo json_encode($response);
