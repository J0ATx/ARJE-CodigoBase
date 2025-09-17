<?php
require_once '../../../Control/Conexión/conexion.php';

$response = array();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $stmt = $con->prepare("UPDATE Ingredientes SET nombre = ?, caducidad = ?, stock = ?, medida = ? WHERE idIngrediente = ?");
        $stmt->execute([
            $_POST['nombre'],
            $_POST['caducidad'],
            $_POST['stock'],
            $_POST['medida'],
            $_POST['id']
        ]);
        
        if ($stmt->rowCount() > 0) {
            $response['success'] = true;
            $response['message'] = 'Ingrediente actualizado con éxito';
        } else {
            $response['success'] = false;
            $response['message'] = 'No se encontró el ingrediente o no hubo cambios';
        }
    } catch (PDOException $e) {
        $response['success'] = false;
        $response['message'] = 'Error al actualizar el ingrediente: ' . $e->getMessage();
    }
} else {
    $response['success'] = false;
    $response['message'] = 'Método no permitido';
}

header('Content-Type: application/json');
echo json_encode($response);
