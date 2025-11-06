<?php

require_once __DIR__ . '/../../Librerias/jwt/JWT.php';
define('JWT_SECRET_KEY', 'L0s3T4n0s_R3cup3r4c10n_S3cr3t_K3y_2024_S3gur4!');
define('JWT_ALGORITHM', 'HS256');
define('JWT_EXPIRATION', 3600);

function generarTokenJWT($email, $tipo) {
    try {
        if (empty($email) || empty($tipo)) {
            throw new Exception('Email y tipo son requeridos');
        }
        
        if (!in_array($tipo, ['Cliente', 'Personal'])) {
            throw new Exception('Tipo de usuario inválido');
        }
        
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new Exception('Email inválido');
        }
        
        
        $payload = JWT::crearPayloadRecuperacion($email, $tipo, JWT_EXPIRATION);
        
        
        $token = JWT::encode($payload, JWT_SECRET_KEY, JWT_ALGORITHM);
        
        return $token;
        
    } catch (Exception $e) {
        error_log("Error generando token JWT: " . $e->getMessage());
        throw new Exception('Error interno generando token');
    }
}

function validarTokenJWT($token) {
    try {
        if (empty($token)) {
            return false;
        }
        
        
        $payload = JWT::decode($token, JWT_SECRET_KEY, JWT_ALGORITHM);
        
        
        if (!JWT::esTokenRecuperacion($payload)) {
            return false;
        }
        
        
        if (!isset($payload->email) || !isset($payload->tipo)) {
            return false;
        }
        
        
        return [
            'email' => $payload->email,
            'tipo' => $payload->tipo,
            'jti' => $payload->jti ?? null,
            'iat' => $payload->iat ?? null,
            'exp' => $payload->exp ?? null
        ];
        
    } catch (Exception $e) {
        error_log("Error validando token JWT: " . $e->getMessage());
        return false;
    }
}

function obtenerInfoToken($token) {
    try {
        if (empty($token)) {
            return false;
        }
        
        
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            return false;
        }
        
        
        $payloadEncoded = $parts[1];
        $payloadJson = base64_decode(str_pad(strtr($payloadEncoded, '-_', '+/'), strlen($payloadEncoded) % 4, '=', STR_PAD_RIGHT));
        $payload = json_decode($payloadJson, true);
        
        if (!$payload) {
            return false;
        }
        
        return [
            'email' => $payload['email'] ?? null,
            'tipo' => $payload['tipo'] ?? null,
            'proposito' => $payload['proposito'] ?? null,
            'exp' => $payload['exp'] ?? null,
            'expirado' => isset($payload['exp']) ? ($payload['exp'] < time()) : false
        ];
        
    } catch (Exception $e) {
        error_log("Error obteniendo info del token: " . $e->getMessage());
        return false;
    }
}

function tokenExpirado($token) {
    $info = obtenerInfoToken($token);
    return $info ? $info['expirado'] : true;
}

function generarTokenPrueba($email, $tipo, $expiracionSegundos = 3600) {
    $payload = [
        'email' => $email,
        'tipo' => $tipo,
        'proposito' => 'recuperar_password',
        'iat' => time(),
        'exp' => time() + $expiracionSegundos,
        'jti' => 'test_' . bin2hex(random_bytes(4))
    ];
    
    return JWT::encode($payload, JWT_SECRET_KEY, JWT_ALGORITHM);
}

function logEventoJWT($evento, $email, $detalle = '') {
    $timestamp = date('Y-m-d H:i:s');
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'unknown';
    
    $mensaje = "[{$timestamp}] JWT_{$evento}: {$email} | IP: {$ip} | {$detalle} | UA: {$userAgent}";
    
    
    error_log($mensaje, 3, __DIR__ . '/../../logs/recuperacion_password.log');
}
?>