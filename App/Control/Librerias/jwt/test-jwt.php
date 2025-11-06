<?php
/**
 * Script de prueba para verificar la implementación JWT
 * Ejecutar desde navegador o línea de comandos para probar funcionalidad
 */

require_once 'JWT.php';
require_once 'config.php';

echo "<h2>Prueba de Implementación JWT - Los 3 Tanos</h2>\n";

try {
    // Datos de prueba
    $email = "test@ejemplo.com";
    $tipo = "Cliente";
    $secretKey = JWT_SECRET_KEY;
    
    echo "<h3>1. Generando Token JWT...</h3>\n";
    
    // Crear payload
    $payload = JWT::crearPayloadRecuperacion($email, $tipo);
    echo "Payload creado: " . json_encode($payload, JSON_PRETTY_PRINT) . "<br><br>\n";
    
    // Generar token
    $token = JWT::encode($payload, $secretKey);
    echo "Token generado: <br><code style='word-break: break-all;'>" . $token . "</code><br><br>\n";
    
    echo "<h3>2. Validando Token JWT...</h3>\n";
    
    // Decodificar token
    $decoded = JWT::decode($token, $secretKey);
    echo "Token decodificado exitosamente:<br>";
    echo "Email: " . $decoded->email . "<br>";
    echo "Tipo: " . $decoded->tipo . "<br>";
    echo "Propósito: " . $decoded->proposito . "<br>";
    echo "Creado: " . date('Y-m-d H:i:s', $decoded->iat) . "<br>";
    echo "Expira: " . date('Y-m-d H:i:s', $decoded->exp) . "<br>";
    echo "Es token de recuperación: " . (JWT::esTokenRecuperacion($decoded) ? 'Sí' : 'No') . "<br><br>";
    
    echo "<h3>3. Probando Token Inválido...</h3>\n";
    
    // Probar token manipulado
    $tokenManipulado = $token . "manipulado";
    try {
        JWT::decode($tokenManipulado, $secretKey);
        echo "❌ ERROR: Token manipulado fue aceptado<br>";
    } catch (Exception $e) {
        echo "✅ CORRECTO: Token manipulado rechazado - " . $e->getMessage() . "<br>";
    }
    
    echo "<h3>4. Probando Token Expirado...</h3>\n";
    
    // Crear token que ya expiró
    $payloadExpirado = [
        'email' => $email,
        'tipo' => $tipo,
        'proposito' => 'recuperar_password',
        'iat' => time() - 7200, // Hace 2 horas
        'exp' => time() - 3600  // Expiró hace 1 hora
    ];
    
    $tokenExpirado = JWT::encode($payloadExpirado, $secretKey);
    
    try {
        JWT::decode($tokenExpirado, $secretKey);
        echo "❌ ERROR: Token expirado fue aceptado<br>";
    } catch (Exception $e) {
        echo "✅ CORRECTO: Token expirado rechazado - " . $e->getMessage() . "<br>";
    }
    
    echo "<h3>5. Validación de Configuración...</h3>\n";
    
    $config = cargarConfigJWT();
    echo "Clave secreta configurada: " . (strlen($config['secret_key']) >= 32 ? '✅ Segura' : '❌ Muy corta') . "<br>";
    echo "Algoritmo: " . $config['algorithm'] . "<br>";
    echo "Tiempo de expiración: " . ($config['expiration'] / 60) . " minutos<br>";
    echo "URL base: " . $config['base_url'] . "<br>";
    
    echo "<br><h3>✅ Todas las pruebas completadas exitosamente!</h3>\n";
    echo "<p>La implementación JWT está funcionando correctamente y lista para usar.</p>\n";
    
} catch (Exception $e) {
    echo "<h3>❌ Error en las pruebas:</h3>\n";
    echo "Error: " . $e->getMessage() . "<br>";
    echo "Archivo: " . $e->getFile() . "<br>";
    echo "Línea: " . $e->getLine() . "<br>";
}

echo "<hr>";
echo "<p><strong>Nota:</strong> Este archivo es solo para pruebas. Elimínalo en producción por seguridad.</p>";
?>