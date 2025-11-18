<?php
require_once '../../../../Control/Librerias/phpmailer/src/Exception.php';
require_once '../../../../Control/Librerias/phpmailer/src/PHPMailer.php';
require_once '../../../../Control/Librerias/phpmailer/src/SMTP.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

function enviarCorreoFidelizacion($emailDestino, $estado, $pedidos = null) {
  if (!filter_var($emailDestino, FILTER_VALIDATE_EMAIL)) return false;
  try {
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'restaurantel3t@gmail.com';
    $mail->Password = 'tqixgtmeyuxxjead';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;
    $mail->setFrom('restaurantel3t@gmail.com', 'Los 3 Tanos');
    $mail->addAddress($emailDestino);
    $mail->addReplyTo('restaurantel3t@gmail.com','Los 3 Tanos');
    $mail->isHTML(true);
    $mail->Subject = 'Actualización de tu solicitud de fidelización';
    $pedidosTxt = is_null($pedidos) ? '' : '<p>Pedidos registrados: '.htmlspecialchars((string)$pedidos).'</p>';
    $body = '<div style="font-family:Arial,Helvetica,sans-serif">'
      .'<h2>Los 3 Tanos</h2>'
      .'<p>Tu solicitud de fidelización ha sido: <strong>'.htmlspecialchars($estado).'</strong>.</p>'
      .$pedidosTxt
      .($estado==='Aprobada' ? '<p>¡Ya puedes disfrutar de tus promociones especiales como fidelizado!</p>' : '')
      .'<p>Gracias por elegirnos.</p>'
      .'</div>';
    $mail->Body = $body;
    $mail->AltBody = 'Tu solicitud de fidelización ha sido: '.$estado;
    $mail->CharSet = 'UTF-8';
    $mail->Encoding = 'base64';
    return $mail->send();
  } catch (Exception $e) {
    return false;
  }
}
?>