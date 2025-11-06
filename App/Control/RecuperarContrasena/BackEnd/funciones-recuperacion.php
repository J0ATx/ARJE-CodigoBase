<?php

require_once __DIR__ . '/jwt-helper.php';
require_once __DIR__ . '/../../Librerias/phpmailer/src/Exception.php';
require_once __DIR__ . '/../../Librerias/phpmailer/src/PHPMailer.php';
require_once __DIR__ . '/../../Librerias/phpmailer/src/SMTP.php';
require_once __DIR__ . '/../../Conexion/gerente.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;


function verificarUsuarioExiste($email) {
    global $con;
    try {
        if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return false;
        }
        
        $stmt = $con->prepare("SELECT COUNT(*) as count FROM Cliente WHERE cliente_id = ?");
        $stmt->execute([$email]);
        $resultado = $stmt->fetch();
        
        if ($resultado['count'] > 0) {
            logEventoJWT('usuario_verificado', $email, 'Tipo: Cliente');
            return 'Cliente';
        }
        
        
        $stmt = $con->prepare("SELECT COUNT(*) as count FROM Personal WHERE personal_id = ?");
        $stmt->execute([$email]);
        $resultado = $stmt->fetch();
        
        if ($resultado['count'] > 0) {
            logEventoJWT('usuario_verificado', $email, 'Tipo: Personal');
            return 'Personal';
        }
        
        logEventoJWT('usuario_no_encontrado', $email, 'No existe en Cliente ni Personal');
        return false;
        
    } catch (Exception $e) {
        error_log("Error verificando usuario: " . $e->getMessage());
        logEventoJWT('error_verificacion', $email, 'Error: ' . $e->getMessage());
        return false;
    }
}

function obtenerInfoUsuario($email, $tipo) {
    global $con;
    try {
        
        if ($tipo === 'Cliente') {
            $stmt = $con->prepare("SELECT cliente_nombre as nombre, cliente_apellido as apellido FROM Cliente WHERE cliente_id = ?");
        } else {
            $stmt = $con->prepare("SELECT personal_nombre as nombre, personal_apellido as apellido FROM Personal WHERE personal_id = ?");
        }
        
        $stmt->execute([$email]);
        $usuario = $stmt->fetch();
        
        return $usuario ? $usuario : false;
        
    } catch (Exception $e) {
        error_log("Error obteniendo info usuario: " . $e->getMessage());
        return false;
    }
}

