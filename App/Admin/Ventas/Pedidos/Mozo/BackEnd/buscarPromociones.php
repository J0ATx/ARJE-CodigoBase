<?php
// fileName: buscarPromociones.php
header('Content-Type: application/json');
require_once '../../../../../Control/Conexion/empleado.php'; // Ajusta la ruta según tu estructura

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $productos = json_decode($_POST['productos'] ?? '[]', true);
    
    if (empty($productos)) {
        echo json_encode([]);
        exit;
    }

    // Extraer solo los IDs de los productos
    $idsProductos = array_map(function($p) {
        return intval($p['idProducto']);
    }, $productos);
    
    if (empty($idsProductos)) {
        echo json_encode([]);
        exit;
    }

    // Crear placeholders para la consulta SQL IN (?,?,?)
    $placeholders = implode(',', array_fill(0, count($idsProductos), '?'));

    // Consulta: Obtener promos activas que aplican a los productos seleccionados
    // Asumimos que la promo aplica si está en la tabla 'Aplica'
    $sql = "SELECT 
                p.promocion_id, 
                p.promocion_nombre, 
                p.promocion_descuento,
                p.promocion_descripcion,
                a.producto_id
            FROM Promocion p
            JOIN Aplica a ON p.promocion_id = a.promocion_id
            WHERE a.producto_id IN ($placeholders)";

    try {
        $stmt = $con->prepare($sql);
        $stmt->execute($idsProductos);
        $promociones = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode($promociones);
    } catch (Exception $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}
?>