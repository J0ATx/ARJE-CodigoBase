<?php
// --- api_rag.php (VERSION INTEGRADA CON BD, CONTEXTO ESTATICO Y PDF) ---

// Configuración de la cabecera
header('Content-Type: application/json');

// --- 1. CONFIGURACIÓN DEL LLM (Ollama) ---
$ollama_ip = "127.0.0.1"; // ¡AJUSTA ESTO A TU IP DE OLLAMA!
$ollama_port = "11434";
$ollama_model = "gemma3:4b"; // Modelo a utilizar
$ollama_url_generate = "http://$ollama_ip:$ollama_port/api/generate";
$ollama_url_chat = "http://$ollama_ip:$ollama_port/api/chat";


// --- 2. BASE DE CONOCIMIENTO ESTÁTICA ---
$knowledge_base_static = "
Categoría: Horarios, Contacto y Ubicación

P: ¿Cuál es el horario de funcionamiento del restaurante?
R: Nuestros horarios generales son:
    Martes a Viernes: 19:00 - 00:00
    Sábados y Domingos: 12:00 - 16:00 y 19:00 - 00:00

P: ¿Hasta qué hora puedo pedir comida?
R: Para consumir en el local, el último pedido se toma 30 minutos antes del cierre. Para delivery, el último pedido se toma 1 hora antes del cierre.

P: ¿Abren en días festivos?
R: Cerramos únicamente en Navidad y Año Nuevo. En la mayoría de los otros feriados, trabajamos con horario reducido de 16:00 a 00:00. Recomendamos consultar nuestras redes sociales para horarios especiales.

P: ¿Cómo puedo contactarlos?
R: Puedes contactarnos por:
    Teléfono Principal: +598 4372 9333
    WhatsApp Business: +598 09 241 2772
    Instagram: @los3tanos_pizzeria
    Facebook: /Pizzeria Los 3 Tanos | Atlántida

P: ¿Dónde están ubicados?
R: Nuestra dirección es M. Ferreira y Central, en el barrio Las Toscas, Canelones, Uruguay. Estamos a dos calles de Playa Las Toscas.

Categoría: Menú y Productos

P: ¿Qué tipo de comida sirven?
R: Ofrecemos una variedad de platos que incluyen opciones de Pizzería con pizzas enteras (como el metro de mozzarella) y porciones, y opciones Para Picar como Aritos de Cebolla, Rabas y Nuggets.
    Nuestros platos principales se centran en:
        Asados (Carnes a la parrilla), como el Asado de tira y Entrecot grillé.
        Pastas Caseras, incluyendo Ñoquis de papa y Sorrentinos de jamón y muzzarella.
        Hamburguesas (completas y clásicas) y Sándwiches (como el Napolitano y el Olímpico).
    También contamos con un Menú Vegetariano (que incluye Hamburguesa y Milanesa de soja) y un Menú para los pequeños. Puedes acompañar tu comida con Porciones de guarniciones como Ensalada Mixta , Puré de Papas o Fritas.

P: ¿Tienen menú infantil?
R: Sí, contamos con un Menú para los pequeños.
    Los platos disponibles en este menú son:
        Finito de lomo con puré 
        Hamburguesa (schneck) al pan con fritas (con jamón y mozzarella) 
        Hamburguesa con Fritas (plato o pan) 
        Miniaturas (Menú Pequeño) 
        Nuggets con Fritas (Menú Pequeño) 
        Pancho con Fritas (Menú Pequeño)

P: ¿Puedo personalizar mi pedido?
R: Sí, dentro de nuestras posibilidades. Podemos quitar o agregar ingredientes, cambiar el punto de cocción de las carnes y modificar guarniciones. Algunas modificaciones pueden tener un costo adicional.

P: ¿Los ingredientes son frescos?
R: Sí, todos nuestros ingredientes se reciben frescos diariamente. Las carnes provienen de proveedores locales certificados, las verduras se seleccionan cada mañana y las pastas se elaboran artesanalmente en el restaurante.

Categoría: Opciones Dietéticas y Alérgenos

P: ¿Tienen opciones veganas?
R: Sí, contamos con un Menú Vegetariano  que ofrece las siguientes opciones:
    Gramajo chico (Vegetariano) 
    Hamburguesa de soja al pan con guarnición 
    Hamburguesa de soja al plato con guarnición 
    Milanesa de soja con guarnición 
    Pancho de soja

