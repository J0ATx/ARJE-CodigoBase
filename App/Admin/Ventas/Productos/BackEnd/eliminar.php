<?php
require_once '../../../../Control/Conexión/conexion.php';

$response = array();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $con->beginTransaction();

        $id = (int)$_POST['id'];

        // Eliminar consumos (ingredientes)
        $stmt = $con->prepare("DELETE FROM Consume WHERE producto_id = ?");
        $stmt->execute([$id]);

        // Eliminar referencias en Contiene / Posee si existieran
        $stmt = $con->prepare("DELETE FROM Contiene WHERE producto_id = ?");
        $stmt->execute([$id]);
        $stmt = $con->prepare("DELETE FROM Posee WHERE producto_id = ?");
        $stmt->execute([$id]);

        // Eliminar producto
        $stmt = $con->prepare("DELETE FROM Producto WHERE producto_id = ?");
        $stmt->execute([$id]);
        
        if ($stmt->rowCount() > 0) {
            $con->commit();
            $response['success'] = true;
            $response['message'] = 'Producto eliminado con éxito';
        } else {
            $con->rollBack();
            $response['success'] = false;
            $response['message'] = 'No se encontró el producto';
        }
    } catch (PDOException $e) {
        $con->rollBack();
        $response['success'] = false;
        $response['message'] = 'Error al eliminar el producto: ' . $e->getMessage();
    }
} else {
    $response['success'] = false;
    $response['message'] = 'Método no permitido';
}

header('Content-Type: application/json');
echo json_encode($response);
