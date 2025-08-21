<?php
require_once '../../../../Control/Conexión/conexion.php';

$response = array();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $con->beginTransaction();

        $stmt = $con->prepare("UPDATE Productos SET nombre = ?, precio = ? WHERE idProducto = ?");
        $stmt->execute([
            $_POST['nombre'],
            $_POST['precio'],
            $_POST['id']
        ]);

        $stmt = $con->prepare("DELETE FROM Incluye WHERE idProducto = ?");
        $stmt->execute([$_POST['id']]);
        
        $ingredientes = json_decode($_POST['ingredientes'], true);
        foreach ($ingredientes as $ingrediente) {
            $stmt = $con->prepare("INSERT INTO Incluye (idProducto, idIngrediente, cantidad) VALUES (?, ?, ?)");
            $stmt->execute([$_POST['id'], $ingrediente['id'], $ingrediente['cantidad']]);
        }

        $stmt = $con->prepare("SELECT idReceta FROM Recetas WHERE idProducto = ?");
        $stmt->execute([$_POST['id']]);
        $receta = $stmt->fetch(PDO::FETCH_ASSOC);
        
        $pasos = json_decode($_POST['pasos'], true);
        if ($receta) {
            $stmt = $con->prepare("DELETE FROM RecetasPasos WHERE idReceta = ?");
            $stmt->execute([$receta['idReceta']]);
            
            $stmt = $con->prepare("UPDATE Recetas SET cantPasos = ? WHERE idReceta = ?");
            $stmt->execute([count($pasos), $receta['idReceta']]);
        } else {
            $stmt = $con->prepare("INSERT INTO Recetas (idProducto, cantPasos) VALUES (?, ?)");
            $stmt->execute([$_POST['id'], count($pasos)]);
            $receta = ['idReceta' => $con->lastInsertId()];
        }

        if (!empty($pasos)) {
            $stmt = $con->prepare("INSERT INTO RecetasPasos (idReceta, paso) VALUES (?, ?)");
            foreach ($pasos as $paso) {
                $stmt->execute([$receta['idReceta'], $paso]);
            }
        }

        $con->commit();
        $response['success'] = true;
        $response['message'] = 'Producto actualizado con éxito';
    } catch (PDOException $e) {
        $con->rollBack();
        $response['success'] = false;
        $response['message'] = 'Error al actualizar el producto: ' . $e->getMessage();
    }
} else {
    $response['success'] = false;
    $response['message'] = 'Método no permitido';
}

header('Content-Type: application/json');
echo json_encode($response);