P: ¿Tienen opciones sin gluten o para celíacos?
R: Para consultas sobre opciones sin gluten o aptas para celíacos, te recomendamos contactar directamente con el restaurante antes de realizar tu pedido. De esta manera, podrás verificar la disponibilidad de panes, pastas o bases de pizza sin gluten y consultar sobre sus procedimientos para evitar la contaminación cruzada, asegurando así una experiencia segura.

P: ¿Cómo manejan las alergias (lácteos, frutos secos, mariscos, etc.)?
R: Nuestro personal está capacitado para informar sobre alérgenos comunes (gluten, lácteos, frutos secos, mariscos, huevos, soja). Tenemos protocolos especiales de preparación para evitar contaminación cruzada. Es fundamental que informe sobre alergias específicas al momento de ordenar.

P: ¿Ofrecen opciones para dietas especiales como Keto o bajas en sodio?
R: Para consultas sobre opciones para dietas especiales como Keto o bajas en sodio, te recomendamos contactar directamente con el restaurante al momento de realizar tu pedido. De esta manera, podrás preguntar si pueden adaptar platos como el Entrecot grillé o la Merluza a la plancha  para ajustarse a una dieta baja en carbohidratos o sin sal agregada, asegurando así una experiencia satisfactoria.

Categoría: Promociones y Descuentos

P: ¿Qué promociones semanales tienen?
R: Tenemos varias promociones vigentes:
    Lunes de Pizza: 2x1 en pizzas medianas (no válido para delivery).
    Martes de Pasta: 30% de descuento en pastas (6:00 PM - 10:00 PM).
    Miércoles de Parrilla: 20% de descuento en parrilladas (todo el día).
    Jueves de Hamburguesas: Combo de hamburguesa + papas + bebida por $15.000 (7:00 PM - 10:00 PM).
    Happy Hour: Lunes a Viernes (4:00 PM - 6:00 PM) con 2x1 en bebidas seleccionadas.

P: ¿Tienen algún programa de fidelidad o descuento por cumpleaños?
R: Sí. Con 10 visitas registradas accedes a la Tarjeta VIP con 10% de descuento permanente (no acumulable). También tenemos el Club de Cumpleañeros: registrándote, obtienes un postre gratuito durante el mes de tu cumpleaños (con consumo mínimo).

P: ¿Puedo combinar varias promociones?
R: No, las promociones no son acumulables entre sí.

Categoría: Servicios (Delivery, Reservas, Pagos)

P: ¿Ofrecen servicio a domicilio (delivery)?
R: Sí, ofrecemos delivery en un radio de 5 kilómetros desde el restaurante. El costo de envío es de $2.500 y es gratuito en pedidos superiores a $20.000. El pedido mínimo es de $8.000 y el tiempo estimado de entrega es de 30 a 45 minutos.

P: ¿Puedo pedir comida para llevar (take away)?
R: Sí, ofrecemos servicio de take away. El tiempo de preparación es de 15-25 minutos y puedes hacer tu pedido por teléfono, WhatsApp o presencialmente.

P: ¿Necesito hacer una reserva?
R: Aceptamos clientes sin reserva según disponibilidad. Sin embargo, recomendamos fuertemente hacer reservas, especialmente para fines de semana, horarios pico y grupos grandes, para garantizar su mesa.

P: ¿Cómo puedo hacer una reserva?
R: Puedes reservar online a través de nuestro sitio web, por teléfono, por WhatsApp o presencialmente en el restaurante.

P: ¿Qué pasa si llego tarde a mi reserva?
R: Tenemos una tolerancia de 15 minutos. Si va a llegar más tarde, por favor contáctenos. Después de 15 minutos sin aviso, la mesa se libera para otros clientes.

P: ¿Cómo puedo cancelar mi reserva?
R: Las cancelaciones son gratuitas hasta 1 hora antes de la hora reservada. Para grupos grandes (más de 8 personas), requerimos 4 horas de anticipación.

P: ¿Qué métodos de pago aceptan?
R: Aceptamos efectivo (moneda local únicamente), tarjetas de débito y crédito (Visa, Mastercard, American Express), y pagos digitales como Mercado Pago (código QR) y transferencias bancarias.

Categoría: Eventos y Grupos

