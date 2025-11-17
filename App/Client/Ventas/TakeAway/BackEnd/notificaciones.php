<?php
require_once '../../../../../Control/Librerias/phpmailer/src/Exception.php';
require_once '../../../../../Control/Librerias/phpmailer/src/PHPMailer.php';
require_once '../../../../../Control/Librerias/phpmailer/src/SMTP.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

function enviarPedidoListo($emailDestino, $pedidoId) {
  if (!filter_var($emailDestino, FILTER_VALIDATE_EMAIL)) return false;
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
  $mail->Subject = 'Tu pedido está listo';
  $body = '<div style="font-family:Arial,Helvetica,sans-serif"><h2>Los 3 Tanos</h2><p>Tu pedido #'.htmlspecialchars((string)$pedidoId).' está listo para retirar.</p><p>Acércate al local y presenta este número.</p></div>';
  $mail->Body = $body;
  $mail->AltBody = 'Tu pedido #'.$pedidoId.' está listo para retirar.';
  $mail->CharSet = 'UTF-8';
  $mail->Encoding = 'base64';
  return $mail->send();
}