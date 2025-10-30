<?php
// Configuración
header('Content-Type: application/json');
$ollama_ip = "127.0.0.1"; // ¡CAMBIA ESTO!
$ollama_port = "11434";
$ollama_model = "gemma3:4b";
$ollama_url = "http://$ollama_ip:$ollama_port/api/generate";

// --- 1. Base de Conocimiento Estática ---
$knowledge_base = "
Categoría: Horarios, Contacto y Ubicación

P: ¿Cuál es el horario de funcionamiento del restaurante?
R: Nuestros horarios generales son:
Lunes a Jueves: 11:00 AM - 10:00 PM
Viernes y Sábados: 11:00 AM - 11:00 PM
Domingos: 12:00 PM - 9:00 PM

P: ¿Hasta qué hora puedo pedir comida?
R: Para consumir en el local, el último pedido se toma 30 minutos antes del cierre. Para delivery, el último pedido se toma 1 hora antes del cierre.

P: ¿Abren en días festivos?
R: Cerramos únicamente en Navidad y Año Nuevo. En la mayoría de los otros feriados, trabajamos con horario reducido de 12:00 PM a 8:00 PM. Recomendamos consultar nuestras redes sociales para horarios especiales.

P: ¿Cómo puedo contactarlos?
R: Puedes contactarnos por:
Teléfono principal / Reservas: [+598 2XXX XXXX] (Opción 1 para Reservas, Opción 2 para Delivery)
WhatsApp Business: [+598 9X XXX XXXX]
Email General: info@restaurante.com
Email Reservas: reservas@restaurante.com
Instagram: @restaurante_oficial
Facebook: /Restaurante Oficial

P: ¿Dónde están ubicados?
R: Nuestra dirección es [Dirección específica, número], en el barrio [Nombre del barrio], Montevideo, Uruguay. Estamos cerca de [Punto de referencia, ej: Centro comercial].

Categoría: Menú y Productos

P: ¿Qué tipo de comida sirven?
R: Ofrecemos una variedad de platos que incluyen entradas como Nachos Supremos y Alitas de Pollo; platos principales como Hamburguesas (Clásica, BBQ), Pizzas artesanales (Margherita, Pepperoni), Pastas (Carbonara, Lasaña) y Carnes a la parrilla (Bife de Chorizo, Parrillada para 2). También tenemos postres caseros como Tiramisú y Brownie con Helado.

P: ¿Tienen menú infantil?
R: Sí, tenemos un menú especial para menores de 12 años que incluye opciones como milanesa con papas, pasta con manteca y mini hamburguesa. Todos los platos infantiles incluyen bebida y postre helado.

P: ¿Puedo personalizar mi pedido?
R: Sí, dentro de nuestras posibilidades. Podemos quitar o agregar ingredientes, cambiar el punto de cocción de las carnes y modificar guarniciones. Algunas modificaciones pueden tener un costo adicional.

P: ¿Los ingredientes son frescos?
R: Sí, todos nuestros ingredientes se reciben frescos diariamente. Las carnes provienen de proveedores locales certificados, las verduras se seleccionan cada mañana y las pastas se elaboran artesanalmente en el restaurante.

Categoría: Opciones Dietéticas y Alérgenos

P: ¿Tienen opciones veganas?
R: Sí, contamos con platos veganos en todas las categorías. Tenemos pizzas con queso vegano, pastas con salsas vegetales (Pomodoro), hamburguesas de legumbres (lentejas) y ensaladas completas.

P: ¿Tienen opciones sin gluten o para celíacos?
R: Sí, ofrecemos panes sin gluten para hamburguesas, pasta sin gluten y bases de pizza especiales. Usamos utensilios separados para evitar la contaminación cruzada, pero siempre debe informar a nuestro personal sobre su alergia al ordenar.

P: ¿Cómo manejan las alergias (lácteos, frutos secos, mariscos, etc.)?
R: Nuestro personal está capacitado para informar sobre alérgenos comunes (gluten, lácteos, frutos secos, mariscos, huevos, soja). Tenemos protocolos especiales de preparación para evitar contaminación cruzada. Es fundamental que informe sobre alergias específicas al momento de ordenar.

P: ¿Ofrecen opciones para dietas especiales como Keto o bajas en sodio?
R: Sí, tenemos opciones recomendadas. Para dietas Keto (bajas en carbohidratos) ofrecemos ensaladas con salmón y aguacate o bife con manteca de hierbas. Para dietas bajas en sodio, recomendamos pescados grillados o vegetales al vapor sin sal agregada.

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
R: Puedes reservar online a través de nuestro sitio web, por teléfono, por WhatsApp Business o presencialmente en el restaurante.

P: ¿Qué pasa si llego tarde a mi reserva?
R: Tenemos una tolerancia de 15 minutos. Si va a llegar más tarde, por favor contáctenos. Después de 15 minutos sin aviso, la mesa se libera para otros clientes.

P: ¿Cómo puedo cancelar mi reserva?
R: Las cancelaciones son gratuitas hasta 1 hora antes de la hora reservada. Para grupos grandes (más de 8 personas), requerimos 4 horas de anticipación.

P: ¿Qué métodos de pago aceptan?
R: Aceptamos efectivo (moneda local únicamente), tarjetas de débito y crédito (Visa, Mastercard, American Express), y pagos digitales como Mercado Pago (código QR) y transferencias bancarias.

Categoría: Instalaciones y Servicios Adicionales

Categoría: Eventos y Grupos

P: ¿Organizan eventos privados o para grupos grandes?
R: Sí, organizamos eventos como cumpleaños, aniversarios y eventos corporativos. Para grupos de más de 8 personas, recomendamos reservar con anticipación y se puede requerir una seña del 20%.

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

// --- 2. Obtener la Pregunta del Usuario ---
$input = json_decode(file_get_contents('php://input'), true);
$user_query = $input['query'] ?? '';

if (empty($user_query)) {
    http_response_code(400);
    echo json_encode(["error" => "No se recibió ninguna consulta."]);
    exit;
}

// --- 3. Construir el Prompt Enriquecido (Pseudo-RAG) ---
$system_instruction = "Usa la información proporcionada en la sección CONTEXTO DE CONOCIMIENTO para responder a la pregunta del usuario. Prioriza información del contexto cuando esté disponible. Si la pregunta es un saludo o small talk (por ejemplo 'hola'), responde de forma cordial y útil en lugar de indicar solamente que no hay información. Evita inventar hechos que no estén en el CONTEXTO; cuando falten datos específicos, admite la falta de información y ofrece alternativas útiles (por ejemplo, pedir más detalles o proporcionar información general aplicable).";

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