function generarContenidoCorreo($email, $token, $infoUsuario = null) {
    
    $enlaceRecuperacion = "https://los3tanos.ddns.net/RecuperarContrase%C3%B1a?token=" . urlencode($token);
    
    
    $saludo = 'Hola';
    if ($infoUsuario && !empty($infoUsuario['nombre'])) {
        $saludo = 'Hola ' . htmlspecialchars($infoUsuario['nombre']);
    }
    
    $asunto = "Recuperación de Contraseña - Los 3 Tanos";
    
    
    $cuerpoHTML = "
    <!DOCTYPE html>
    <html lang='es'>
    <head>
        <meta charset='UTF-8'>
        <meta name='viewport' content='width=device-width, initial-scale=1.0'>
        <title>Recuperación de Contraseña</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #d4a574; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background-color: #d4a574; color: white !important; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
            .button:hover { background-color: #c19660; }
            .warning { background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
            .link-fallback { word-break: break-all; font-size: 12px; color: #666; margin-top: 10px; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1>Los 3 Tanos</h1>
                <p>Recuperación de Contraseña</p>
            </div>
            <div class='content'>
                <p><strong>{$saludo},</strong></p>
                
                <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta en <strong>Los 3 Tanos</strong>.</p>
                
                <p>Para crear una nueva contraseña, haz clic en el siguiente botón:</p>
                
                <div style='text-align: center;'>
                    <a href='{$enlaceRecuperacion}' class='button'>Restablecer Contraseña</a>
                </div>
                
                <div class='warning'>
                    <strong>Importante:</strong>
                    <ul>
                        <li>Este enlace expirará en <strong>1 hora</strong></li>
                        <li>Solo puede ser usado una vez</li>
                        <li>Si no solicitaste este cambio, puedes ignorar este correo</li>
                    </ul>
                </div>
                
                <p>Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
                <div class='link-fallback'>{$enlaceRecuperacion}</div>
                
                <p>Si tienes problemas o no solicitaste este cambio, puedes contactarnos respondiendo a este correo.</p>
                
                <p>Saludos,<br><strong>Equipo de Los 3 Tanos</strong></p>
            </div>
            <div class='footer'>
                <p>Los 3 Tanos - Las Toscas<br>
                M. Ferreira y Central | Tel: 43729333<br>
                WhatsApp: 092412772</p>
            </div>
        </div>
    </body>
    </html>";
    
    
    $cuerpoTexto = "
RECUPERACIÓN DE CONTRASEÑA - LOS 3 TANOS
========================================

{$saludo},

Recibimos una solicitud para restablecer la contraseña de tu cuenta en Los 3 Tanos.

Para crear una nueva contraseña, copia y pega este enlace en tu navegador:
{$enlaceRecuperacion}

IMPORTANTE:
- Este enlace expirará en 1 hora
- Solo puede ser usado una vez
- Si no solicitaste este cambio, puedes ignorar este correo

Si tienes problemas, puedes contactarnos respondiendo a este correo.

Saludos,
Equipo de Los 3 Tanos

---
Los 3 Tanos - Las Toscas
M. Ferreira y Central | Tel: 43729333
WhatsApp: 092412772
";
    
    return [
        'asunto' => $asunto,
        'html' => $cuerpoHTML,
        'texto' => trim($cuerpoTexto)
    ];
}

function enviarCorreoRecuperacion($emailDestino, $token, $tipoUsuario) {
    try {
        if (empty($emailDestino) || empty($token) || empty($tipoUsuario)) {
            throw new Exception('Parámetros requeridos faltantes');
        }
        
        if (!filter_var($emailDestino, FILTER_VALIDATE_EMAIL)) {
            throw new Exception('Email de destino inválido');
        }
        
        
        $infoUsuario = obtenerInfoUsuario($emailDestino, $tipoUsuario);
        
        
        $contenido = generarContenidoCorreo($emailDestino, $token, $infoUsuario);
        
        
        $mail = new PHPMailer(true);
        
        
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'restaurantel3t@gmail.com';
        $mail->Password = 'tqixgtmeyuxxjead';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;
        
        
        $mail->setFrom('restaurantel3t@gmail.com', 'Los 3 Tanos - Sistema de Recuperación');
        $mail->addAddress($emailDestino);
        $mail->addReplyTo('restaurantel3t@gmail.com', 'Los 3 Tanos');
        
        
        $mail->isHTML(true);
        $mail->Subject = $contenido['asunto'];
        $mail->Body = $contenido['html'];
        $mail->AltBody = $contenido['texto'];
        
        
        $mail->CharSet = 'UTF-8';
        $mail->Encoding = 'base64';
        
        
        $resultado = $mail->send();
        
        if ($resultado) {
            logEventoJWT('correo_enviado', $emailDestino, "Tipo: {$tipoUsuario}, Token generado");
            return true;
        } else {
            logEventoJWT('error_envio', $emailDestino, "Error PHPMailer: " . $mail->ErrorInfo);
            return false;
        }
        
    } catch (Exception $e) {
        error_log("Error enviando correo de recuperación: " . $e->getMessage());
        logEventoJWT('error_envio', $emailDestino ?? 'unknown', "Error: " . $e->getMessage());
        return false;
    }
}

function procesarSolicitudRecuperacion($email) {
    try {
        if (empty($email)) {
            return [
                'exito' => false,
                'mensaje' => 'El email es requerido',
                'codigo' => 400
            ];
        }
        
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return [
                'exito' => false,
                'mensaje' => 'El formato del email no es válido',
                'codigo' => 400
            ];
        }
        
        
        $tipoUsuario = verificarUsuarioExiste($email);
        
        
        $mensajeGenerico = 'Si el correo electrónico está registrado en nuestro sistema, recibirás un enlace de recuperación en los próximos minutos.';
        
        if ($tipoUsuario === false) {
            logEventoJWT('solicitud_email_inexistente', $email, 'Email no encontrado en sistema');
            return [
                'exito' => true,
                'mensaje' => $mensajeGenerico,
                'codigo' => 200
            ];
        }
        
        
        $token = generarTokenJWT($email, $tipoUsuario);
        
        if (!$token) {
            logEventoJWT('error_generacion_token', $email, 'Fallo generando token JWT');
            return [
                'exito' => false,
                'mensaje' => 'Error interno del servidor',
                'codigo' => 500
            ];
        }
        
        
        $correoEnviado = enviarCorreoRecuperacion($email, $token, $tipoUsuario);
        
        if (!$correoEnviado) {
            return [
                'exito' => false,
                'mensaje' => 'Error enviando el correo. Por favor, inténtalo nuevamente.',
                'codigo' => 500
            ];
        }
        
        return [
            'exito' => true,
            'mensaje' => $mensajeGenerico,
            'codigo' => 200
        ];
        
    } catch (Exception $e) {
        error_log("Error procesando solicitud de recuperación: " . $e->getMessage());
        logEventoJWT('error_procesamiento', $email ?? 'unknown', 'Error: ' . $e->getMessage());
        
        return [
            'exito' => false,
            'mensaje' => 'Error interno del servidor',
            'codigo' => 500
        ];
    }
}

function validarTokenRecuperacion($token) {
    try {
        if (empty($token)) {
            return [
                'valido' => false,
                'mensaje' => 'Token no proporcionado',
                'codigo' => 400
            ];
        }
        
        
        $datosToken = validarTokenJWT($token);
        
        if ($datosToken === false) {
            $infoToken = obtenerInfoToken($token);
            
            if ($infoToken && $infoToken['expirado']) {
                logEventoJWT('token_expirado', $infoToken['email'] ?? 'unknown', 'Token expirado usado');
                return [
                    'valido' => false,
                    'mensaje' => 'El enlace ha expirado. Solicita un nuevo enlace de recuperación.',
                    'codigo' => 410,
                    'expirado' => true
                ];
            }
            
            logEventoJWT('token_invalido', 'unknown', 'Token malformado o inválido');
            return [
                'valido' => false,
                'mensaje' => 'El enlace de recuperación no es válido.',
                'codigo' => 400
            ];
        }
        
        
        $tipoUsuario = verificarUsuarioExiste($datosToken['email']);
        
        if ($tipoUsuario === false || $tipoUsuario !== $datosToken['tipo']) {
            logEventoJWT('usuario_no_existe_validacion', $datosToken['email'], 'Usuario eliminado después de generar token');
            return [
                'valido' => false,
                'mensaje' => 'El usuario asociado a este enlace ya no existe.',
                'codigo' => 404
            ];
        }
        
        logEventoJWT('token_validado_exitoso', $datosToken['email'], "Tipo: {$datosToken['tipo']}");
        
        return [
            'valido' => true,
            'email' => $datosToken['email'],
            'tipo' => $datosToken['tipo'],
            'mensaje' => 'Token válido',
            'codigo' => 200
        ];
        
    } catch (Exception $e) {
        error_log("Error validando token de recuperación: " . $e->getMessage());
        logEventoJWT('error_validacion_token', 'unknown', 'Error: ' . $e->getMessage());
        
        return [
            'valido' => false,
            'mensaje' => 'Error interno validando el enlace',
            'codigo' => 500
        ];
    }
}

function actualizarContrasena($email, $nuevaContrasena, $tipo) {
    try {
        if (empty($email) || empty($nuevaContrasena) || empty($tipo)) {
            throw new Exception('Todos los parámetros son requeridos');
        }
        
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new Exception('Email inválido');
        }
        
        if (!in_array($tipo, ['Cliente', 'Personal'])) {
            throw new Exception('Tipo de usuario inválido');
        }
        
        
        if (strlen($nuevaContrasena) < 8) {
            throw new Exception('La contraseña debe tener al menos 8 caracteres');
        }
        
        
        $contrasenaHash = password_hash($nuevaContrasena, PASSWORD_DEFAULT);
        
        if (!$contrasenaHash) {
            throw new Exception('Error hasheando la contraseña');
        }
        
        global $con;
        
        
        if ($tipo === 'Cliente') {
            $sql = "UPDATE Cliente SET cliente_contrasenia = ? WHERE cliente_id = ?";
        } else {
            $sql = "UPDATE Personal SET personal_contrasenia = ? WHERE personal_id = ?";
        }
        
        
        $stmt = $con->prepare($sql);
        $resultado = $stmt->execute([$contrasenaHash, $email]);
        
        if (!$resultado) {
            throw new Exception('Error ejecutando la actualización');
        }
        
        
        $filasAfectadas = $stmt->rowCount();
        
        if ($filasAfectadas === 0) {
            logEventoJWT('actualizacion_sin_filas', $email, "Tipo: {$tipo} - Usuario no encontrado");
            return false;
        }
        
        logEventoJWT('contrasena_actualizada', $email, "Tipo: {$tipo} - Actualización exitosa");
        return true;
        
    } catch (Exception $e) {
        error_log("Error actualizando contraseña: " . $e->getMessage());
        logEventoJWT('error_actualizacion', $email ?? 'unknown', 'Error: ' . $e->getMessage());
        return false;
    }
}
?>