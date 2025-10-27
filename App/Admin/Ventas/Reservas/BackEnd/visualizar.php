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
        
        if (!empty($search)) {
            $whereConditions[] = "cliente_id LIKE :search";
        }
        
        if (!empty($whereConditions)) {
            $sql .= " WHERE " . implode(" AND ", $whereConditions);
        }

        if (!empty($orden) && isset($campos_validos[$orden])) {
            $campo_orden = $campos_validos[$orden];
            $sql .= " ORDER BY $campo_orden";
        } else {
            $sql .= " ORDER BY reserva_fecha DESC";
        }

        $sentencia = $con->prepare($sql);

        $params = [];
        if (!empty($search)) {
            $params['search'] = '%' . $search . '%';
        }
        
        $sentencia->execute($params);

        $reservas = $sentencia->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode($reservas);
    } catch (\Throwable $th) {
        echo json_encode(["error" => "Error al obtener los datos: " . $th->getMessage()]);
        exit();
    }
?>