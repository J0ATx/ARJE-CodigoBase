<?php
/**
 * Helper class para el sistema de recuperación de contraseña con JWT
 */

require_once 'JWT.php';
require_once 'config.php';

class RecuperacionHelper {
    
    private $pdo;
    private $config;
    
    public function __construct($pdo) {
        $this->pdo = $pdo;
        $this->config = cargarConfigJWT();
    }
    
    /**
     * Verifica si un email existe en el sistema y retorna el tipo de usuario
     * 
     * @param string $email El email a verificar
     * @return string|false 'Cliente', 'Personal' o false si no existe
     */
    public function verificarUsuarioExiste($email) {
        try {
            // Verificar en tabla Cliente
            $stmt = $this->pdo->prepare("SELECT COUNT(*) FROM Cliente WHERE cliente_id = ?");
            $stmt->execute([$email]);
            if ($stmt->fetchColumn() > 0) {
                return 'Cliente';
            }
            
            // Verificar en tabla Personal
            $stmt = $this->pdo->prepare("SELECT COUNT(*) FROM Personal WHERE personal_id = ?");
            $stmt->execute([$email]);
            if ($stmt->fetchColumn() > 0) {
                return 'Personal';
            }
            
            return false;
        } catch (Exception $e) {
            error_log("Error verificando usuario: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Genera un token JWT para recuperación de contraseña
     * 
     * @param string $email El email del usuario
     * @param string $tipo El tipo de usuario ('Cliente' o 'Personal')
     * @return string El token JWT generado
     */
    public function generarTokenRecuperacion($email, $tipo) {
        $payload = JWT::crearPayloadRecuperacion($email, $tipo, $this->config['expiration']);
        return JWT::encode($payload, $this->config['secret_key'], $this->config['algorithm']);
    }
    
    /**
     * Valida un token JWT de recuperación
     * 
     * @param string $token El token JWT a validar
     * @return object|false Los datos del token si es válido, false si no
     */
    public function validarTokenRecuperacion($token) {
        try {
            $payload = JWT::decode($token, $this->config['secret_key'], $this->config['algorithm']);
            
            // Verificar que sea específicamente para recuperación
            if (!JWT::esTokenRecuperacion($payload)) {
                return false;
            }
            
            return $payload;
        } catch (Exception $e) {
            error_log("Error validando token JWT: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Actualiza la contraseña de un usuario
     * 
     * @param string $email El email del usuario
     * @param string $nuevaContrasena La nueva contraseña en texto plano
     * @param string $tipo El tipo de usuario ('Cliente' o 'Personal')
     * @return bool True si se actualizó correctamente, false si no
     */
    public function actualizarContrasena($email, $nuevaContrasena, $tipo) {
        try {
            // Validar longitud mínima
            if (strlen($nuevaContrasena) < PASSWORD_MIN_LENGTH) {
                return false;
            }
            
            // Hashear la contraseña
            $contrasenaHash = password_hash($nuevaContrasena, PASSWORD_DEFAULT);
            
            // Actualizar según el tipo de usuario
            if ($tipo === 'Cliente') {
                $sql = "UPDATE Cliente SET cliente_contrasenia = ? WHERE cliente_id = ?";
            } elseif ($tipo === 'Personal') {
                $sql = "UPDATE Personal SET personal_contrasenia = ? WHERE personal_id = ?";
            } else {
                return false;
            }
            
            $stmt = $this->pdo->prepare($sql);
            return $stmt->execute([$contrasenaHash, $email]);
            
        } catch (Exception $e) {
            error_log("Error actualizando contraseña: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Envía un correo de recuperación usando PHPMailer
     * 
     * @param string $email El email del destinatario
     * @param string $token El token JWT para incluir en el enlace
     * @return bool True si se envió correctamente, false si no
     */
    public function enviarCorreoRecuperacion($email, $token) {
        try {
            // Incluir PHPMailer
            require_once '../Librerias/phpmailer/src/Exception.php';
            require_once '../Librerias/phpmailer/src/PHPMailer.php';
            require_once '../Librerias/phpmailer/src/SMTP.php';
            
            use PHPMailer\PHPMailer\PHPMailer;
            use PHPMailer\PHPMailer\Exception;
            
            $mail = new PHPMailer(true);
            
            // Configuración SMTP (reutilizar configuración existente)
            $mail->isSMTP();
            $mail->Host = 'smtp.gmail.com';
            $mail->SMTPAuth = true;
            $mail->Username = 'restaurantel3t@gmail.com';
            $mail->Password = 'tqixgtmeyuxxjead';
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port = 587;
            
            // Configuración del correo
            $mail->setFrom('restaurantel3t@gmail.com', 'Los 3 Tanos');
            $mail->addAddress($email);
            
            // Generar enlace de recuperación
            $enlaceRecuperacion = $this->config['base_url'] . '?token=' . urlencode($token);
            
            // Contenido del correo
            $mail->isHTML(true);
            $mail->Subject = RECOVERY_EMAIL_SUBJECT;
            
            $mail->Body = $this->generarPlantillaHTML($enlaceRecuperacion);
            $mail->AltBody = $this->generarPlantillaTexto($enlaceRecuperacion);
            
            $mail->send();
            return true;
            
        } catch (Exception $e) {
            error_log("Error enviando correo de recuperación: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Genera la plantilla HTML para el correo de recuperación
     * 
     * @param string $enlace El enlace de recuperación
     * @return string El HTML del correo
     */
    private function generarPlantillaHTML($enlace) {
        return "
        <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;'>
            <div style='text-align: center; margin-bottom: 30px;'>
                <h1 style='color: #d4a574; margin: 0;'>Los 3 Tanos</h1>
                <p style='color: #666; margin: 5px 0;'>Restaurante - Las Toscas</p>
            </div>
            
            <div style='background-color: #f9f9f9; padding: 30px; border-radius: 10px;'>
                <h2 style='color: #333; margin-top: 0;'>Recuperación de Contraseña</h2>
                
                <p style='color: #555; line-height: 1.6;'>Hola,</p>
                
                <p style='color: #555; line-height: 1.6;'>
                    Recibimos una solicitud para restablecer la contraseña de tu cuenta en Los 3 Tanos.
                </p>
                
                <p style='color: #555; line-height: 1.6;'>
                    Haz clic en el siguiente botón para crear una nueva contraseña:
                </p>
                
                <div style='text-align: center; margin: 30px 0;'>
                    <a href='{$enlace}' style='
                        background-color: #d4a574; 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 5px; 
                        font-weight: bold;
                        display: inline-block;
                    '>Restablecer Contraseña</a>
                </div>
                
                <div style='background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;'>
                    <p style='margin: 0; color: #856404; font-weight: bold;'>⚠️ Importante:</p>
                    <p style='margin: 5px 0 0 0; color: #856404;'>Este enlace expirará en 1 hora por seguridad.</p>
                </div>
                
                <p style='color: #555; line-height: 1.6;'>
                    Si no solicitaste este cambio, puedes ignorar este correo de forma segura.
                </p>
                
                <p style='color: #555; line-height: 1.6;'>
                    Si tienes problemas con el botón, copia y pega este enlace en tu navegador:
                </p>
                <p style='word-break: break-all; color: #666; font-size: 12px;'>{$enlace}</p>
            </div>
            
            <div style='text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;'>
                <p style='color: #999; font-size: 12px; margin: 0;'>
                    Los 3 Tanos - M. Ferreira y Central, Las Toscas<br>
                    Tel: 43729333 | WhatsApp: 092412772
                </p>
            </div>
        </div>";
    }
    
    /**
     * Genera la plantilla de texto plano para el correo
     * 
     * @param string $enlace El enlace de recuperación
     * @return string El texto plano del correo
     */
    private function generarPlantillaTexto($enlace) {
        return "
LOS 3 TANOS - RECUPERACIÓN DE CONTRASEÑA

Hola,

Recibimos una solicitud para restablecer la contraseña de tu cuenta en Los 3 Tanos.

Copia y pega este enlace en tu navegador para crear una nueva contraseña:
{$enlace}

IMPORTANTE: Este enlace expirará en 1 hora por seguridad.

Si no solicitaste este cambio, puedes ignorar este correo de forma segura.

---
Los 3 Tanos
M. Ferreira y Central, Las Toscas
Tel: 43729333 | WhatsApp: 092412772
        ";
    }
    
    /**
     * Valida el formato de un email
     * 
     * @param string $email El email a validar
     * @return bool True si es válido, false si no
     */
    public function validarEmail($email) {
        return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
    }
    
    /**
     * Valida que una contraseña cumpla los requisitos mínimos
     * 
     * @param string $contrasena La contraseña a validar
     * @return array Array con 'valida' (bool) y 'errores' (array)
     */
    public function validarContrasena($contrasena) {
        $errores = [];
        
        if (strlen($contrasena) < PASSWORD_MIN_LENGTH) {
            $errores[] = "La contraseña debe tener al menos " . PASSWORD_MIN_LENGTH . " caracteres";
        }
        
        if (!preg_match('/[A-Z]/', $contrasena)) {
            $errores[] = "La contraseña debe contener al menos una letra mayúscula";
        }
        
        if (!preg_match('/[a-z]/', $contrasena)) {
            $errores[] = "La contraseña debe contener al menos una letra minúscula";
        }
        
        if (!preg_match('/[0-9]/', $contrasena)) {
            $errores[] = "La contraseña debe contener al menos un número";
        }
        
        return [
            'valida' => empty($errores),
            'errores' => $errores
        ];
    }
}
?>