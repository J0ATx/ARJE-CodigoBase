<?php

    try {
        $con = new PDO("mysql:
        host=localhost;
        dbname=lostrestanosdb", 
        "gerente", 
        "0gGiOjvwsBRHnpdt");
    } catch (Throwable $th) {
        echo json_encode(["error" => "Error conectando con la base de datos: " . $th->getMessage()]);
        exit();
    }

?>