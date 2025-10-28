<?php
header('Content-Type: application/json');
require_once "../../Conexion/clienteNoRegistrado.php";


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
$sql1 = "CALL Validar_SignUp_Cliente(?, ?, ?, ?, @usuario, @mensaje);";
$stmt1 = $con->prepare($sql1);
$stmt1->execute([$nombre, $apellido, $contraseniaHash, $email]);

$sql2 = "SELECT @usuario, @mensaje;";
$stmt2 = $con->prepare($sql2);
$stmt2->execute();
$resultado = $stmt2->fetch(PDO::FETCH_ASSOC);
$usuario_json = $resultado['@usuario'] ?? null;
$mensaje = $resultado['@mensaje'] ?? null;
$usuario = $usuario_json ? json_decode($usuario_json, true) : null;

if ($usuario === null) {
    echo json_encode(["exito" => false, "errores" => [$mensaje]]);
    exit;
} else {
    include "../../SignIn/BackEnd/funLogin.php";
    iniciarSesion($usuario);
    echo json_encode(["exito" => true, "mensaje" => "Registro exitoso."]);
}
