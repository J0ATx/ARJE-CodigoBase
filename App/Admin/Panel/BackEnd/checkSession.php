<?php
header('Content-Type: application/json');
session_start();

// Verificar si hay sesión iniciada y si es gerente
$logged_in = isset($_SESSION["logged"]) && $_SESSION["logged"] === true;
$is_admin = isset($_SESSION["es_gerente"]) && $_SESSION["es_gerente"] === true;

// Preparar respuesta
$response = [
    "success" => true,
    "logged_in" => $logged_in,
    "is_admin" => $is_admin,
    "user" => $logged_in ? [
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