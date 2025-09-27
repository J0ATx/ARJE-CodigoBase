<?php
require_once '../../../../Control/Conexión/conexion.php';

$response = array();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $con->beginTransaction();

        $id = (int)$_POST['id'];
        $nombre = $_POST['nombre'];
        $precio = $_POST['precio'];
        $categoria = isset($_POST['categoria']) ? $_POST['categoria'] : null;
        $receta = isset($_POST['receta']) ? $_POST['receta'] : null;
        $tiempoPrep = isset($_POST['tiempo_preparacion']) ? $_POST['tiempo_preparacion'] : null;

        $stmt = $con->prepare("UPDATE Producto 
            SET producto_nombre = ?, producto_precio = ?, producto_categoria = ?, producto_receta = ?, producto_tiempo_preparacion = ? 
            WHERE producto_id = ?");
        $stmt->execute([$nombre, $precio, $categoria, $receta, $tiempoPrep, $id]);

        // Reemplazar ingredientes en Consume
        $stmt = $con->prepare("DELETE FROM Consume WHERE producto_id = ?");
        $stmt->execute([$id]);
        
        $ingredientes = json_decode($_POST['ingredientes'], true);
        if (!empty($ingredientes)) {
            foreach ($ingredientes as $ing) {
                if (!isset($ing['stock_id'], $ing['cantidad'])) {
                    throw new Exception('Formato de ingrediente inválido');
                }
                $stockId = (int)$ing['stock_id'];
                $cantidad = (float)$ing['cantidad'];
                $medida = isset($ing['medida']) ? $ing['medida'] : null;
                if ($medida === null) {
                    $q = $con->prepare('SELECT stock_medida FROM Stock WHERE stock_id = ?');
                    $q->execute([$stockId]);
                    $row = $q->fetch(PDO::FETCH_ASSOC);
                    $medida = $row ? $row['stock_medida'] : null;
                }
                $stmt = $con->prepare("INSERT INTO Consume (producto_id, stock_id, consume_cantidad, consume_medida) VALUES (?, ?, ?, ?)");
                $stmt->execute([$id, $stockId, $cantidad, $medida]);
            }
        }

        $con->commit();
        $response['success'] = true;
        $response['message'] = 'Producto actualizado con éxito';
    } catch (PDOException $e) {
        $con->rollBack();
        $response['success'] = false;
        $response['message'] = 'Error al actualizar el producto: ' . $e->getMessage();
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
