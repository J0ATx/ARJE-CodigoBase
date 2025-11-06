<?php
// Sustituye la línea de Composer por las llamadas manuales a los archivos clave
// Asumiendo que has copiado la carpeta 'src' de PHPMailer a una carpeta 'phpmailer/' en tu proyecto
require 'Control/Librerias/phpmailer/src/Exception.php';
require 'Control/Librerias/phpmailer/src/PHPMailer.php';
require 'Control/Librerias/phpmailer/src/SMTP.php';

// Ahora puedes declarar los namespaces
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
// ... y el resto del código es idéntico al ejemplo anterior ... 
// Crear una instancia; pasar `true` habilita las excepciones
$mail = new PHPMailer(true);

// ... el resto de la configuración SMTP y el envío es IGUAL ... 
try {
    // Configuración del Servidor (Importante para la seguridad SSL/TLS)
    $mail->isSMTP();                                       // Habilitar el envío SMTP
    $mail->Host       = 'smtp.gmail.com';                // Servidor SMTP (ej: smtp.gmail.com, o el de tu host)
    $mail->SMTPAuth   = true;                              // Habilitar autenticación SMTP
    $mail->Username   = 'restaurantel3t@gmail.com';            // Nombre de usuario SMTP (tu dirección de correo)
    $mail->Password   = 'tqixgtmeyuxxjead';     // Contraseña de tu correo (o contraseña de aplicación)
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;     // **Habilitar cifrado TLS**
    $mail->Port       = 587;                               // El puerto TCP para TLS

    // Si tu host insiste en usar SSL antiguo, podrías usar:
    // $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS; 
    // $mail->Port       = 465;

    // --- Configuración del Correo ---
    $mail->setFrom('restaurantel3t@gmail.com', 'Tu Aplicación Web');
    $mail->addAddress('joaquincasadei4@gmail.com', 'Joaquin');    // Agregar destinatario

    // Contenido del Email (para restablecimiento de contraseña)
    $mail->isHTML(true);                                  // Establecer formato de email a HTML
    $mail->Subject = 'Restablecimiento de Contraseña';

    // El cuerpo del correo debe incluir un enlace seguro (HTTPS) con un token único
    $token = 'un_token_unico_generado_por_tu_app';
    $resetLink = "https://tudominio.com/reset_password.php?token=" . $token;

    $mail->Body    = 'Hola,<br><br>Haz clic en el siguiente enlace para restablecer tu contraseña:<br><a href="' . $resetLink . '">' . $resetLink . '</a>';
    $mail->AltBody = 'Copia y pega este enlace para restablecer tu contraseña: ' . $resetLink; // Versión de texto plano

    // Poner a 2 para ver mensajes de depuración detallados.
    // Usa 3 o 4 para incluso más detalle si 2 no es suficiente.
    $mail->SMTPDebug = 2;

    // Formatear la salida de depuración (opcional, pero útil)
    $mail->Debugoutput = 'html';

    $mail->send();
    echo 'El mensaje ha sido enviado';
} catch (Exception $e) {
    echo "El mensaje no pudo ser enviado. Error de PHPMailer: {$mail->ErrorInfo}";
}
