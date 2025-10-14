<?php
require_once '../../../../Control/Conexión/conexion.php';
session_start();

$response = array();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $ingredientes = json_decode($_POST['ingredientes'], true);
        if (empty($ingredientes)) {
            throw new Exception('El producto debe tener al menos un ingrediente');
        }

        $con->beginTransaction();
        // Datos principales del producto según la nueva BD
        $nombre = $_POST['nombre'];
        $precio = $_POST['precio'];
        $categoria = isset($_POST['categoria']) ? $_POST['categoria'] : null;
        $receta = isset($_POST['receta']) ? $_POST['receta'] : null; // texto multilinea
        $tiempoPrep = isset($_POST['tiempo_preparacion']) ? $_POST['tiempo_preparacion'] : null; // texto libre
        $personalId = isset($_SESSION['usuario_id']) ? $_SESSION['usuario_id'] : null;
        if (!$personalId) {
            throw new Exception('Sesión inválida: usuario_id no establecido');
        }

        $stmt = $con->prepare("INSERT INTO Producto (
            producto_nombre, producto_precio, producto_receta, producto_tiempo_preparacion, producto_creacion, producto_categoria, producto_calificacion, personal_id
        ) VALUES (?, ?, ?, ?, CURDATE(), ?, NULL, ?)");
        $stmt->execute([$nombre, $precio, $receta, $tiempoPrep, $categoria, $personalId]);
        
        $idProducto = (int)$con->lastInsertId();
        
        // ingredientes -> Consume con Stock
        foreach ($ingredientes as $ing) {
            // se espera: { stock_id, cantidad, medida }
            if (!isset($ing['stock_id'], $ing['cantidad'])) {
                throw new Exception('Formato de ingrediente inválido');
            }
            $stockId = (int)$ing['stock_id'];
            $cantidad = (float)$ing['cantidad'];
            $medida = isset($ing['medida']) ? $ing['medida'] : null;
            
            // Obtener medida del stock y validar
            $q = $con->prepare('
                SELECT sc.stock_medida, s.stock_nombre 
                FROM Stock_Cantidad sc
                JOIN Stock s ON s.stock_id = sc.stock_id
                WHERE sc.stock_id = ?
                LIMIT 1
            ');
            $q->execute([$stockId]);
            $stockRow = $q->fetch(PDO::FETCH_ASSOC);
            
            if (!$stockRow) {
                throw new Exception('El ingrediente con ID ' . $stockId . ' no existe en el inventario');
            }
            
            $stockMedida = $stockRow['stock_medida'];
            $stockNombre = $stockRow['stock_nombre'];
            
            // Si no se especificó medida, usar la del stock
            if ($medida === null) {
                $medida = $stockMedida;
            }
            
            // Validar que la medida coincida con la del stock
            if ($medida !== $stockMedida) {
                throw new Exception(
                    "La medida especificada ({$medida}) para el ingrediente '{$stockNombre}' " .
                    "no coincide con la medida del stock ({$stockMedida}). " .
                    "Deben ser iguales."
                );
            }
            
            $stmt = $con->prepare("INSERT INTO Consume (producto_id, stock_id, consume_cantidad, consume_medida) VALUES (?, ?, ?, ?)");
            $stmt->execute([$idProducto, $stockId, $cantidad, $medida]);
        }

        $con->commit();
        $response['success'] = true;
        $response['message'] = 'Producto creado con éxito';
    } catch (PDOException $e) {
        $con->rollBack();
        $response['success'] = false;
        $response['message'] = 'Error al crear el producto: ' . $e->getMessage();
    } catch (Exception $e) {
        if ($con->inTransaction()) $con->rollBack();
        $response['success'] = false;
        $response['message'] = $e->getMessage();
    }
} else {
    $response['success'] = false;
    $response['message'] = 'Método no permitido';
}

header('Content-Type: application/json');
echo json_encode($response);
