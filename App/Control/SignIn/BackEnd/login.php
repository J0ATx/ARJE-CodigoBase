<?php
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST["email"];
    $contrasenia = $_POST["contrasenia"];
    require_once "../../Conexión/conexion.php";
    $sql = "SELECT * FROM Usuario WHERE gmail = ?";
    $resultado = $con->prepare($sql);
    $resultado->execute([$email]);
    $usuario = $resultado->fetch(PDO::FETCH_ASSOC);
    if($usuario && password_verify($contrasenia, $usuario['contrasenia'])){ //Compara la contraseña ingresada con la almacenada en hash
        if (session_status() === PHP_SESSION_ACTIVE) {
            session_destroy();
        }
        
        session_start();
        $_SESSION["usuario_id"] = $usuario["idUsuario"];
        $_SESSION["nombre"] = $usuario["nombre"];
        $_SESSION["apellido"] = $usuario["apellido"];
        $_SESSION["logged"] = true; // Para verficar si el usuario está logueado
        
        // Verificar si el usuario es gerente
        $sql_gerente = "SELECT COUNT(*) as es_gerente FROM Gerente WHERE idUsuario = ?";
        $resultado_gerente = $con->prepare($sql_gerente);
        $resultado_gerente->execute([$usuario["idUsuario"]]);
        $es_gerente = $resultado_gerente->fetch(PDO::FETCH_ASSOC)["es_gerente"] > 0;
        
        // Guardar en sesión si es gerente
        $_SESSION["es_gerente"] = $es_gerente;
        
        echo json_encode([
            "exito" => true,
            "es_gerente" => $es_gerente
        ]);
    } else {
        echo json_encode(["exito" => false, "errores" => ["Correo electrónico o contraseña incorrectos."]]);
    }
} else {
    echo json_encode(["exito" => false, "errores" => ["Método no permitido"]]);
}