<?php
require_once '../../../Control/Conexión/conexion.php';

$response = array();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $stmt = $con->prepare("INSERT INTO Ingredientes (nombre, caducidad, stock, medida) VALUES (?, ?, ?, ?)");
        $stmt->execute([
            $_POST['nombre'],
            $_POST['caducidad'],
            $_POST['stock'],
            $_POST['medida']
        ]);
        
        $response['success'] = true;
        $response['message'] = 'Ingrediente creado con éxito';
    } catch (PDOException $e) {
        $response['success'] = false;
        $response['message'] = 'Error al crear el ingrediente: ' . $e->getMessage();
    }
} else {
    $response['success'] = false;
    $response['message'] = 'Método no permitido';
}

header('Content-Type: application/json');
echo json_encode($response);
