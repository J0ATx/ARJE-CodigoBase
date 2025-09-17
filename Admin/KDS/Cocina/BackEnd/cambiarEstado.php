<?php
/**
 * cambiarEstado.php
 * 
 * Maneja el cambio de estado de los pedidos en la cocina.
 * Verifica el stock de ingredientes al cambiar a 'en_preparacion'.
 * 
 * Estados permitidos:
 * - pendiente → en_preparacion (con verificación de stock)
 * - en_preparacion → listo
 * - listo → (sin más cambios permitidos desde cocina)
 */

// Configuración de encabezados para respuesta JSON
header('Content-Type: application/json');

// Incluir archivo de conexión a la base de datos
require_once '../../../../Control/Conexión/conexion.php';

/**
 * Función para enviar una respuesta JSON y terminar la ejecución
 */
function enviarRespuesta($exito, $mensaje, $datos = []) {
    $respuesta = [
        'success' => $exito,
        'message' => $mensaje
    ];
    
    if (!empty($datos)) {
        $respuesta['data'] = $datos;
    }
    
    echo json_encode($respuesta, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    exit;
}

// Verificar que la petición sea POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    enviarRespuesta(false, 'Método no permitido. Se requiere POST.');
}

// Obtener y validar parámetros
$idPedido = filter_input(INPUT_POST, 'idPedido', FILTER_VALIDATE_INT);
$nuevoEstado = $_POST['nuevoEstado'] ?? '';

// Validar el estado proporcionado
$estadosPermitidos = ['pendiente', 'en_preparacion', 'listo'];
$nuevoEstado = in_array($nuevoEstado, $estadosPermitidos) ? $nuevoEstado : '';

if (!$idPedido || !$nuevoEstado) {
    enviarRespuesta(false, 'Datos incompletos o no válidos. Se requiere idPedido y nuevoEstado válido.');
}
if (!in_array($nuevoEstado, $estadosPermitidos)) {
    enviarRespuesta(false, 'Estado no válido.');
}

try {
    // Iniciar transacción
    $con->beginTransaction();
    
    // 1. Obtener el estado actual del pedido
    $stmt = $con->prepare("SELECT estado FROM Pedido WHERE idPedido = ?");
    $stmt->execute([$idPedido]);
    $pedido = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$pedido) {
        throw new Exception('Pedido no encontrado');
    }
    
    $estadoActual = $pedido['estado'];
    
    // 2. Validar transición de estado
    $transicionesValidas = [
        'pendiente' => ['en_preparacion'],
        'en_preparacion' => ['listo'],
        'listo' => []
    ];
    
    if (!in_array($nuevoEstado, $transicionesValidas[$estadoActual] ?? [])) {
        throw new Exception('Transición de estado no permitida');
    }
    
    // 3. Si el nuevo estado es 'en_preparacion', verificar stock
    if ($nuevoEstado === 'en_preparacion') {
        $productosSinStock = [];
        
        // Obtener productos del pedido (usando 1 como cantidad predeterminada ya que la columna no existe)
        $sqlProductos = "SELECT t.idProducto, 1 as cantidad, p.nombre 
                        FROM Tiene t
                        JOIN Productos p ON t.idProducto = p.idProducto
                        WHERE t.idPedido = ?";
        $stmtProductos = $con->prepare($sqlProductos);
        $stmtProductos->execute([$idPedido]);
        $productos = $stmtProductos->fetchAll(PDO::FETCH_ASSOC);
        
        // Verificar stock para cada producto
        foreach ($productos as $producto) {
            $sqlIngredientes = "SELECT i.idIngrediente, i.nombre, i.stock, inc.cantidad as cantidad_necesaria
                              FROM Incluye inc
                              JOIN Ingredientes i ON inc.idIngrediente = i.idIngrediente
                              WHERE inc.idProducto = ?";
            $stmtIngredientes = $con->prepare($sqlIngredientes);
            $stmtIngredientes->execute([$producto['idProducto']]);
            $ingredientes = $stmtIngredientes->fetchAll(PDO::FETCH_ASSOC);
            
            foreach ($ingredientes as $ingrediente) {
                $stockNecesario = $ingrediente['cantidad_necesaria'] * $producto['cantidad'];
                
                if ($ingrediente['stock'] < $stockNecesario) {
                    $productosSinStock[] = [
                        'producto' => $producto['nombre'],
                        'ingrediente' => $ingrediente['nombre'],
                        'stock_disponible' => $ingrediente['stock'],
                        'cantidad_requerida' => $stockNecesario
                    ];
                }
            }
        }
        
        // Si no hay suficiente stock, cancelar la operación
        if (!empty($productosSinStock)) {
            throw new Exception('No hay suficiente stock para completar el pedido', 0, null, [
                'productos_sin_stock' => $productosSinStock
            ]);
        }
        
        // Descontar ingredientes del inventario
        foreach ($productos as $producto) {
            $sqlIngredientes = "SELECT i.idIngrediente, inc.cantidad as cantidad_necesaria
                              FROM Incluye inc
                              JOIN Ingredientes i ON inc.idIngrediente = i.idIngrediente
                              WHERE inc.idProducto = ?";
            $stmtIngredientes = $con->prepare($sqlIngredientes);
            $stmtIngredientes->execute([$producto['idProducto']]);
            $ingredientes = $stmtIngredientes->fetchAll(PDO::FETCH_ASSOC);
            
            foreach ($ingredientes as $ingrediente) {
                $cantidadARestar = $ingrediente['cantidad_necesaria'] * $producto['cantidad'];
                
                $sqlActualizarStock = "UPDATE Ingredientes 
                                     SET stock = GREATEST(0, stock - ?) 
                                     WHERE idIngrediente = ?";
                $stmtActualizar = $con->prepare($sqlActualizarStock);
                $stmtActualizar->execute([$cantidadARestar, $ingrediente['idIngrediente']]);
            }
        }
    }
    
    // 4. Actualizar el estado del pedido
    $sqlActualizarPedido = "UPDATE Pedido 
                           SET estado = ?, 
                               horaFinalizacion = CASE WHEN ? = 'listo' THEN NOW() ELSE horaFinalizacion END
                           WHERE idPedido = ?";
    
    $stmtActualizar = $con->prepare($sqlActualizarPedido);
    $stmtActualizar->execute([$nuevoEstado, $nuevoEstado, $idPedido]);
    
    // Confirmar la transacción
    $con->commit();
    
    enviarRespuesta(true, 'Estado actualizado correctamente', [
        'idPedido' => $idPedido,
        'estado_anterior' => $estadoActual,
        'nuevo_estado' => $nuevoEstado
    ]);
    
} catch (PDOException $e) {
    // Revertir la transacción en caso de error
    if (isset($con) && $con->inTransaction()) {
        $con->rollBack();
    }
    
    enviarRespuesta(false, 'Error en la base de datos: ' . $e->getMessage());
    
} catch (Exception $e) {
    // Revertir la transacción en caso de error
    if (isset($con) && $con->inTransaction()) {
        $con->rollBack();
    }
    
    enviarRespuesta(false, $e->getMessage());
}