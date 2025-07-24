<?php
header('Content-Type: application/json');
session_start();

$response = [
    "logged_in" => isset($_SESSION["logged"]) && $_SESSION["logged"] === true,
    "user" => isset($_SESSION["nombre"]) ? [
        "id" => $_SESSION["usuario_id"],
        "nombre" => $_SESSION["nombre"],
        "apellido" => $_SESSION["apellido"]
    ] : null
];

// Enviar respuesta
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

echo json_encode($response);
