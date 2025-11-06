<?php
/**
 * Configuración JWT para el sistema de recuperación de contraseña
 */

// Clave secreta para firmar tokens JWT
// IMPORTANTE: Cambiar esta clave en producción por una clave única y segura
define('JWT_SECRET_KEY', 'Los3Tanos_JWT_Secret_Key_2024_SuperSegura_32chars_min');

// Algoritmo de firma
define('JWT_ALGORITHM', 'HS256');

// Tiempo de expiración de tokens en segundos (1 hora = 3600 segundos)
define('JWT_EXPIRATION_TIME', 3600);

// Configuración de correo para recuperación
define('RECOVERY_EMAIL_SUBJECT', 'Recuperación de Contraseña - Los 3 Tanos');
define('RECOVERY_BASE_URL', 'http://localhost/App/Control/RecuperarContrasena/FrontEnd/restablecer.html');

// Configuración de seguridad
define('MAX_RECOVERY_ATTEMPTS_PER_HOUR', 3); // Máximo 3 intentos por hora por email
define('PASSWORD_MIN_LENGTH', 8); // Longitud mínima de contraseña

/**
 * Función helper para cargar la configuración JWT
 */
function cargarConfigJWT() {
    return [
        'secret_key' => JWT_SECRET_KEY,
        'algorithm' => JWT_ALGORITHM,
        'expiration' => JWT_EXPIRATION_TIME,
        'base_url' => RECOVERY_BASE_URL
    ];
}
?>