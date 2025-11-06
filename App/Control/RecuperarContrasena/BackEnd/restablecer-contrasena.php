<?php
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'exito' => false,
        'mensaje' => 'Método no permitido. Solo se acepta POST.',
        'codigo' => 405
    ]);
    exit();
}
require_once __DIR__ . '/funciones-recuperacion.php';
require_once __DIR__ . '/security-helper.php';

function enviarRespuesta($exito, $mensaje, $codigo = 200, $datos = []) {
    http_response_code($codigo);
    
    $respuesta = [
        'exito' => $exito,
        'mensaje' => $mensaje,
        'codigo' => $codigo,
        'timestamp' => date('Y-m-d H:i:s')
    ];
    
    if (!empty($datos)) {
        $respuesta['datos'] = $datos;
    }
    
    echo json_encode($respuesta, JSON_UNESCAPED_UNICODE);
    exit;
}

function validarComplejidadContrasena($contrasena) {
    $errores = [];
    
    if (strlen($contrasena) < 8) {
        $errores[] = 'La contraseña debe tener al menos 8 caracteres';
    }
    
    if (strlen($contrasena) > 128) {
        $errores[] = 'La contraseña no puede tener más de 128 caracteres';
    }
    
    if (!preg_match('/[a-zA-Z]/', $contrasena)) {
        $errores[] = 'La contraseña debe contener al menos una letra';
    }
    
    if (!preg_match('/[0-9]/', $contrasena)) {
        $errores[] = 'La contraseña debe contener al menos un número';
    }
    
    if (!preg_match('/[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?]/', $contrasena)) {
        $errores[] = 'La contraseña debe contener al menos un carácter especial';
    }
    
    return [
        'valida' => empty($errores),
        'errores' => $errores
    ];
}

try {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    if (!$data) {
        $data = $_POST;
    }
    
    
    if (!isset($data['token']) || empty(trim($data['token']))) {
        enviarRespuesta(false, 'Token requerido', 400);
    }
    
    if (!isset($data['nueva_contrasena']) || empty($data['nueva_contrasena'])) {
        enviarRespuesta(false, 'Nueva contraseña requerida', 400);
    }
    
    if (!isset($data['confirmar_contrasena']) || empty($data['confirmar_contrasena'])) {
        enviarRespuesta(false, 'Confirmación de contraseña requerida', 400);
    }
    
    $token = trim($data['token']);
    $nuevaContrasena = $data['nueva_contrasena'];
    $confirmarContrasena = $data['confirmar_contrasena'];
    
    
    if ($nuevaContrasena !== $confirmarContrasena) {
        enviarRespuesta(false, 'Las contraseñas no coinciden', 400);
    }
    
    
    $validacionContrasena = validarComplejidadContrasena($nuevaContrasena);
    if (!$validacionContrasena['valida']) {
        enviarRespuesta(false, implode(', ', $validacionContrasena['errores']), 400);
    }
    
    
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $rateLimitResult = verificarRateLimit('restablecimiento_' . $ip, 'restablecimiento');
    
    if (!$rateLimitResult['permitido']) {
        enviarRespuesta(false, $rateLimitResult['mensaje'], 429);
    }
    
    
    $resultadoValidacion = validarTokenRecuperacion($token);
    
    if (!$resultadoValidacion['valido']) {
        $mensaje = $resultadoValidacion['mensaje'] ?? 'Token inválido o expirado';
        $codigo = $resultadoValidacion['codigo'] ?? 400;
        enviarRespuesta(false, $mensaje, $codigo);
    }
    
    $email = $resultadoValidacion['email'];
    $tipoUsuario = $resultadoValidacion['tipo'];
    
    
    $actualizacionExitosa = actualizarContrasena($email, $nuevaContrasena, $tipoUsuario);
    
    if (!$actualizacionExitosa) {
        logEventoJWT('restablecimiento_fallo_bd', $email, "Error actualizando BD");
        enviarRespuesta(false, 'Error actualizando la contraseña. Inténtalo nuevamente.', 500);
    }
    
    
    logEventoJWT('restablecimiento_exitoso', $email, "Contraseña actualizada correctamente");
    
    $baseUrl = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https://' : 'http://';
    $baseUrl .= $_SERVER['HTTP_HOST'];
    $urlSignIn = $baseUrl . '/App/Control/SignIn/FrontEnd/index.html';
    
    enviarRespuesta(true, 'Contraseña actualizada correctamente. Serás redirigido al inicio de sesión.', 200, [
        'redirigir' => $urlSignIn,
        'delay' => 2000,
        'usuario_tipo' => $tipoUsuario
    ]);
    
} catch (Exception $e) {
    error_log("Error en restablecimiento: " . $e->getMessage());
    logEventoJWT('error_critico_restablecimiento', 'unknown', 'Error: ' . $e->getMessage());
    
    enviarRespuesta(false, 'Error interno del servidor', 500);
}
?>