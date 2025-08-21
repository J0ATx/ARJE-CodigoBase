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
    if ($usuario && password_verify($contrasenia, $usuario['contrasenia'])) { //Compara la contraseña ingresada con la almacenada en hash
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

        // Verificar si el usuario es chef
        $sql_chef = "SELECT COUNT(*) as es_chef FROM Chef WHERE idUsuario = ?";
        $resultado_chef = $con->prepare($sql_chef);
        $resultado_chef->execute([$usuario["idUsuario"]]);
        $es_chef = $resultado_chef->fetch(PDO::FETCH_ASSOC)["es_chef"] > 0;

        // Verificar si el usuario es ChefEjecutivo
        $sql_chef_ejecutivo = "SELECT COUNT(*) as es_chef_ejecutivo FROM ChefEjecutivo WHERE idUsuario = ?";
        $resultado_chef_ejecutivo = $con->prepare($sql_chef_ejecutivo);
        $resultado_chef_ejecutivo->execute([$usuario["idUsuario"]]);
        $es_chef_ejecutivo = $resultado_chef_ejecutivo->fetch(PDO::FETCH_ASSOC)["es_chef_ejecutivo"] > 0;

        // Verificar si el usuario es mozo
        $sql_mozo = "SELECT COUNT(*) as es_mozo FROM Mozo WHERE idUsuario = ?";
        $resultado_mozo = $con->prepare($sql_mozo);
        $resultado_mozo->execute([$usuario["idUsuario"]]);
        $es_mozo = $resultado_mozo->fetch(PDO::FETCH_ASSOC)["es_mozo"] > 0;



        if ($es_gerente == true) {
            $_SESSION["rol"] = "Gerente";
        } else if ($es_chef == true) {
            $_SESSION["rol"] = "Chef";
        } else if ($es_chef_ejecutivo == true) {
            $_SESSION["rol"] = "ChefEjecutivo";
        } else if ($es_mozo == true) {
            $_SESSION["rol"] = "Mozo";
        } else {
            $_SESSION["rol"] = "Cliente";
        }


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
