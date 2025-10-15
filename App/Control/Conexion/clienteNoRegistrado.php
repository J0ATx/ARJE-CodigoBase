<?php

    try {
        $con = new PDO("mysql:
            host=localhost;
            dbname=losTresTanosDB", 
            "cliente_no_registrado", 
            "lgfCaXeEgEarShYu");
    } catch (\Throwable $th) {
        JSON_encode(array("error" => "Error conectando con la base de datos: " . $th->getMessage()));
        exit();
    }

?>