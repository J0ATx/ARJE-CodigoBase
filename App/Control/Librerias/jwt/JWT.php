<?php

class JWT {
    
    public static function encode($payload, $key, $alg = 'HS256') {
        $header = json_encode(['typ' => 'JWT', 'alg' => $alg]);
        $payload = json_encode($payload);
        
        $headerEncoded = self::base64UrlEncode($header);
        $payloadEncoded = self::base64UrlEncode($payload);
        
        $signature = hash_hmac('sha256', $headerEncoded . "." . $payloadEncoded, $key, true);
        $signatureEncoded = self::base64UrlEncode($signature);
        
        return $headerEncoded . "." . $payloadEncoded . "." . $signatureEncoded;
    }
    
    public static function decode($jwt, $key, $alg = 'HS256') {
        $parts = explode('.', $jwt);
        
        if (count($parts) !== 3) {
            throw new Exception('Token JWT malformado');
        }
        
        list($headerEncoded, $payloadEncoded, $signatureEncoded) = $parts;
        
        
        $header = json_decode(self::base64UrlDecode($headerEncoded), true);
        if (!$header) {
            throw new Exception('Header JWT inválido');
        }
        
        
        if ($header['alg'] !== $alg) {
            throw new Exception('Algoritmo JWT no soportado');
        }
        
        
        $payload = json_decode(self::base64UrlDecode($payloadEncoded), true);
        if (!$payload) {
            throw new Exception('Payload JWT inválido');
        }
        
        
        $signature = self::base64UrlDecode($signatureEncoded);
        $expectedSignature = hash_hmac('sha256', $headerEncoded . "." . $payloadEncoded, $key, true);
        
        if (!hash_equals($expectedSignature, $signature)) {
            throw new Exception('Firma JWT inválida');
        }
        
        
        if (isset($payload['exp']) && $payload['exp'] < time()) {
            throw new Exception('Token JWT expirado');
        }
        
        
        if (isset($payload['nbf']) && $payload['nbf'] > time()) {
            throw new Exception('Token JWT no válido aún');
        }
        
        return (object) $payload;
    }
    
    private static function base64UrlEncode($data) {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }
    
    private static function base64UrlDecode($data) {
        return base64_decode(str_pad(strtr($data, '-_', '+/'), strlen($data) % 4, '=', STR_PAD_RIGHT));
    }
    
    public static function crearPayloadRecuperacion($email, $tipo, $expiracion = 3600) {
        $now = time();
        return [
            'email' => $email,
            'tipo' => $tipo,
            'proposito' => 'recuperar_password',
            'iat' => $now,
            'exp' => $now + $expiracion,
            'jti' => bin2hex(random_bytes(8))
        ];
    }
    
    public static function esTokenRecuperacion($payload) {
        return isset($payload->proposito) && $payload->proposito === 'recuperar_password';
    }
}
?>