P: ¿Organizan eventos privados o para grupos grandes?
R: Sí, organizamos eventos como cumpleaños, aniversarios y eventos corporativos. Para grupos de más de 6 personas, recomendamos reservar con anticipación y se puede requerir una seña del 20%.

P: ¿Tienen un salón privado?
R: Sí, tenemos un salón privado con capacidad para 25 personas, ideal para reuniones de trabajo o celebraciones. Tiene un costo adicional y requiere reserva mínima de 4 horas.

P: ¿Tienen menús especiales para grupos?
R: Sí, ofrecemos tres opciones de menús grupales (Opción A, B y C) con precios fijos por persona, que incluyen entrada, principal, postre y bebidas (algunas opciones con bebidas ilimitadas).

P: ¿Puedo llevar mi propia torta de cumpleaños?
R: Sí, permitimos traer tortas externas. Cobramos un servicio de descorche de $2.000 que incluye los platos, cubiertos y el servicio.

Categoría: Políticas y Reclamos

P: ¿Qué hago si tengo un problema con mi comida (pedido incorrecto, mal estado, frío)?
R: Por favor, informe inmediatamente a su mesero o solicite hablar con el manager. Las quejas sobre la comida deben realizarse dentro de los primeros 15 minutos de servida (o 10 minutos para delivery). Evaluaremos la situación y ofreceremos una solución, que puede ser el reemplazo inmediato del plato o una compensación.

P: ¿Qué pasa si mi pedido (local o delivery) tarda mucho?
R: Si su espera supera los 35 minutos en el local o los 60 minutos en delivery, ofrecemos un descuento del 15% en la cuenta total como compensación.

P: ¿En qué casos no aceptan devoluciones de platos?
R: No aceptamos devoluciones por 'cambio de opinión' o gusto personal si el plato fue preparado correctamente. Tampoco se aceptan reclamos de platos que ya han sido consumidos en más del 50%, o quejas realizadas al momento de pagar sin haber mencionado el problema previamente.

P: ¿La propina es obligatoria?
R: La propina no es obligatoria y queda a criterio del cliente. Para grupos grandes (más de 8 personas) sugerimos un 10% por el servicio adicional, pero siempre es opcional.
";


// --- 3. RECEPCIÓN DE LA PREGUNTA Y EL CONTEXTO DEL USUARIO ---
$input = json_decode(file_get_contents('php://input'), true);
$messages = $input['messages'] ?? [];
$user_query = $input['query'] ?? '';
$user_context = $input['context'] ?? ''; // Texto extraído del PDF


// --- 4. CONSULTA Y EXTRACCIÓN DE DATOS DE LA BASE DE DATOS (NUEVA LÓGICA) ---
require_once '../../../../Control/Conexion/conexion.php'; // <-- ¡VERIFICA ESTA RUTA!

$db_context = "";

