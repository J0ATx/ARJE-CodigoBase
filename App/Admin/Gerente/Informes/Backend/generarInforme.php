<?php
// Habilitar reporte de errores para debug
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');
include '../../../../Control/Conexión/gerente.php';

function send_json($arr) {
    echo json_encode($arr);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // if ((isset($_POST['inicio'])) && (isset($_POST['fin']))) {
    //     $inicio = new DateTime($_POST['inicio']);
    //     $fin = new DateTime($_POST['fin']);

    //     $informe = "Hola";

    //     send_json(['mensaje' => $informe]);
    // } else {
    //     send_json(['error' => 'Faltan parámetros.']);
    // }
    send_json(['mensaje' => 'Informe generado correctamente.']);
} else {
    send_json(['error' => 'Método de solicitud no permitido.']);
}