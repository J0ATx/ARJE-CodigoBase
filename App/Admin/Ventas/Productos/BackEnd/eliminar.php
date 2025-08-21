<?php
require_once '../../../../Control/Conexión/conexion.php';

$response = array();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $con->beginTransaction();
        
        $stmt = $con->prepare("
            SELECT idReceta 
            FROM Recetas 
            WHERE idProducto = ?
        ");
        $stmt->execute([$_POST['id']]);
        $receta = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($receta) {
            $stmt = $con->prepare("DELETE FROM RecetasPasos WHERE idReceta = ?");
            $stmt->execute([$receta['idReceta']]);

            $stmt = $con->prepare("DELETE FROM Recetas WHERE idReceta = ?");
            $stmt->execute([$receta['idReceta']]);
        }

        $stmt = $con->prepare("DELETE FROM Incluye WHERE idProducto = ?");
        $stmt->execute([$_POST['id']]);

        $stmt = $con->prepare("DELETE FROM Productos WHERE idProducto = ?");
        $stmt->execute([$_POST['id']]);
        
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
