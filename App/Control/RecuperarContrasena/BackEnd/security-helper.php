<?php
function verificarRateLimit($email, $accion = 'solicitud') {
    try {
        $archivoLimites = __DIR__ . '/rate_limits.json';
        $tiempoActual = time();
        $ventanaTiempo = 3600;
        $maxIntentos = 5;
        
        $limites = [];
        if (file_exists($archivoLimites)) {
            $contenido = file_get_contents($archivoLimites);
            $limites = json_decode($contenido, true) ?: [];
        }
        
        foreach ($limites as $emailKey => $datos) {
            $limites[$emailKey]['intentos'] = array_filter(
                $datos['intentos'], 
                function($timestamp) use ($tiempoActual, $ventanaTiempo) {
                    return ($tiempoActual - $timestamp) < $ventanaTiempo;
                }
            );
            
            if (empty($limites[$emailKey]['intentos'])) {
                unset($limites[$emailKey]);
            }
        }
        
        $emailHash = hash('sha256', strtolower($email));
        
        if (!isset($limites[$emailHash])) {
            $limites[$emailHash] = ['intentos' => []];
        }
        
        $intentosRecientes = count($limites[$emailHash]['intentos']);
        
        if ($intentosRecientes >= $maxIntentos) {
            $intentoMasAntiguo = min($limites[$emailHash]['intentos']);
            $tiempoRestante = $ventanaTiempo - ($tiempoActual - $intentoMasAntiguo);
            $minutosRestantes = ceil($tiempoRestante / 60);
            
            return [
                'permitido' => false,
                'mensaje' => "Demasiados intentos. Inténtalo nuevamente en {$minutosRestantes} minutos.",
                'tiempo_restante' => $tiempoRestante
            ];
        }
        
        $limites[$emailHash]['intentos'][] = $tiempoActual;
        file_put_contents($archivoLimites, json_encode($limites));
        
        return [
            'permitido' => true,
            'mensaje' => 'Límite verificado correctamente'
        ];
        
    } catch (Exception $e) {
        error_log("Error en rate limiting: " . $e->getMessage());
        return [
            'permitido' => true,
            'mensaje' => 'Verificación no disponible'
        ];
    }
}
?>
