<?php
header('Content-Type: application/json');
session_start();

$response = [
    "logged_in" => isset($_SESSION["logged"]) && $_SESSION["logged"] === true,
    "user" => isset($_SESSION["usuario_id"]) ? [
        "id" => $_SESSION["usuario_id"],
        "nombre" => $_SESSION["nombre"],
        "apellido" => $_SESSION["apellido"],
        "rol" => $_SESSION["rol"]
    ] : null
];

echo json_encode($response);
