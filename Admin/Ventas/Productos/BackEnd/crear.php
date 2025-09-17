<?php
require_once '../../../../Control/Conexión/conexion.php';

$response = array();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $ingredientes = json_decode($_POST['ingredientes'], true);
        $pasos = json_decode($_POST['pasos'], true);

        if (empty($ingredientes)) {
            throw new Exception('El producto debe tener al menos un ingrediente');
        }

        if (empty($pasos)) {
            throw new Exception('El producto debe tener una receta con al menos un paso');
        }

        $con->beginTransaction();

        $stmt = $con->prepare("INSERT INTO Productos (nombre, precio) VALUES (?, ?)");
        $stmt->execute([
            $_POST['nombre'],
            $_POST['precio']
        ]);
        
        $idProducto = $con->lastInsertId();
        
        $ingredientes = json_decode($_POST['ingredientes'], true);
        foreach ($ingredientes as $ingrediente) {
            $stmt = $con->prepare("INSERT INTO Incluye (idProducto, idIngrediente, cantidad) VALUES (?, ?, ?)");
            $stmt->execute([$idProducto, $ingrediente['id'], $ingrediente['cantidad']]);
        }

        $pasos = json_decode($_POST['pasos'], true);
        if (!empty($pasos)) {
            $stmt = $con->prepare("INSERT INTO Recetas (idProducto, cantPasos) VALUES (?, ?)");
            $stmt->execute([$idProducto, count($pasos)]);
            
            $idReceta = $con->lastInsertId();

            $stmt = $con->prepare("INSERT INTO RecetasPasos (idReceta, paso) VALUES (?, ?)");
            foreach ($pasos as $paso) {
                $stmt->execute([$idReceta, $paso]);
            }
        }

        $con->commit();
        $response['success'] = true;
        $response['message'] = 'Producto creado con éxito';
    } catch (PDOException $e) {
        $con->rollBack();
        $response['success'] = false;
        $response['message'] = 'Error al crear el producto: ' . $e->getMessage();
    }
} else {
    $response['success'] = false;
    $response['message'] = 'Método no permitido';
}

header('Content-Type: application/json');
echo json_encode($response);
