<?php

header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');

error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
require_once __DIR__ . '/funciones-recuperacion.php';
require_once __DIR__ . '/jwt-helper.php';

function mostrarError($mensaje, $codigo = 400, $mostrarEnlace = true) {
    http_response_code($codigo);
    
    
    if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && $_SERVER['HTTP_X_REQUESTED_WITH'] === 'XMLHttpRequest') {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode([
            'exito' => false,
            'mensaje' => $mensaje,
            'codigo' => $codigo,
            'datos' => [
                'mostrar_enlace' => $mostrarEnlace,
                'token_valido' => false
            ]
        ]);
        exit;
    }
    
    
    $enlaceSolicitar = $mostrarEnlace ? 
        '<p><a href="../FrontEnd/index.html" class="btn-solicitar">Solicitar nuevo enlace</a></p>' : '';
    
    $tipoError = '';
    $iconoError = '⚠️';
    
    switch ($codigo) {
        case 410:
            $tipoError = 'Enlace Expirado';
            $iconoError = '⏰';
            break;
        case 404:
            $tipoError = 'Usuario No Encontrado';
            $iconoError = '👤';
            break;
        case 400:
        default:
            $tipoError = 'Enlace Inválido';
            $iconoError = '⚠️';
            break;
    }
    
    echo "<!DOCTYPE html>
<html lang='es'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>Error - Los 3 Tanos</title>
    <link rel='stylesheet' href='../FrontEnd/styles.css'>
    <link href='https://fonts.googleapis.com/css?family=Poppins' rel='stylesheet'>
    <link rel='icon' type='image/png' sizes='32x32' href='../../../Recursos/favicon.ico'>
    <style>
        .error-container {
            max-width: 500px;
            margin: 50px auto;
            padding: 30px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            text-align: center;
        }
        .error-icon {
            font-size: 4rem;
            margin-bottom: 20px;
        }
        .error-title {
            color: #d32f2f;
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 15px;
        }
        .error-message {
            color: #666;
            font-size: 1rem;
            line-height: 1.5;
            margin-bottom: 25px;
        }
        .btn-solicitar {
            display: inline-block;
            background-color: #d4a574;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 500;
            transition: background-color 0.3s;
            margin: 10px;
        }
        .btn-solicitar:hover {
            background-color: #c19660;
        }
        .btn-signin {
            display: inline-block;
            background-color: #f5f5f5;
            color: #333;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 500;
            transition: background-color 0.3s;
            margin: 10px;
        }
        .btn-signin:hover {
            background-color: #e0e0e0;
        }
        .logo {
            width: 80px;
            height: 80px;
            margin: 0 auto 20px;
        }
    </style>
</head>
<body>
    <div class='decoration-bg'></div>
    <div class='texture-bg'></div>
    <div class='smoke-bg'></div>
    <div class='container'>
        <div class='error-container'>
            <div class='logo'>
                <img src='../../../Recursos/logo.svg' alt='Los 3 Tanos' style='width: 100%; height: 100%;'>
            </div>
            <div class='error-icon'>{$iconoError}</div>
            <h1 class='error-title'>{$tipoError}</h1>
            <p class='error-message'>{$mensaje}</p>
            {$enlaceSolicitar}
            <p><a href='/App/Control/SignIn/FrontEnd/index.html' class='btn-signin'>Volver al inicio de sesión</a></p>
        </div>
    </div>
</body>
</html>";
    exit;
}

function mostrarFormularioRestablecimiento($token, $datosUsuario) {
    $urlFormulario = "../FrontEnd/restablecer.html?token=" . urlencode($token);
    
    
    echo "<!DOCTYPE html>
<html lang='es'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>Redirigiendo... - Los 3 Tanos</title>
    <link rel='icon' type='image/png' sizes='32x32' href='../../../Recursos/favicon.ico'>
    <style>
        body {
            font-family: 'Poppins', Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #d4a574 0%, #c19660 100%);
        }
        .loading-container {
            text-align: center;
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #d4a574;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .loading-text {
            color: #666;
            font-size: 1rem;
        }
    </style>
</head>
<body>
    <div class='loading-container'>
        <div class='spinner'></div>
        <p class='loading-text'>Validando enlace...</p>
        <p style='font-size: 0.9rem; color: #999;'>Serás redirigido automáticamente</p>
    </div>
    
    <script>
        sessionStorage.setItem('resetUserData', JSON.stringify({
            email: '" . htmlspecialchars($datosUsuario['email'], ENT_QUOTES, 'UTF-8') . "',
            tipo: '" . htmlspecialchars($datosUsuario['tipo'], ENT_QUOTES, 'UTF-8') . "',
            tokenValidado: true
        }));
        
        
        setTimeout(function() {
            window.location.href = '{$urlFormulario}';
        }, 1500);
        
        
        if (!window.location.href.includes('restablecer.html')) {
            window.location.href = '{$urlFormulario}';
        }
    </script>
    
    <noscript>
        <meta http-equiv='refresh' content='0; url={$urlFormulario}'>
    </noscript>
</body>
</html>";
    exit;
}

function procesarValidacionToken() {
    try {
        $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
        
        
        $token = $_GET['token'] ?? '';
        
        
        if (empty($token)) {
            logEventoJWT('validacion_sin_token', 'unknown', 'No se proporcionó token en URL');
            mostrarError(
                'No se proporcionó un enlace de recuperación válido. Por favor, verifica el enlace en tu correo electrónico.',
                400,
                true
            );
        }
        
        
        $token = trim($token);
        $token = urldecode($token);
        
        
        $resultadoValidacion = validarTokenRecuperacion($token);
        
        
        if (!$resultadoValidacion['valido']) {
            $codigo = $resultadoValidacion['codigo'] ?? 400;
            $mensaje = $resultadoValidacion['mensaje'] ?? 'El enlace de recuperación no es válido.';
            $mostrarEnlace = !isset($resultadoValidacion['codigo']) || $resultadoValidacion['codigo'] !== 404;
            
            mostrarError($mensaje, $codigo, $mostrarEnlace);
        }
        
        
        $datosUsuario = [
            'email' => $resultadoValidacion['email'],
            'tipo' => $resultadoValidacion['tipo']
        ];
        
        
        logEventoJWT('validacion_exitosa', $datosUsuario['email'], "Tipo: {$datosUsuario['tipo']} | IP: {$ip}");
        
        
        if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && $_SERVER['HTTP_X_REQUESTED_WITH'] === 'XMLHttpRequest') {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'exito' => true,
                'mensaje' => 'Token válido',
                'codigo' => 200,
                'datos' => [
                    'email' => $datosUsuario['email'],
                    'tipo' => $datosUsuario['tipo'],
                    'token_valido' => true
                ]
            ]);
        } else {
            mostrarFormularioRestablecimiento($token, $datosUsuario);
        }
        
    } catch (Exception $e) {
        error_log("Error crítico en validación de token: " . $e->getMessage());
        logEventoJWT('error_critico_validacion', 'unknown', 'Error: ' . $e->getMessage());
        
        mostrarError(
            'Ocurrió un error interno al procesar tu solicitud. Por favor, inténtalo nuevamente.',
            500,
            true
        );
    }
}
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    header('Allow: GET');
    mostrarError('Método no permitido. Este enlace debe abrirse en un navegador web.', 405, false);
}
procesarValidacionToken();
?>