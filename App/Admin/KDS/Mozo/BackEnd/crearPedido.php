<?php
// crearPedido.php - Crea un nuevo pedido físico con productos y comentarios
header('Content-Type: application/json');
require_once '../../../../Control/Conexión/conexion.php';

$response = ["success" => false];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $idMesa = $_POST['idMesa'] ?? null;
    $idMozo = $_POST['idMozo'] ?? null;
    $especificacion = $_POST['especificacion'] ?? '';
    $productos = json_decode($_POST['productos'] ?? '[]', true);
    
    if (!$idMesa || !$idMozo || empty($productos)) {
        $response['message'] = 'Datos incompletos';
        echo json_encode($response); 
        exit;
    }
    
    try {
        $con->beginTransaction();
        
        // Crear pedido
        $con->prepare('INSERT INTO Pedido (estado) VALUES ("pendiente")')->execute();
        $idPedido = $con->lastInsertId();
        
        // Relacionar con mesa y mozo
        $con->prepare('INSERT INTO PedidoFisico (idPedido, idMesa, idUsuario) VALUES (?, ?, ?)')
           ->execute([$idPedido, $idMesa, $idMozo]);
        
        // Insertar productos
        foreach ($productos as $prod) {
            $con->prepare('INSERT INTO Tiene (idPedido, idProducto) VALUES (?, ?)')
               ->execute([$idPedido, $prod['idProducto']]);
        }
        
        // Insertar especificación del pedido si existe
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
        $response['idPedido'] = $idPedido;
    } catch (Exception $e) {
        $con->rollBack();
        $response['message'] = 'Error al crear pedido: ' . $e->getMessage();
    }
}

echo json_encode($response);
