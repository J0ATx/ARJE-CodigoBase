<?php
// Configuración
header('Content-Type: application/json');
$ollama_ip = "[TU_IP_DEL_PC]"; // ¡CAMBIA ESTO!
$ollama_port = "11434";
$ollama_model = "gemma:2b";
$ollama_url = "http://$ollama_ip:$ollama_port/api/generate";

// --- 1. Base de Conocimiento Estática ---
$knowledge_base = "
**INFORMACIÓN DEL PRODUCTO A UTILIZAR:**
- Nombre oficial: Gemma 3.
- Creador: Google DeepMind.
- Versiones: 2B (2 mil millones de parámetros) y 7B.
- Uso principal: RAG local, desarrollo de chatbots.
- Puerto Ollama: 11434.
- Recomendación de uso: Usar siempre Open WebUI para la interfaz RAG.
---
**INFORMACIÓN DE CONTACTO:**
- Soporte: correo@ejemplo.com
- Horario de soporte: 9:00 a 17:00 (GMT-3).
";

// --- 2. Obtener la Pregunta del Usuario ---
$input = json_decode(file_get_contents('php://input'), true);
$user_query = $input['query'] ?? '';

if (empty($user_query)) {
    http_response_code(400);
    echo json_encode(["error" => "No se recibió ninguna consulta."]);
    exit;
}

// --- 3. Construir el Prompt Enriquecido (Pseudo-RAG) ---
$system_instruction = "Usa la información proporcionada en la sección 'CONTEXTO DE CONOCIMIENTO' para responder a la pregunta del usuario. Si la respuesta no se encuentra en el CONTEXTO, responde que no tienes información específica sobre ese tema. No inventes respuestas.";

$final_prompt = 
    $system_instruction . "\n\n" .
    "CONTEXTO DE CONOCIMIENTO:\n" . $knowledge_base . "\n\n" . 
    "PREGUNTA DEL USUARIO: " . $user_query;

// --- 4. Preparar la Petición a Ollama ---
$data = [
    'model' => $ollama_model,
    'prompt' => $final_prompt,
    'stream' => false
];

$options = [
    'http' => [
        'header'  => "Content-Type: application/json\r\n",
        'method'  => 'POST',
        'content' => json_encode($data),
        'timeout' => 60, // Tiempo de espera en segundos para la respuesta de Ollama
    ],
];
$context  = stream_context_create($options);

// --- 5. Llamar a la API de Ollama ---
$result = @file_get_contents($ollama_url, false, $context);

if ($result === FALSE) {
    http_response_code(503);
    echo json_encode(["error" => "Error al conectar con la API de Ollama. Asegúrate de que esté corriendo en $ollama_ip:$ollama_port."]);
} else {
    // Ollama devuelve JSON, lo parseamos y extraemos la respuesta
    $ollama_response = json_decode($result, true);
    
    // Devolvemos solo la respuesta generada por el modelo
    $model_response = $ollama_response['response'] ?? 'Respuesta del modelo no encontrada.';
    echo json_encode(["response" => $model_response]);
}

?>