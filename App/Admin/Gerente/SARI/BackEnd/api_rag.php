<?php
// --- api_rag.php ACTUALIZADO (Versión con Contexto Combinado) ---

// Configuración
header('Content-Type: application/json');
$ollama_ip = "127.0.0.1"; // ¡CAMBIA ESTO!
$ollama_port = "11434";
$ollama_model = "gemma3:4b";
$ollama_url = "http://$ollama_ip:$ollama_port/api/generate";

// --- 1. Base de Conocimiento Estática ---
$knowledge_base_static = "
Categoría: Horarios, Contacto y Ubicación
... (Aquí va toda tu base de conocimiento estática del restaurante) ...
P: ¿La propina es obligatoria?
R: La propina no es obligatoria y queda a criterio del cliente. Para grupos grandes (más de 8 personas) sugerimos un 10% por el servicio adicional, pero siempre es opcional.
";


// --- 2. Obtener la Pregunta y el Contexto del Usuario ---
$input = json_decode(file_get_contents('php://input'), true);
$user_query = $input['query'] ?? '';
$user_context = $input['context'] ?? ''; // Recibimos el texto del PDF

if (empty($user_query)) {
    http_response_code(400);
    echo json_encode(["error" => "No se recibió ninguna consulta."]);
    exit;
}

// --- 3. Construir el Contexto Combinado ---
// --- MODIFICACIÓN CLAVE ---

// 3.1. Siempre incluimos la base de conocimiento estática.
$final_context = "--- INICIO BASE DE CONOCIMIENTO (Restaurante) ---\n" . 
                 $knowledge_base_static . 
                 "\n--- FIN BASE DE CONOCIMIENTO ---\n\n";

$placeholder_text = 'Aquí aparecerá el texto extraído del PDF.';

// 3.2. Si el contexto del usuario (PDF) existe y no es el placeholder, lo añadimos.
if (!empty(trim($user_context)) && trim($user_context) !== $placeholder_text) {
    $final_context .= "--- INICIO CONTEXTO PDF ADJUNTO ---\n" . 
                      $user_context . 
                      "\n--- FIN CONTEXTO PDF ---";
}
// --- FIN MODIFICACIÓN CLAVE ---


// --- 4. Construir el Prompt Enriquecido (Pseudo-RAG) ---
// --- MODIFICACIÓN CLAVE (Instrucción del Sistema Mejorada) ---
$system_instruction = "Eres un asistente de IA. Tu tarea es responder la PREGUNTA DEL USUARIO.
El CONTEXTO DE CONOCIMIENTO que te proporciono puede tener dos partes:

1.  'BASE DE CONOCIMIENTO (Restaurante)': Información fija sobre un restaurante.
2.  'CONTEXTO PDF ADJUNTO': Información de un documento subido por el usuario (si existe).

Prioriza tu respuesta:
-   Si la pregunta parece referirse al documento subido (ej. 'resume este texto', 'qué dice el PDF sobre X'), usa *prioritariamente* el 'CONTEXTO PDF ADJUNTO'.
-   Si la pregunta es sobre el restaurante (ej. 'horarios', 'menú', 'promociones'), usa la 'BASE DE CONOCIMIENTO (Restaurante)'.
-   Si la pregunta es genérica (ej. 'hola'), responde cordialmente.
-   Si la información no se encuentra en *ninguno* de los contextos, indica que no tienes esa información.";
// --- FIN MODIFICACIÓN ---

$final_prompt = 
    $system_instruction . "\n\n" .
    "CONTEXTO DE CONOCIMIENTO:\n" . $final_context . "\n\n" . // Usamos el contexto combinado
    "PREGUNTA DEL USUARIO: " . $user_query;


// --- 5. Preparar la Petición a Ollama ---
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

// --- 6. Llamar a la API de Ollama ---
$result = @file_get_contents($ollama_url, false, $context);

if ($result === FALSE) {
    http_response_code(503);
    echo json_encode(["error" => "Error al conectar con la API de Ollama. Asegúrate de que esté corriendo en $ollama_ip:$ollama_port."]);
} else {
    $ollama_response = json_decode($result, true);
    $model_response = $ollama_response['response'] ?? 'Respuesta del modelo no encontrada.';
    echo json_encode(["response" => $model_response]);
}

?>