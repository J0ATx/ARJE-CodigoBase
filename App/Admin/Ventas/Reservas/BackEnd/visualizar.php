<?php
    include_once '..\..\..\..\Control\Conexion\empleado.php';

    try {
        $search = isset($_POST['search']) ? $_POST['search'] : '';
        $orden = isset($_POST['orden']) ? $_POST['orden'] : '';

        // Mapeo de campos válidos para ordenamiento
        $campos_validos = [
            'usuario' => 'cliente_id',
            'mesa' => 'mesa_id',
            'fecha' => 'reserva_fecha',
            'cantidad_personas' => 'reserva_cantidad_personas'
        ];

        $sql = "SELECT * FROM Reserva";

        $whereConditions = [];
        
        // Aplicar búsqueda si existe
        if (!empty($search)) {
            $whereConditions[] = "cliente_id LIKE :search";
        }
        
        // Filtrar por estado si se especifica
        $estadoFiltro = isset($_POST['estado']) ? $_POST['estado'] : '';
        if (!empty($estadoFiltro) && in_array($estadoFiltro, ['Pendiente', 'Confirmada'])) {
            $whereConditions[] = "reserva_estado = :estado";
        }
        
        if (!empty($whereConditions)) {
            $sql .= " WHERE " . implode(" AND ", $whereConditions);
        }

        // Aplicar ordenamiento si está especificado
        if (!empty($orden) && isset($campos_validos[$orden])) {
            $campo_orden = $campos_validos[$orden];
            $sql .= " ORDER BY $campo_orden";
        } else {
            // Ordenar por estado (Pendiente primero) y luego por fecha
            $sql .= " ORDER BY FIELD(reserva_estado, 'Pendiente', 'Confirmada'), reserva_fecha DESC";
        }

        $sentencia = $con->prepare($sql);

        // Preparar parámetros para ejecutar
        $params = [];
        if (!empty($search)) {
            $params['search'] = '%' . $search . '%';
        }
        if (!empty($estadoFiltro) && in_array($estadoFiltro, ['Pendiente', 'Confirmada'])) {
            $params['estado'] = $estadoFiltro;
        }
        
        $sentencia->execute($params);

        $reservas = $sentencia->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode($reservas);
    } catch (\Throwable $th) {
        echo json_encode(["error" => "Error al obtener los datos: " . $th->getMessage()]);
        exit();
    }
?>