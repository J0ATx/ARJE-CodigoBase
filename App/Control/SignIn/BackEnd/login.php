<?php
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST["email"];
    $contrasenia = $_POST["contrasenia"];
    require_once "../../Conexion/clienteNoRegistrado.php";
    include "funLogin.php";

    $sql1 = "CALL Validar_SignIn_Cliente(?, ?, @usuario, @mensaje);";
    $stmt1 = $con->prepare($sql1);
    $stmt1->execute([$email, $contrasenia]);

    $sql2 = "SELECT @usuario, @mensaje;";
    $stmt2 = $con->prepare($sql2);
    $stmt2->execute();

    $resultado = $stmt2->fetch(PDO::FETCH_ASSOC);
    $usuario_json = $resultado['@usuario'] ?? null;
    $mensaje = $resultado['@mensaje'] ?? null;

    $usuario = $usuario_json ? json_decode($usuario_json, true) : null;

    if (!$usuario) {
        echo json_encode(["exito" => false, "errores" => [$mensaje]]);
        exit;
    }

    if (password_verify($contrasenia, $usuario['contrasenia'])) {
        iniciarSesion($usuario);
        echo json_encode([
            "exito" => true,
            "rol" => $_SESSION["rol"]
        ]);
    } else {
        echo json_encode(["exito" => false, "errores" => ["Correo electrónico o contraseña incorrectos."]]);
    }
} else {
    echo json_encode(["exito" => false, "errores" => ["Método no permitido"]]);
}
?>

