<?php
header('Content-Type: application/json');
require_once "../../Conexión/conexion.php";


if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["exito" => false, "errores" => ["Solicitud no válida. Solo se aceptan solicitudes POST."]]);
    exit;
}

$required_fields = ['nombre', 'apellido', 'email', 'contrasenia'];
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
}

$nombre = trim($_POST["nombre"]);
$apellido = trim($_POST["apellido"]);
$email = trim($_POST["email"]);
$contrasenia = $_POST["contrasenia"];


$errores = [];


if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errores[] = "El formato del email no es válido.";
}


if (
    strlen($contrasenia) < 8 ||
    !preg_match('/[A-Za-z]/', $contrasenia) ||
    !preg_match('/\d/', $contrasenia) ||
    !preg_match('/[^A-Za-z0-9]/', $contrasenia)
) {
    $errores[] = "La contraseña debe tener al menos 8 caracteres, incluir letras, números y caracteres especiales.";
}

if (!empty($errores)) {
    echo json_encode(["exito" => false, "errores" => $errores]);
    exit;
}

$contraseniaHash = password_hash($contrasenia, PASSWORD_DEFAULT);
$checkEmail = $con->prepare("SELECT COUNT(*) FROM Cliente WHERE cliente_id = ?");
$checkEmail->execute([$email]);
if ($checkEmail->fetchColumn() > 0) {
    echo json_encode(["exito" => false, "errores" => ["El correo electrónico ya está registrado."]]);
} else {
    $sql = "INSERT INTO Cliente(cliente_nombre, cliente_apellido, cliente_contrasenia, cliente_id) VALUES (?, ?, ?, ?)";
    $stmt = $con->prepare($sql);
    $stmt->execute([$nombre, $apellido, $contraseniaHash, $email]);
    include "../../SignIn/BackEnd/funLogin.php";
    $sql = "SELECT * FROM Cliente WHERE cliente_id = ?";
    
    $stmt = $con->prepare($sql);
    $stmt->execute([$email]);
    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
    iniciarSesion($usuario);
    echo json_encode(["exito" => true, "mensaje" => "Registro exitoso."]);
}
