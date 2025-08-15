<?php
header('Content-Type: application/json');
session_start();

$logged_in = isset($_SESSION["logged"]) && $_SESSION["logged"] === true;
$es_gerente = isset($_SESSION["rol"]) && $_SESSION["rol"] === "Gerente";

$response = [
    "success" => true,
    "logged_in" => $logged_in,
    "es_gerente" => $es_gerente,
    "user" => $logged_in ? [
        "id" => $_SESSION["usuario_id"],
        "nombre" => $_SESSION["nombre"],
        "apellido" => $_SESSION["apellido"],
        "rol" => $_SESSION["rol"]
    ] : null
];

echo json_encode($response);