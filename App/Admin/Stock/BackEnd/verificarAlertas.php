<?php
require_once '../../../Control/Conexion/gerente.php';

$response = array();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $fechaActual = date('Y-m-d');
        
        $sql = "
            SELECT 
                s.stock_id,
                s.stock_nombre AS nombre,
                s.stock_caducidad AS caducidad,
                s.stock_alerta AS cantidad_minima,
                sc.stock_cantidad AS cantidad_actual,
                sc.stock_medida AS medida,
                DATEDIFF(s.stock_caducidad, ?) AS dias_hasta_caducidad
            FROM Stock s
            LEFT JOIN Stock_Cantidad sc ON sc.stock_id = s.stock_id
            WHERE s.stock_caducidad IS NOT NULL
            AND DATEDIFF(s.stock_caducidad, ?) <= 10
            AND DATEDIFF(s.stock_caducidad, ?) >= 0
            ORDER BY s.stock_caducidad ASC
        ";
        
        $stmt = $con->prepare($sql);
        $stmt->execute([$fechaActual, $fechaActual, $fechaActual]);
        $ingredientes = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $alertas_caducidad = array();
        $alertas_stock_bajo = array();
        
        foreach ($ingredientes as $ingrediente) {
            $diasHastaCaducidad = (int)$ingrediente['dias_hasta_caducidad'];
            
            if ($diasHastaCaducidad <= 10) {
                $alerta_caducidad = array(
                    'stock_id' => (int)$ingrediente['stock_id'],
                    'nombre' => $ingrediente['nombre'],
                    'caducidad' => $ingrediente['caducidad'],
                    'dias_restantes' => $diasHastaCaducidad,
                    'tipo' => 'caducidad'
                );
                
                $alertas_caducidad[] = $alerta_caducidad;
            }
            
            $cantidadMinima = (int)$ingrediente['cantidad_minima'];
            $cantidadActual = (float)$ingrediente['cantidad_actual'];
            
            if ($cantidadMinima > 0 && $cantidadActual <= $cantidadMinima) {
                $alerta_stock_bajo = array(
                    'stock_id' => (int)$ingrediente['stock_id'],
                    'nombre' => $ingrediente['nombre'],
                    'cantidad_actual' => $cantidadActual,
                    'cantidad_minima' => $cantidadMinima,
                    'medida' => $ingrediente['medida'],
                    'tipo' => 'stock_bajo'
                );
                
                $alertas_stock_bajo[] = $alerta_stock_bajo;
            }
        }
        
        $sqlStockBajo = "
            SELECT 
                s.stock_id,
                s.stock_nombre AS nombre,
                s.stock_alerta AS cantidad_minima,
                sc.stock_cantidad AS cantidad_actual,
                sc.stock_medida AS medida
            FROM Stock s
            LEFT JOIN Stock_Cantidad sc ON sc.stock_id = s.stock_id
            WHERE s.stock_alerta > 0
            AND sc.stock_cantidad <= s.stock_alerta
            AND (s.stock_caducidad IS NULL OR DATEDIFF(s.stock_caducidad, ?) > 10)
        ";
        
        $stmtStockBajo = $con->prepare($sqlStockBajo);
        $stmtStockBajo->execute([$fechaActual]);
        $ingredientesStockBajo = $stmtStockBajo->fetchAll(PDO::FETCH_ASSOC);
        
        foreach ($ingredientesStockBajo as $ingrediente) {
            $alerta_stock_bajo = array(
                'stock_id' => (int)$ingrediente['stock_id'],
                'nombre' => $ingrediente['nombre'],
                'cantidad_actual' => (float)$ingrediente['cantidad_actual'],
                'cantidad_minima' => (int)$ingrediente['cantidad_minima'],
                'medida' => $ingrediente['medida'],
                'tipo' => 'stock_bajo'
            );
            
            $alertas_stock_bajo[] = $alerta_stock_bajo;
        }
        
        $response['success'] = true;
        $response['alertas_caducidad'] = $alertas_caducidad;
        $response['alertas_stock_bajo'] = $alertas_stock_bajo;
        $response['total_alertas_caducidad'] = count($alertas_caducidad);
        $response['total_alertas_stock_bajo'] = count($alertas_stock_bajo);
        
    } catch (PDOException $e) {
        $response['success'] = false;
        $response['message'] = 'Error al verificar alertas: ' . $e->getMessage();
    } catch (Exception $e) {
        $response['success'] = false;
        $response['message'] = 'Error interno: ' . $e->getMessage();
    }
} else {
    $response['success'] = false;
    $response['message'] = 'Método no permitido';
}

header('Content-Type: application/json');
echo json_encode($response);
?>