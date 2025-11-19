<?php
header('Content-Type: application/json');
$ollama_ip = "127.0.0.1";
$ollama_port = "11434";
$ollama_model = "gemma3:4b";
$ollama_url = "http://$ollama_ip:$ollama_port/api/chat";

$knowledge_base = "
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
R: Ofrecemos una variedad de platos que incluyen opciones de Pizzería con pizzas enteras (como el metro de mozzarella) y porciones, y opciones Para Picar como Aritos de Cebolla, Rabas y Nuggets. Nuestros platos principales se centran en:
    Asados (Carnes a la parrilla), como el Asado de tira y Entrecot grillé.
    Pastas Caseras, incluyendo Ñoquis de papa y Sorrentinos de jamón y muzzarella.
    Hamburguesas (completas y clásicas) y Sándwiches (como el Napolitano y el Olímpico). También contamos con un Menú Vegetariano (que incluye Hamburguesa y Milanesa de soja) y un Menú para los pequeños. Puedes acompañar tu comida con Porciones de guarniciones como Ensalada Mixta, Puré de Papas o Fritas.

P: ¿Tienen menú infantil? 
R: Sí, contamos con un Menú para los pequeños. Los platos disponibles en este menú son:
    Finito de lomo con puré
    Hamburguesa (schneck) al pan con fritas (con jamón y mozzarella)
    Hamburguesa con Fritas (plato o pan)
    Miniaturas (Menú Pequeño)
    Nuggets con Fritas (Menú Pequeño)
    Pancho con Fritas (Menú Pequeño)

P: ¿Puedo personalizar mi pedido? 
R: Sí, dentro de nuestras posibilidades. Podemos quitar o agregar ingredientes, cambiar el punto de cocción de las carnes y modificar guarniciones. Algunas modificaciones pueden tener un costo adicional, por favor consulte al realizar su pedido.

P: ¿Los ingredientes son frescos? 
R: Sí, todos nuestros ingredientes se reciben frescos diariamente. Las carnes provienen de proveedores locales certificados, las verduras se seleccionan cada mañana y las pastas se elaboran artesanalmente en el restaurante.

Categoría: Opciones Dietéticas y Alérgenos

P: ¿Tienen opciones veganas? 
R: Sí, contamos con un Menú Vegetariano que ofrece las siguientes opciones:
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
R: Para consultas sobre opciones para dietas especiales como Keto o bajas en sodio, te recomendamos contactar directamente con el restaurante al momento de realizar tu pedido. De esta manera, podrás preguntar si pueden adaptar platos como el Entrecot grillé o la Merluza a la plancha para ajustarse a una dieta baja en carbohidratos o sin sal agregada.

Categoría: Promociones y Descuentos

P: ¿Qué promociones semanales tienen? 
R: Nuestras promociones semanales y ofertas especiales cambian constantemente. Para obtener la información más precisa y actualizada sobre las promociones vigentes (como 2x1, descuentos por día o happy hours), le recomendamos:
    Visitar nuestra página web.
    Consultar directamente con el restaurante: Puede contactarnos por teléfono o a través de nuestras redes sociales para verificar las promociones específicas que aplican en este momento.

P: ¿Tienen algún programa de fidelidad o descuento por cumpleaños? 
R: Sí. Con 10 visitas registradas accedes a la Tarjeta VIP con un porcentaje de descuento permanente (no acumulable). También tenemos el Club de Cumpleañeros: registrándote, obtienes un postre gratuito durante el mes de tu cumpleaños (con consumo mínimo).

P: ¿Puedo combinar varias promociones? 
R: No, las promociones no son acumulables entre sí.

Categoría: Servicios (Delivery, Reservas, Pagos)

P: ¿Ofrecen servicio a domicilio (delivery)? 
R: Sí, ofrecemos delivery en un radio de 5 kilómetros desde el restaurante. Para conocer el costo de envío, el monto mínimo de compra y las condiciones para el envío gratuito, por favor contacte directamente al restaurante. El tiempo estimado de entrega es de 30 a 45 minutos.

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
R: Sí, organizamos eventos como cumpleaños, aniversarios y eventos corporativos. Para grupos de más de 6 personas, recomendamos reservar con anticipación y se puede requerir una seña previa.

