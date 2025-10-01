<?php
    include_once '..\..\..\..\Control\Conexión\conexion.php';

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

        // Aplicar búsqueda si existe
        if (!empty($search)) {
            $sql .= " WHERE cliente_id LIKE :search";
        }

        // Aplicar ordenamiento si está especificado
        if (!empty($orden) && isset($campos_validos[$orden])) {
            $campo_orden = $campos_validos[$orden];
            $sql .= " ORDER BY $campo_orden";
        }

        $sentencia = $con->prepare($sql);

        // Ejecutar con parámetros si hay búsqueda
        if (!empty($search)) {
            $sentencia->execute(['search' => '%' . $search . '%']);
        } else {
            $sentencia->execute();
        }

        $reservas = $sentencia->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode($reservas);
    } catch (\Throwable $th) {
        echo json_encode(["error" => "Error al obtener los datos: " . $th->getMessage()]);
        exit();
    }
?>