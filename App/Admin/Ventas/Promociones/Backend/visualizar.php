<?php
    header('Content-Type: application/json; charset=utf-8');
    require_once '../../../../Control/Conexion/conexion.php';

    $response = [
        'success' => false,
        'message' => '',
        'data' => []
    ];

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        $response['message'] = 'Método HTTP no permitido. Se requiere POST.';
        echo json_encode($response);
        exit;
    }

    try {
        // Validar conexión a base de datos
        if (!isset($con) || $con === null) {
            throw new Exception('No hay conexión a la base de datos');
        }

        // Obtener productos existentes
        $sql = 'SELECT 
                    producto_id,
                    producto_nombre, 
                    producto_precio, 
                    producto_descripcion, 
                    producto_categoria,
                    producto_creacion
                FROM Producto
                ORDER BY producto_nombre ASC';
        
        $stmt = $con->prepare($sql);
        
        if (!$stmt) {
            throw new Exception('Error en la preparación de consulta de productos: ' . $con->errorInfo()[2]);
        }

        if (!$stmt->execute()) {
            throw new Exception('Error al ejecutar consulta de productos: ' . implode(', ', $stmt->errorInfo()));
        }

        $productosExistentes = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if ($productosExistentes === false) {
            throw new Exception('Error al obtener productos de la base de datos');
        }

        // Obtener promociones activas con productos asociados
        $sql = 'SELECT 
                    pr.promocion_id,
                    pr.promocion_nombre, 
                    pr.promocion_descripcion, 
                    pr.promocion_descuento, 
                    pr.promocion_fidelizada,
                    pr.promocion_creacion,
                    p.producto_nombre,
                    p.producto_id
                FROM Promocion pr
                LEFT JOIN Posee po ON pr.promocion_id = po.promocion_id
                LEFT JOIN Producto p ON po.producto_id = p.producto_id
                ORDER BY pr.promocion_creacion DESC, p.producto_nombre ASC';
        
        $stmt = $con->prepare($sql);
        
        if (!$stmt) {
            throw new Exception('Error en la preparación de consulta de promociones: ' . $con->errorInfo()[2]);
        }

        if (!$stmt->execute()) {
            throw new Exception('Error al ejecutar consulta de promociones: ' . implode(', ', $stmt->errorInfo()));
        }

        $promocionesRaw = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if ($promocionesRaw === false) {
            throw new Exception('Error al obtener promociones de la base de datos');
        }

        // Agrupar promociones por ID para evitar duplicados
        $promociones = [];
        $promocionesIds = [];
        
        foreach ($promocionesRaw as $row) {
            $promoId = $row['promocion_id'];
            
            if (!isset($promocionesIds[$promoId])) {
                $promocionesIds[$promoId] = [
                    'promocion_id' => $row['promocion_id'],
                    'promocion_nombre' => $row['promocion_nombre'],
                    'promocion_descripcion' => $row['promocion_descripcion'],
                    'promocion_descuento' => (float)$row['promocion_descuento'],
                    'promocion_fidelizada' => (bool)$row['promocion_fidelizada'],
                    'promocion_creacion' => $row['promocion_creacion'],
                    'productos' => []
                ];
            }

            if ($row['producto_id'] !== null) {
                $promocionesIds[$promoId]['productos'][] = [
                    'producto_id' => $row['producto_id'],
                    'producto_nombre' => $row['producto_nombre']
                ];
            }
        }

        $promociones = array_values($promocionesIds);

        $response['success'] = true;
        $response['message'] = 'Datos obtenidos correctamente';
        $response['data'] = [
            'productosExistentes' => $productosExistentes,
            'promociones' => $promociones,
            'total_productos' => count($productosExistentes),
            'total_promociones' => count($promociones)
        ];

        http_response_code(200);

    } catch (PDOException $e) {
        http_response_code(500);
        $response['success'] = false;
        $response['message'] = 'Error en la base de datos: ' . $e->getMessage();
        error_log('PDOException en visualizar.php: ' . $e->getMessage());
        
    } catch (Exception $e) {
        http_response_code(500);
        $response['success'] = false;
        $response['message'] = 'Error inesperado: ' . $e->getMessage();
        error_log('Exception en visualizar.php: ' . $e->getMessage());
    }

    echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
?>