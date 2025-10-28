<?php
header('Content-Type: application/json');
session_start();

session_destroy();

setcookie(session_name(), '', time() - 3600, '/');

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

echo json_encode([
    "success" => true,
    "message" => "Sesión cerrada exitosamente"
]);
