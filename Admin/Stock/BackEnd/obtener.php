<?php
require_once '../../../Control/Conexión/conexion.php';

$response = array();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $stmt = $con->prepare("SELECT * FROM Ingredientes WHERE idIngrediente = ?");
        $stmt->execute([$_POST['id']]);
        
        $ingrediente = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($ingrediente) {
            $response['success'] = true;
            $response['ingrediente'] = $ingrediente;
        } else {
            $response['success'] = false;
            $response['message'] = 'Ingrediente no encontrado';
        }
    } catch (PDOException $e) {
        $response['success'] = false;
        $response['message'] = 'Error al obtener el ingrediente: ' . $e->getMessage();
    }
} else {
    $response['success'] = false;
    $response['message'] = 'Método no permitido';
}

header('Content-Type: application/json');
echo json_encode($response);
