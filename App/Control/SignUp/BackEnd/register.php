<?php
header('Content-Type: application/json');
require_once "../../Conexión/conexion.php"; // Incluye el archivo de conexión a la BD

// Verificar si es una solicitud POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["exito" => false, "errores" => ["Solicitud no válida. Solo se aceptan solicitudes POST."]]);
    exit;
}

// Validar que todos los campos requeridos estén presentes
$required_fields = ['nombre', 'email', 'telefono', 'contrasenia'];
$missing_fields = [];
foreach ($required_fields as $field) {
    if (!isset($_POST[$field]) || empty($_POST[$field])) {
        $missing_fields[] = $field;
    }
}

if (!empty($missing_fields)) {
    echo json_encode([
        "exito" => false, 
        "errores" => ["Los siguientes campos son requeridos: " . implode(', ', $missing_fields)]
    ]);
    exit;
} else {
    
}

// Obtener y limpiar los valores del POST
$nombre = trim($_POST["nombre"]);
$email = trim($_POST["email"]);
$telefono = trim($_POST["telefono"]);
$contrasenia = $_POST["contrasenia"];

// Validaciones adicionales
$errores = [];

// Validar nombre
if (strlen($nombre) < 2) {
    $errores[] = "El nombre debe tener al menos 2 caracteres.";
}

// Validar email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errores[] = "El formato del email no es válido.";
}

// Validar teléfono (solo números, exactamente 9 dígitos)
if (!preg_match('/^[0-9]{9}$/', $telefono)) {
    $errores[] = "El teléfono debe contener exactamente 9 dígitos numéricos.";
}

// Validar contraseña
if (strlen($contrasenia) < 6) {
    $errores[] = "La contraseña debe tener al menos 6 caracteres.";
}

if (!empty($errores)) {
    echo json_encode(["exito" => false, "errores" => $errores]);
    exit;
}

// Encriptar la contraseña
$contraseniaHash = password_hash($contrasenia, PASSWORD_DEFAULT);
$checkEmail = $con->prepare("SELECT COUNT(*) FROM Usuario WHERE gmail = ?");
$checkEmail->execute([$email]); // Verifica si el correo ya existe
$checkTel = $con->prepare("SELECT COUNT(*) FROM Usuario WHERE numTel = ?");
$checkTel->execute([$telefono]); // Verifica si el teléfono ya existe
if ($checkEmail->fetchColumn() > 0) { // Ve si se repite el valor en otra columna
    echo json_encode(["exito" => false, "errores" => ["El correo electrónico ya está registrado."]]);
} elseif ($checkTel->fetchColumn() > 0) {
    echo json_encode(["exito" => false, "errores" => ["El número de teléfono ya está registrado."]]);
} else {
    $sql = "INSERT INTO Usuario(nombre, contrasenia, gmail, numTel) VALUES (?, ?, ?, ?)";
    $stmt = $con->prepare($sql); // Prepara la consulta SQL
    $stmt->execute([$nombre, $contraseniaHash, $email, $telefono]); // Ejecuta la consulta
    $sql = "INSERT INTO Cliente(idUsuario, noShows, platilloFav) VALUES (?, ?, ?)";
    $stmt = $con->prepare($sql); // Prepara la consulta SQL
    $stmt->execute([$con->lastInsertId(), 0, null]); // Ejecuta la consulta
    echo json_encode(["exito" => true, "mensaje" => "Registro exitoso."]);
}
