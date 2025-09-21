<?php
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST["email"];
    $contrasenia = $_POST["contrasenia"];
    require_once "../../Conexión/clienteNoRegistrado.php";
    include "funLogin.php";
    $sql = "SELECT * FROM Usuario WHERE gmail = ?";
    $resultado = $con->prepare($sql);
    $resultado->execute([$email]);
    $usuario = $resultado->fetch(PDO::FETCH_ASSOC);
    if ($usuario && password_verify($contrasenia, $usuario['contrasenia'])) { //Compara la contraseña ingresada con la almacenada en hash
        iniciarSesion($usuario);
        if($_SESSION["rol"] !== "Cliente"){
            echo json_encode([
                "exito" => true,
                "rol" => $_SESSION["rol"]
            ]);
        }else{
            echo json_encode([
                "exito" => false,
                "errores" => ["Correo electrónico o contraseña incorrectos."]
            ]);
        }
    } else {
        echo json_encode(["exito" => false, "errores" => ["Correo electrónico o contraseña incorrectos."]]);
    }
} else {
    echo json_encode(["exito" => false, "errores" => ["Método no permitido"]]);
}

