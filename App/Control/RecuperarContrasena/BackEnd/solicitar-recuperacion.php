<?php
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'exito' => false,
        'mensaje' => 'Método no permitido. Use POST.',
        'codigo' => 405
    ]);
    exit();
}

require_once __DIR__ . '/funciones-recuperacion.php';
require_once __DIR__ . '/security-helper.php';

try {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    
    if (!$data) {
        $data = $_POST;
    }
    
    
    if (!isset($data['email']) || empty(trim($data['email']))) {
        http_response_code(400);
        echo json_encode([
            'exito' => false,
            'mensaje' => 'El campo email es requerido',
            'codigo' => 400
        ]);
        exit();
    }
    
    $email = trim($data['email']);
    
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode([
            'exito' => false,
            'mensaje' => 'El formato del email no es válido',
            'codigo' => 400
        ]);
        exit();
    }
    
    
    $rateLimitResult = verificarRateLimit($email, 'solicitud');
    if (!$rateLimitResult['permitido']) {
        http_response_code(429);
        echo json_encode([
            'exito' => false,
            'mensaje' => $rateLimitResult['mensaje'],
            'codigo' => 429
        ]);
        exit();
    }
    
    
    logEventoJWT('solicitud_recibida', $email, 'Endpoint: solicitar-recuperacion.php');
    
    
    $resultado = procesarSolicitudRecuperacion($email);
    
    
    http_response_code($resultado['codigo']);
    
    
    echo json_encode($resultado);
    
} catch (Exception $e) {
    error_log("Error en solicitar-recuperacion.php: " . $e->getMessage());
    logEventoJWT('error_endpoint', $data['email'] ?? 'unknown', 'Error: ' . $e->getMessage());
    
    
    http_response_code(500);
    echo json_encode([
        'exito' => false,
        'mensaje' => 'Error interno del servidor',
        'codigo' => 500
    ]);
}
?>