try {
    // Lista de las vistas/tablas que queremos extraer
    $vistas = [
        'Ingresos_Totales', 'Cantidad_Clientes', 'Cantidad_Personal', 
        'Ingresos_Por_Cliente', 'Ingresos_Por_Camarero', 'Ingresos_Por_Producto', 
        'Ingresos_Por_Pago', 'Ingresos_Por_Fecha', 'No_Show_Por_Cliente', 
        'No_Show_Por_Fecha', 'Ventas_Por_Producto', 'Calificacion_Promedio'
    ];
    
    $data_vistas = [];
    foreach ($vistas as $vista) {
        $sql = "SELECT * FROM $vista;";
        $stmt = $con->prepare($sql);
        $stmt->execute();
        $data_vistas[$vista] = $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Formatear los datos de la BD para el LLM
    $db_context .= "### RESUMEN DE DATOS ANALÍTICOS DE LA APLICACIÓN ###\n\n";

    foreach ($data_vistas as $vista => $datos) {
        $db_context .= "--- INICIO DATOS DE VISTA: $vista ---\n";
        
        if (empty($datos)) {
            $db_context .= "No se encontraron datos.\n";
            continue;
        }

        // Usamos JSON_PRETTY_PRINT para que el modelo lo lea mejor
        $db_context .= json_encode($datos, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        
        $db_context .= "\n--- FIN DATOS DE VISTA: $vista ---\n\n";
    }

} catch (Exception $e) {
    error_log("Error al consultar la BD para el RAG: " . $e->getMessage());
    $db_context = "ERROR: No se pudo cargar los datos analíticos de la base de datos: " . $e->getMessage();
}


// --- 5. CONSTRUCCIÓN DEL CONTEXTO COMBINADO (RAG) ---
$final_context = "";

// 5.1. Contexto Estático (Restaurante)
$final_context .= "--- INICIO BASE DE CONOCIMIENTO (Restaurante) ---\n" . 
                 $knowledge_base_static . 
                 "\n--- FIN BASE DE CONOCIMIENTO ---\n\n";

// 5.2. Contexto Dinámico (Base de Datos)
if (!empty(trim($db_context))) {
    $final_context .= "--- INICIO CONTEXTO ANALÍTICO DE LA BASE DE DATOS ---\n" . 
                      $db_context . 
                      "\n--- FIN CONTEXTO ANALÍTICO DE LA BASE DE DATOS ---\n\n";
}

// 5.3. Contexto del Usuario (PDF)
$placeholder_text = 'Aquí aparecerá el texto extraído del PDF.';
if (!empty(trim($user_context)) && trim($user_context) !== $placeholder_text) {
    $final_context .= "--- INICIO CONTEXTO PDF ADJUNTO ---\n" . 
                      $user_context . 
                      "\n--- FIN CONTEXTO PDF ---";
}


// --- 6. CONSTRUCCIÓN DEL CONTEXTO/SYSTEM ---
$system_instruction = "Eres un asistente de IA para el panel Admin (SARI). Responde usando SOLO la información del CONTEXTO DE CONOCIMIENTO.

El CONTEXTO DE CONOCIMIENTO tiene tres secciones:
1.  'BASE DE CONOCIMIENTO (Restaurante)' (fija).
2.  'CONTEXTO ANALÍTICO DE LA BASE DE DATOS' (JSON de métricas y ventas).
3.  'CONTEXTO PDF ADJUNTO' (si existe).

Prioriza datos analíticos (sección 2) para preguntas de métricas; usa sección 1 para info institucional; usa sección 3 para preguntas específicas del PDF. Si falta información, indícalo. Responde en español.";

$system_with_context = $system_instruction . "\n\nCONTEXTO DE CONOCIMIENTO:\n" . $final_context;

// --- 7. LLAMADA A OLLAMA: CHAT con historial o GENERATE simple ---
if (!empty($messages)) {
    $system_message = [
        'role' => 'system',
        'content' => $system_with_context
    ];
    array_unshift($messages, $system_message);

    $data = [
        'model' => $ollama_model,
        'messages' => $messages,
        'stream' => false
    ];

    $options = [
        'http' => [
            'header'  => "Content-Type: application/json\r\n",
            'method'  => 'POST',
            'content' => json_encode($data),
            'timeout' => 60,
        ],
    ];
    $ctx  = stream_context_create($options);
    $result = @file_get_contents($ollama_url_chat, false, $ctx);

    if ($result === FALSE) {
        http_response_code(503);
        echo json_encode(["error" => "Lamento no poder ayudarte en este momento."]);
    } else {
        $ollama_response = json_decode($result, true);
        $model_response = $ollama_response['message']['content'] ?? 'Respuesta del modelo no encontrada.';
        echo json_encode(["response" => $model_response]);
    }
} else {
    if (empty($user_query)) {
        http_response_code(400);
        echo json_encode(["error" => "No se recibió ninguna consulta."]);
        exit;
    }

    $final_prompt = $system_with_context . "\n\nPREGUNTA DEL USUARIO: " . $user_query;

    $data = [
        'model' => $ollama_model,
        'prompt' => $final_prompt,
        'stream' => false,
        'options' => [
            'temperature' => 0.1,
        ]
    ];
    $options = [
        'http' => [
            'header'  => "Content-Type: application/json\r\n",
            'method'  => 'POST',
            'content' => json_encode($data),
            'timeout' => 60,
        ],
    ];
    $ctx  = stream_context_create($options);
    $result = @file_get_contents($ollama_url_generate, false, $ctx);

    if ($result === FALSE) {
        http_response_code(503);
        echo json_encode(["error" => "Error al conectar con la API de Ollama."]);
    } else {
        $ollama_response = json_decode($result, true);
        $model_response = $ollama_response['response'] ?? 'Respuesta del modelo no encontrada.';
        echo json_encode(["response" => $model_response]);
    }
}

?>