P: ¿Tienen un salón privado? 
R: Sí, tenemos un salón privado con capacidad para 25 personas, ideal para reuniones de trabajo o celebraciones. El uso del salón puede tener un costo adicional y requiere reserva mínima de 4 horas. Consulte disponibilidad y valores con el restaurante.

P: ¿Tienen menús especiales para grupos? 
R: Sí, ofrecemos opciones de menús grupales con precios fijos por persona, que incluyen entrada, principal, postre y bebidas. Para conocer los precios actualizados de cada opción, por favor contáctenos.

P: ¿Puedo llevar mi propia torta de cumpleaños? 
R: Sí, permitimos traer tortas externas. Cobramos un servicio de descorche que incluye los platos, cubiertos y el servicio. Contacte al restaurante para consultar el costo actual de este servicio.

Categoría: Políticas y Reclamos

P: ¿Qué hago si tengo un problema con mi comida (pedido incorrecto, mal estado, frío)? 
R: Por favor, informe inmediatamente a su mesero o solicite hablar con el manager. Las quejas sobre la comida deben realizarse dentro de los primeros 15 minutos de servida (o 10 minutos para delivery). Evaluaremos la situación y ofreceremos una solución, que puede ser el reemplazo inmediato del plato o una compensación.

P: ¿Qué pasa si mi pedido (local o delivery) tarda mucho? 
R: Si su espera supera los tiempos estipulados (35 minutos en el local o 60 minutos en delivery), ofrecemos un descuento en la cuenta total como compensación.

P: ¿En qué casos no aceptan devoluciones de platos? 
R: No aceptamos devoluciones por 'cambio de opinión' o gusto personal si el plato fue preparado correctamente. Tampoco se aceptan reclamos de platos que ya han sido consumidos en más del 50%, o quejas realizadas al momento de pagar sin haber mencionado el problema previamente.

P: ¿La propina es obligatoria? 
R: La propina no es obligatoria y queda a criterio del cliente. Para grupos grandes (más de 8 personas) podemos sugerir un porcentaje por el servicio adicional, pero siempre es opcional.
";

$input = json_decode(file_get_contents('php://input'), true);
$messages = $input['messages'] ?? [];

if (empty($messages)) {
    http_response_code(400);
    echo json_encode(["error" => "No se recibió ningún historial de mensajes."]);
    exit;
}

$system_instruction = "Eres Maitre, un asistente virtual amable y servil del restaurante 'Los 3 Tanos'. 
Usa la información proporcionada en la sección CONTEXTO DE CONOCIMIENTO para responder a la pregunta del usuario.
DIRECTRIZ DE FECHA: Toda la información contenida en este CONTEXTO DE CONOCIMIENTO tiene como fecha de validez y última actualización el 19 de Noviembre de 2025. Si el usuario pregunta por la actualidad de la información, debes proporcionar esta fecha.
Prioriza información del contexto cuando esté disponible.
Si la pregunta es un saludo o small talk (por ejemplo 'hola'), responde de forma cordial y útil.
Evita inventar hechos que no estén en el CONTEXTO; cuando falten datos específicos, admite la falta de información y ofrece alternativas útiles.
Responde siempre en español.

RESTRICCIÓN CRÍTICA DE PRECIOS: Bajo ninguna circunstancia, y sin excepción, debes proporcionar precios, costes, tarifas, montos monetarios o cualquier información relacionada con el valor económico de un producto o servicio. Si la información RAG recuperada contiene un precio, ignóralo por completo y no lo menciones en tu respuesta.

CONTEXTO DE CONOCIMIENTO:
" . $knowledge_base;

$system_message = [
    "role" => "system",
    "content" => $system_instruction
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
$context  = stream_context_create($options);

$result = @file_get_contents($ollama_url, false, $context);

if ($result === FALSE) {
    http_response_code(503);
    // echo json_encode(["error" => "Error al conectar con la API de Ollama. Asegúrate de que esté corriendo en $ollama_ip:$ollama_port."]);
    echo json_encode(["error" => "Lamento no poder ayudarte en este momento, estoy teniendo problemas internos."]);
} else {
    $ollama_response = json_decode($result, true);
    
    $model_response = $ollama_response['message']['content'] ?? 'Respuesta del modelo no encontrada.';
    
    echo json_encode(["response" => $model_response]);
}

?>