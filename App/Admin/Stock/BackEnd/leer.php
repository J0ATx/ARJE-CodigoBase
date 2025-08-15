<?php
require_once '../../../Control/Conexión/conexion.php';

$response = array();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $search = isset($_POST['search']) ? $_POST['search'] : '';
        
        if (empty($search)) {
            $stmt = $con->query("SELECT * FROM Ingredientes ORDER BY nombre");
        } else {
            $stmt = $con->prepare("SELECT * FROM Ingredientes WHERE nombre LIKE ? ORDER BY nombre");
            $stmt->execute(['%' . $search . '%']);
        }
        
        $response['success'] = true;
        $response['ingredientes'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        $response['success'] = false;
        $response['message'] = 'Error al cargar los ingredientes: ' . $e->getMessage();
    }
} else {
    $response['success'] = false;
    $response['message'] = 'Método no permitido';
}

header('Content-Type: application/json');
echo json_encode($response);
