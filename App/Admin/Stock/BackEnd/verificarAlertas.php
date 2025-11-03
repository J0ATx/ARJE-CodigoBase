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
                s.stock_alerta AS alerta,
                sc.stock_cantidad AS stock,
                sc.stock_medida AS medida,
                DATEDIFF(s.stock_alerta, ?) AS dias_hasta_alerta,
                DATEDIFF(s.stock_caducidad, ?) AS dias_hasta_caducidad
            FROM Stock s
            LEFT JOIN Stock_Cantidad sc ON sc.stock_id = s.stock_id
            WHERE s.stock_alerta IS NOT NULL
            AND s.stock_alerta <= DATE_ADD(?, INTERVAL 7 DAY)
            ORDER BY s.stock_alerta ASC, s.stock_caducidad ASC
        ";
        
        $stmt = $con->prepare($sql);
        $stmt->execute([$fechaActual, $fechaActual, $fechaActual]);
        $ingredientes = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $alertas = array();
        
        foreach ($ingredientes as $ingrediente) {
            $diasHastaAlerta = (int)$ingrediente['dias_hasta_alerta'];
            $diasHastaCaducidad = (int)$ingrediente['dias_hasta_caducidad'];
            $estado = '';
            if ($diasHastaAlerta < 0) {
                $estado = 'vencida';
            } elseif ($diasHastaAlerta == 0) {
                $estado = 'activa';
            } else {
                $estado = 'pendiente';
            }
            $alerta = array(
                'stock_id' => (int)$ingrediente['stock_id'],
                'nombre' => $ingrediente['nombre'],
                'caducidad' => $ingrediente['caducidad'],
                'alerta' => $ingrediente['alerta'],
                'stock' => $ingrediente['stock'],
                'medida' => $ingrediente['medida'],
                'dias_restantes' => $diasHastaAlerta,
                'dias_hasta_caducidad' => $diasHastaCaducidad,
                'estado' => $estado
            );
            
            $alertas[] = $alerta;
        }
        
        $response['success'] = true;
        $response['alertas'] = $alertas;
        $response['total_alertas'] = count($alertas);
        $estadisticas = array(
            'pendientes' => 0,
            'activas' => 0,
            'vencidas' => 0
        );
        
        foreach ($alertas as $alerta) {
            switch ($alerta['estado']) {
                case 'pendiente':
                    $estadisticas['pendientes']++;
                    break;
                case 'activa':
                    $estadisticas['activas']++;
                    break;
                case 'vencida':
                    $estadisticas['vencidas']++;
                    break;
            }
        }
        
        $response['estadisticas'] = $estadisticas;
        
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