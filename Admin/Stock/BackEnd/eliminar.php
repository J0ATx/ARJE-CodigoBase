<?php
require_once '../../../Control/Conexión/conexion.php';

$response = array();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Verificar si el ingrediente está siendo usado
        $stmt = $con->prepare("SELECT COUNT(*) FROM Incluye WHERE idIngrediente = ?");
        $stmt->execute([$_POST['id']]);
        
        if ($stmt->fetchColumn() > 0) {
            $response['success'] = false;
            $response['message'] = 'No se puede eliminar el ingrediente porque está siendo usado en uno o más productos';
        } else {
            $stmt = $con->prepare("DELETE FROM Ingredientes WHERE idIngrediente = ?");
            $stmt->execute([$_POST['id']]);
            
            if ($stmt->rowCount() > 0) {
                $response['success'] = true;
                $response['message'] = 'Ingrediente eliminado con éxito';
            } else {
                $response['success'] = false;
                $response['message'] = 'No se encontró el ingrediente';
            }
        }
    } catch (PDOException $e) {
        $response['success'] = false;
        $response['message'] = 'Error al eliminar el ingrediente: ' . $e->getMessage();
    }
} else {
    $response['success'] = false;
    $response['message'] = 'Método no permitido';
}

header('Content-Type: application/json');
echo json_encode($response);
