<?php
// editarPedido.php - Edita productos y comentarios de un pedido
header('Content-Type: application/json');
require_once '../../../../Control/Conexión/conexion.php';

$response = ["success" => false];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $idPedido = $_POST['idPedido'] ?? null;
    $especificacion = $_POST['especificacion'] ?? '';
    $productos = json_decode($_POST['productos'] ?? '[]', true);
    
    if (!$idPedido || empty($productos)) {
        $response['message'] = 'Datos incompletos';
        echo json_encode($response);
        exit;
    }
    
    try {
        // Validar que el pedido existe
        $stmt = $con->prepare('SELECT idPedido FROM Pedido WHERE idPedido = ?');
        $stmt->execute([$idPedido]);
        if (!$stmt->fetchColumn()) {
            $response['message'] = 'Pedido no encontrado';
            echo json_encode($response);
            exit;
        }
        
        $con->beginTransaction();
        
        // Eliminar productos y especificaciones actuales
        $con->prepare('DELETE FROM Tiene WHERE idPedido = ?')->execute([$idPedido]);
        $con->prepare('DELETE FROM EspecificacionesPedido WHERE idPedido = ?')->execute([$idPedido]);
        
        // Insertar nuevos productos
        foreach ($productos as $prod) {
            $con->prepare('INSERT INTO Tiene (idPedido, idProducto) VALUES (?, ?)')
               ->execute([$idPedido, $prod['idProducto']]);
        }
        
        // Insertar/actualizar especificación del pedido si existe
        if (!empty(trim($especificacion))) {
            // Insertar especificación si no existe
            $stmt = $con->prepare('SELECT idEspecificacion FROM Especificaciones WHERE especificacion = ?');
            $stmt->execute([$especificacion]);
            $idEsp = $stmt->fetchColumn();
            
            if (!$idEsp) {
                $con->prepare('INSERT INTO Especificaciones (especificacion) VALUES (?)')
                   ->execute([$especificacion]);
                $idEsp = $con->lastInsertId();
            }
            
            // Relacionar especificación con el pedido
            $con->prepare('INSERT INTO EspecificacionesPedido (idEspecificacion, idPedido) VALUES (?, ?)')
               ->execute([$idEsp, $idPedido]);
        }
        
        $con->commit();
        $response['success'] = true;
    } catch (Exception $e) {
        $con->rollBack();
        $response['message'] = 'Error al editar pedido: ' . $e->getMessage();
    }
}

echo json_encode($response);
