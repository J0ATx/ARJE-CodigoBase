<?php
    // Obtener el código de error original que Apache proporcionó
    $error_code = getenv('REDIRECT_STATUS'); 

    // Si no se encuentra un código de Apache, asumimos un error general (500) o un 404
    if (empty($error_code)) {
        // Podrías intentar obtenerlo de $_SERVER['REDIRECT_STATUS'] si getenv falla, 
        // pero getenv('REDIRECT_STATUS') es la forma más común en Apache.
        $error_code = 500; 
    }

    // El destino de la redirección es tu archivo HTML más el código de error como parámetro.
    // Esto asegura que la URL del navegador cambie a error.html?code=404
    $redirect_url = '/App/error.html?code=' . urlencode($error_code);

    // Realizar la redirección HTTP 302 (Temporal)
    // Esto asegura que el cliente (navegador) vaya a la nueva URL y que JavaScript pueda leer el parámetro.
    header('Location: ' . $redirect_url, true, 302);
    exit;
?>